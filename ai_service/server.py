"""
Riderzpro Enterprise AI Chatbot & Inference API Server
Built with FastAPI, supporting CPU inference, guaranteed catalog fitment,
and live DuckDuckGo web search.
"""

import time
import os
import psutil
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from ai_service.config import settings
from ai_service.agent import agent_instance
from ai_service.tools.catalog_tool import catalog_tool
from ai_service.tools.web_search_tool import web_search_tool

app = FastAPI(
    title="Riderzpro AI Inference Service",
    description="Enterprise AI model and support agent for EV battery fitment, spare parts, and diagnostic queries.",
    version="1.0.0"
)

# Enable CORS for Riderzpro frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def preload_models():
    """Warms up the neural model and catalog database on startup for instant responses."""
    from ai_service.engine.neural_model import neural_engine
    from ai_service.database import catalog_db
    _ = catalog_db.is_loaded
    _ = neural_engine.is_loaded

@app.get("/")
def api_root():
    """Service status and endpoint index."""
    return {
        "service": "Riderzpro AI Inference Service",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/v1/chat",
            "chat_stream": "/api/v1/chat/stream",
            "health": "/api/v1/health",
            "fitment": "/api/v1/fitment",
            "search": "/api/v1/search",
        },
    }


# ==============================================================================
# Request & Response Schemas
# ==============================================================================
class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user', 'assistant', or 'system'")
    content: str = Field(..., description="Message text content")


class ChatRequest(BaseModel):
    query: str = Field(..., example="I have an Ather 450X Gen 3. What replacement batteries and brake pads can I get?")
    vehicle_model: Optional[str] = Field(None, example="Ather 450X Gen 3")
    history: Optional[List[ChatMessage]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    query: str
    response: str
    matched_vehicle: Optional[Dict[str, Any]] = None
    compatible_batteries: List[Dict[str, Any]] = []
    compatible_parts: List[Dict[str, Any]] = []
    sources: List[Dict[str, Any]] = []
    safety_advisories: List[str] = []
    web_search_executed: bool = False
    is_out_of_topic: bool = False
    latency_ms: float


# ==============================================================================
# API Endpoints
# ==============================================================================
@app.get("/api/v1/health")
def health_check():
    """
    Enterprise health & CPU diagnostics endpoint.
    """
    mem = psutil.virtual_memory() if hasattr(psutil, "virtual_memory") else None
    return {
        "status": "healthy",
        "service": "Riderzpro AI Service",
        "environment": settings.ENV,
        "inference_provider": settings.INFERENCE_PROVIDER,
        "active_engine": getattr(agent_instance, "neural_model", None).__class__.__name__ if hasattr(agent_instance, "neural_model") else "AutonomousPrecisionEngine",
        "cpu_threads_configured": settings.CPU_THREADS,
        "cpu_count_total": os.cpu_count(),
        "memory_info": {
            "total_gb": round(mem.total / (1024**3), 2) if mem else "N/A",
            "available_gb": round(mem.available / (1024**3), 2) if mem else "N/A",
            "percent_used": mem.percent if mem else "N/A"
        },
        "search_cache_entries": len(web_search_tool.cache)
    }


@app.post("/api/v1/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Main Chatbot & Fitment Recommendation Endpoint.
    Takes user query, resolves EV model, performs catalog fitment and live web search,
    and returns verified batteries, parts, and safety instructions.
    """
    start_time = time.time()
    try:
        formatted_history = [
            {"role": m.role, "content": m.content} for m in request.history
        ] if request.history else []

        result = agent_instance.process_query(
            user_query=request.query,
            history=formatted_history,
            user_vehicle=request.vehicle_model
        )
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return ChatResponse(
            query=result["query"],
            response=result["response"],
            matched_vehicle=result["matched_vehicle"],
            compatible_batteries=result["compatible_batteries"],
            compatible_parts=result["compatible_parts"],
            sources=result["sources"],
            safety_advisories=result["safety_advisories"],
            web_search_executed=result["web_search_executed"],
            is_out_of_topic=result.get("is_out_of_topic", False),
            latency_ms=elapsed_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Agent inference error: {str(e)}")


@app.post("/api/v1/catalog/reload")
def reload_catalog_database():
    """
    Hot-reloads all catalogs from scratch/ and knowledge_base/.
    """
    from ai_service.database import catalog_db
    summary = catalog_db.reload()
    return {"status": "success", "summary": summary}


@app.get("/api/v1/catalog/summary")
def get_catalog_summary():
    """
    Returns indexed catalog statistics and supported models.
    """
    from ai_service.database import catalog_db
    return catalog_db.get_catalog_summary()


@app.get("/api/v1/catalog/products")
def search_catalog_products(
    q: Optional[str] = Query(None, description="Search term for SKU, name, or category"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Search or browse products from the 160-item Riderzpro v2 product catalogue.
    """
    from ai_service.database import catalog_db
    if q:
        items = catalog_db.search_products(q, limit=limit)
    elif category:
        items = catalog_db.categories.get(category, [])[:limit]
    else:
        items = catalog_db.v2_products[:limit]
    return {
        "total_results": len(items),
        "products": items
    }


@app.post("/api/v1/chat/stream")
def chat_stream_endpoint(request: ChatRequest):
    """
    Server-Sent Events (SSE) streaming endpoint for live token generation.
    """
    def event_stream():
        query_to_process = request.query
        if request.vehicle_model and request.vehicle_model.lower() not in request.query.lower():
            query_to_process = f"{request.vehicle_model}: {request.query}"

        result = agent_instance.process_query(query_to_process)
        full_text = result["response"]
        
        # Stream text in progressive chunks
        chunks = full_text.split("\n")
        for chunk in chunks:
            yield f"data: {chunk}\n\n"
            time.sleep(0.02)
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/api/v1/fitment")
def direct_fitment_lookup(vehicle: str = Query(..., description="Vehicle name e.g. Ather 450X, Ola S1 Pro")):
    """
    Direct deterministic fitment API.
    """
    return catalog_tool.execute_fitment_lookup(vehicle)


@app.get("/api/v1/search")
def direct_web_search(q: str = Query(..., description="Search query")):
    """
    Direct live web search API powered by DuckDuckGo.
    """
    return web_search_tool.search(q)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ai_service.server:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
