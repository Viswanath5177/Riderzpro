"""
Riderzpro — QAOA Technician-to-Job Assignment Core
NOTE: All travel times are SYNTHETIC (Haversine @ 30 km/h). Not from a real routing API.
"""
import time, itertools
from typing import Optional
import numpy as np
from scipy.optimize import minimize
from qiskit import QuantumCircuit, transpile
from qiskit.circuit import ParameterVector
from qiskit_aer import AerSimulator

RIDERS_DEFAULT = [
    {"id": "r1", "name": "Ravi Kumar",  "lat": 12.9784, "lng": 77.6408},
    {"id": "r2", "name": "Salma Begum", "lat": 12.9352, "lng": 77.6245},
]
JOBS_DEFAULT = [
    {"order_id": "RZ48213", "label": "MG Road",     "lat": 12.9716, "lng": 77.5946},
    {"order_id": "RZ48221", "label": "Rajajinagar", "lat": 12.9908, "lng": 77.5554},
]
COST_MATRIX_DEFAULT = np.array([[18.0, 25.0], [12.0, 30.0]], dtype=float)
PENALTY_DEFAULT = 50.0


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    dlat = (lat2 - lat1) * np.pi / 180
    dlng = (lng2 - lng1) * np.pi / 180
    a = np.sin(dlat/2)**2 + np.cos(lat1*np.pi/180)*np.cos(lat2*np.pi/180)*np.sin(dlng/2)**2
    return 2 * R * np.arcsin(np.sqrt(a))


def build_cost_matrix(riders, jobs):
    n = min(len(riders), len(jobs))
    C = np.zeros((n, n))
    for i, r in enumerate(riders[:n]):
        for j, job in enumerate(jobs[:n]):
            km = haversine_km(r["lat"], r["lng"], job["lat"], job["lng"])
            C[i, j] = round((km / 30) * 60, 1)
    return C


def classical_solve(cost):
    n = cost.shape[0]
    best_cost, best_perm, all_results = float("inf"), [], []
    for perm in itertools.permutations(range(n)):
        c = float(sum(cost[i, perm[i]] for i in range(n)))
        all_results.append({"assignment": list(perm), "cost": c})
        if c < best_cost:
            best_cost, best_perm = c, list(perm)
    return best_perm, best_cost, all_results


def build_qubo(cost, penalty):
    n = cost.shape[0]
    nv = n * n
    Q = np.zeros((nv, nv))
    for i in range(n):
        for j in range(n):
            Q[i*n+j, i*n+j] += cost[i, j]
    for i in range(n):
        idx = [i*n+j for j in range(n)]
        for k, qa in enumerate(idx):
            Q[qa, qa] -= penalty
            for qb in idx[k+1:]:
                Q[qa, qb] += 2 * penalty
    for j in range(n):
        idx = [i*n+j for i in range(n)]
        for k, qa in enumerate(idx):
            Q[qa, qa] -= penalty
            for qb in idx[k+1:]:
                Q[qa, qb] += 2 * penalty
    return Q


def qubo_to_ising(Q):
    n = Q.shape[0]
    J = np.zeros((n, n))
    h = np.zeros(n)
    offset = 0.0
    for i in range(n):
        for j in range(i, n):
            if i == j:
                h[i] += Q[i,i] / 2.0
                offset += Q[i,i] / 4.0
            else:
                J[i,j] += Q[i,j] / 4.0
                h[i]   += Q[i,j] / 4.0
                h[j]   += Q[i,j] / 4.0
                offset += Q[i,j] / 4.0
    return J, h, offset


def build_qaoa_circuit(J, h, p):
    n = h.shape[0]
    gamma = ParameterVector("γ", p)
    beta  = ParameterVector("β", p)
    qc = QuantumCircuit(n)
    qc.h(range(n))
    for layer in range(p):
        for i in range(n):
            for j in range(i+1, n):
                if abs(J[i,j]) > 1e-10:
                    qc.cx(i, j); qc.rz(2*gamma[layer]*J[i,j], j); qc.cx(i, j)
            if abs(h[i]) > 1e-10:
                qc.rz(2*gamma[layer]*h[i], i)
        for i in range(n):
            qc.rx(2*beta[layer], i)
    qc.measure_all()
    return qc


def compute_expectation(counts, Q):
    total = sum(counts.values())
    exp = 0.0
    for bs, cnt in counts.items():
        x = np.array([int(b) for b in reversed(bs)], dtype=float)
        exp += (cnt / total) * float(x @ Q @ x)
    return exp


def make_objective(qc, Q, backend, shots):
    def objective(params):
        p_layers = len(params) // 2
        param_dict = dict(zip(qc.parameters, list(params[:p_layers]) + list(params[p_layers:])))
        bound = qc.assign_parameters(param_dict)
        tqc = transpile(bound, backend=backend)
        counts = backend.run(tqc, shots=shots).result().get_counts()
        return compute_expectation(counts, Q)
    return objective


def decode_bitstring(bs, n, cost):
    bits = np.array([int(b) for b in reversed(bs)], dtype=int)
    matrix = bits.reshape(n, n)
    row_ok = all(matrix[i,:].sum() == 1 for i in range(n))
    col_ok = all(matrix[:,j].sum() == 1 for j in range(n))
    if not (row_ok and col_ok):
        return None, False, float("inf")
    assignment = [int(np.argmax(matrix[i,:])) for i in range(n)]
    travel = float(sum(cost[i, assignment[i]] for i in range(n)))
    return assignment, True, travel


def sample_best(counts, n, cost, top_k=5):
    results = []
    for bs, cnt in sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:top_k]:
        assignment, feasible, travel = decode_bitstring(bs, n, cost)
        results.append({"bitstring": bs, "count": int(cnt), "feasible": feasible,
                        "assignment": assignment, "cost": travel if feasible else None})
    return results


def run_qaoa(p=2, shots=8192, seed=42, cost_matrix=None, riders=None, jobs=None, penalty=None):
    np.random.seed(seed)
    C = cost_matrix if cost_matrix is not None else COST_MATRIX_DEFAULT.copy()
    n = C.shape[0]
    P = penalty if penalty is not None else float(C.max() * 2 + 10)

    Q = build_qubo(C, P)
    J_ising, h_ising, offset = qubo_to_ising(Q)
    qc = build_qaoa_circuit(J_ising, h_ising, p)

    backend = AerSimulator(method="statevector")
    init_params = np.random.uniform(0, 0.5, 2 * p)
    obj_fn = make_objective(qc, Q, backend, shots=min(shots, 4096))

    t0 = time.time()
    result = minimize(obj_fn, init_params, method="COBYLA", options={"maxiter": 200, "rhobeg": 0.5})
    opt_time = round(time.time() - t0, 2)

    optimal_params = list(result.x)
    param_dict = dict(zip(qc.parameters, optimal_params[:p] + optimal_params[p:]))
    final_qc = qc.assign_parameters(param_dict)
    tqc = transpile(final_qc, backend=backend)
    counts = backend.run(tqc, shots=shots).result().get_counts()

    return {
        "p": p, "shots": shots, "optimal_params": optimal_params,
        "optimal_energy": float(result.fun), "opt_time_s": opt_time,
        "counts": counts, "top_results": sample_best(counts, n, C),
        "Q": Q.tolist(), "J": J_ising.tolist(), "h": h_ising.tolist(),
        "offset": float(offset), "penalty": P, "n": n,
    }


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--p",     type=int, default=2)
    ap.add_argument("--shots", type=int, default=8192)
    ap.add_argument("--seed",  type=int, default=42)
    args = ap.parse_args()
    print(f"\n⚛️  Riderzpro QAOA demo — p={args.p}, shots={args.shots}")
    best_perm, best_cost, _ = classical_solve(COST_MATRIX_DEFAULT)
    print(f"   Classical: {best_perm} → {best_cost} min")
    print("   Running QAOA (30–90 s)...")
    r = run_qaoa(p=args.p, shots=args.shots, seed=args.seed)
    feasible = [x for x in r["top_results"] if x["feasible"]]
    if feasible:
        best = min(feasible, key=lambda x: x["cost"])
        match = "✓ matches optimal" if best["assignment"] == best_perm else "✗ suboptimal"
        print(f"   QAOA best: {best['assignment']} → {best['cost']} min  ({match})")
    else:
        print("   No feasible result — increase shots or p")
    print(f"   Opt time: {r['opt_time_s']} s")
