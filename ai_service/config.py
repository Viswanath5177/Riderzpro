"""
Riderzpro Enterprise AI Service Configuration
Optimized for Resource-Constrained CPU Inference (8GB-16GB RAM)
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class AIServiceConfig(BaseSettings):
    # Service Environment
    ENV: str = "production"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # Inference Provider: 'auto', 'llama_cpp', 'ollama', or 'smart_agent'
    # 'auto' checks if local GGUF exists -> then checks Ollama -> falls back to smart rule-based agent
    INFERENCE_PROVIDER: str = "auto"

    # CPU Optimization Parameters
    # For 8-16GB RAM CPUs, thread count should match physical cores (not hyperthreaded logical cores)
    CPU_THREADS: int = max(1, (os.cpu_count() or 4) // 2 if (os.cpu_count() or 4) > 4 else (os.cpu_count() or 4))
    CONTEXT_WINDOW: int = 4096
    MAX_TOKENS: int = 1024
    TEMPERATURE: float = 0.2  # Low temperature for strict technical accuracy

    # GGUF Model Path (e.g. Qwen2.5-3B-Instruct-Q4_K_M.gguf ~ 2.1GB)
    MODEL_PATH: Optional[str] = os.path.join(
        os.path.dirname(__file__), "models", "qwen2.5-3b-instruct-q4_k_m.gguf"
    )

    # Ollama Bridge (alternative local CPU runner)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL_NAME: str = "qwen2.5:3b"

    # Search Configuration
    ENABLE_WEB_SEARCH: bool = True
    MAX_SEARCH_RESULTS: int = 5
    SEARCH_CACHE_TTL_SECONDS: int = 3600  # 1 hour cache to save bandwidth & latency

    # EV Safety Guardrails
    ENABLE_SAFETY_GUARDRAILS: bool = True
    OLD_BATTERY_REBATE: int = 2500
    DOORSTEP_FEE: int = 499
    SERVICE_CENTER_FEE: int = 299

    class Config:
        env_prefix = "RIDERZPRO_AI_"
        env_file = ".env"
        extra = "ignore"


settings = AIServiceConfig()
