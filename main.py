"""Riderzpro Quantum Algorithm-Based E-Commerce Platform Backend Entrypoint."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from logistics.database import init_db
from logistics.router import router as logistics_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager initializing database tables on startup."""
    init_db()
    yield


app = FastAPI(
    title="Riderzpro — Logistics & Delivery Management Backend",
    description="Quantum Algorithm-Based E-Commerce Platform — Delivery Optimization & Rider Dispatch Subsystem",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for cross-origin frontend client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Logistics & Delivery Subsystem Router
app.include_router(logistics_router)


@app.get("/health", tags=["System Health"])
def health_check():
    """System health verification endpoint."""
    return {
        "status": "healthy",
        "service": "riderzpro-logistics-backend",
        "version": "1.0.0"
    }


# Mount static web assets if web directory exists
if os.path.exists("web"):
    app.mount("/static", StaticFiles(directory="web"), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
