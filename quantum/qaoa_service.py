"""
Riderzpro — QAOA FastAPI microservice  (port 5001, localhost only)
All travel times are SYNTHETIC. Labels appear in every response.
"""
import time
from typing import Optional
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from qaoa_assignment import (
    classical_solve, build_cost_matrix, run_qaoa,
    RIDERS_DEFAULT, JOBS_DEFAULT, COST_MATRIX_DEFAULT,
)

app = FastAPI(title="Riderzpro QAOA Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
    allow_methods=["*"], allow_headers=["*"],
)


class RiderIn(BaseModel):
    id: str; name: str; lat: float; lng: float

class JobIn(BaseModel):
    order_id: str; label: str; lat: float; lng: float

class OptimiseRequest(BaseModel):
    p:      int   = Field(2,    ge=1, le=5)
    shots:  int   = Field(8192, ge=512, le=32768)
    seed:   int   = Field(42)
    riders: Optional[list[RiderIn]] = None
    jobs:   Optional[list[JobIn]]   = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "Riderzpro QAOA", "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ")}


@app.get("/cost-matrix")
def get_cost_matrix():
    return {
        "riders": RIDERS_DEFAULT, "jobs": JOBS_DEFAULT,
        "cost_matrix": COST_MATRIX_DEFAULT.tolist(),
        "data_source": "SYNTHETIC",
        "warning": "Haversine distance at 30 km/h — not from a real routing API.",
    }


@app.post("/optimise")
def optimise(req: OptimiseRequest):
    warnings: list[str] = []

    if req.riders and req.jobs:
        riders = [r.model_dump() for r in req.riders]
        jobs   = [j.model_dump() for j in req.jobs]
        C = build_cost_matrix(riders, jobs)
        warnings.append("Travel times are SYNTHETIC (Haversine / 30 km/h) — not from a real routing API.")
    else:
        riders = list(RIDERS_DEFAULT)
        jobs   = list(JOBS_DEFAULT)
        C = COST_MATRIX_DEFAULT.copy()
        warnings.append("Using default SYNTHETIC 2×2 dataset. Pass riders/jobs to use live data.")

    n = C.shape[0]
    if n < 2:
        raise HTTPException(400, "Need at least 2 riders and 2 jobs.")
    P = float(C.max() * 2 + 10)

    t0 = time.time()
    best_perm, best_cost, all_classical = classical_solve(C)
    classical_ms = round((time.time() - t0) * 1000, 3)

    try:
        qaoa_raw = run_qaoa(p=req.p, shots=req.shots, seed=req.seed,
                            cost_matrix=C, riders=riders, jobs=jobs, penalty=P)
    except Exception as exc:
        raise HTTPException(500, f"QAOA solver error: {exc}") from exc

    feasible = [r for r in qaoa_raw["top_results"] if r["feasible"]]
    if feasible:
        best_qaoa = min(feasible, key=lambda r: r["cost"])
        recommended = {
            "assignment": best_qaoa["assignment"],
            "cost": best_qaoa["cost"],
            "bitstring": best_qaoa["bitstring"],
            "details": [
                {"rider": riders[i], "job": jobs[best_qaoa["assignment"][i]],
                 "travel_minutes_synthetic": float(C[i, best_qaoa["assignment"][i]])}
                for i in range(n)
            ],
        }
    else:
        recommended = None
        warnings.append("No feasible assignment in top-5 results. Increase shots or p.")

    match = recommended is not None and recommended["assignment"] == best_perm
    comparison = {
        "classical_cost_min": float(best_cost),
        "qaoa_cost_min":      recommended["cost"] if recommended else None,
        "gap_min":            round(recommended["cost"] - best_cost, 2) if recommended else None,
        "qaoa_matches_optimal": match,
        "classical_time_ms":  classical_ms,
        "qaoa_opt_time_s":    qaoa_raw["opt_time_s"],
        "note": (
            "QAOA matches classical optimum." if match
            else (f"QAOA is {recommended['cost'] - best_cost:.1f} min above optimal."
                  if recommended else "No feasible QAOA result.")
        ),
    }

    return {
        "status": "success", "data_source": "SYNTHETIC", "warnings": warnings,
        "riders": riders, "jobs": jobs, "n": n,
        "cost_matrix": C.tolist(), "penalty": P,
        "classical": {"best_assignment": best_perm, "best_cost": float(best_cost),
                      "all_results": all_classical, "time_ms": classical_ms},
        "qaoa": {"p": qaoa_raw["p"], "shots": qaoa_raw["shots"],
                 "optimal_params": qaoa_raw["optimal_params"],
                 "optimal_energy": qaoa_raw["optimal_energy"],
                 "opt_time_s": qaoa_raw["opt_time_s"],
                 "top_results": qaoa_raw["top_results"],
                 "total_shots": sum(qaoa_raw["counts"].values())},
        "recommended": recommended, "comparison": comparison,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("qaoa_service:app", host="127.0.0.1", port=5001, reload=False, log_level="info")
