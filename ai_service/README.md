# ⚡ Riderzpro AI Service — Enterprise EV Model & Support Agent

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com)
[![Architecture](https://img.shields.io/badge/Architecture-RAG%20%2B%20Tool--Calling%20SLM-green.svg)](#)
[![Inference](https://img.shields.io/badge/Inference-CPU%20(GGUF%204--bit)-orange.svg)](#)
[![Search](https://img.shields.io/badge/Web%20Search-DuckDuckGo%20(Free)-red.svg)](#)

Enterprise-grade AI chat and recommendation service for the **Riderzpro EV Ecosystem**. Given an electric two-wheeler model (e.g. Ather 450X, Ola S1 Pro, TVS iQube, Revolt RV400, Hero Vida, Bajaj Chetak), the AI agent provides guaranteed compatible replacement batteries, spare parts (chargers, drive belts, ceramic brake pads, EV tires), live web intelligence for aftermarket parts, and certified installation booking with instant old battery exchange rebate calculation.

---

## 🏛️ 1. Enterprise System Architecture

```
                                  ┌─────────────────────────────┐
                                  │      User Chat Query        │
                                  │  (e.g. "Ather 450X battery  │
                                  │     and front brake pads")  │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │   FastAPI Service (:8000)   │
                                  │   /api/v1/chat & /stream    │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                       Riderzpro Agent Orchestrator (agent.py)                          │
│                                                                                         │
│   1. Intent Classification & Vehicle Entity Resolution                                 │
│   2. Voltage Safety & High-Risk Mechanical Guardrails                                   │
│   3. Dynamic Tool Dispatch                                                              │
└──────────────┬──────────────────────────────────────────┬───────────────────────────────┘
               │                                          │
               ▼                                          ▼
┌───────────────────────────────┐          ┌───────────────────────────────┐
│   Catalog Fitment Engine      │          │   Live Web Search Engine      │
│   (tools/catalog_tool.py)     │          │   (tools/web_search_tool.py)  │
├───────────────────────────────┤          ├───────────────────────────────┤
│ • Zero-hallucination lookup   │          │ • DuckDuckGo text search      │
│ • Strict voltage & connector  │          │ • Real-time aftermarket parts │
│ • ₹2,500 battery rebate calc  │          │ • In-memory LRU cache + TTL   │
│ • Doorstep (+₹499) vs Bay     │          │ • Zero API token cost         │
└──────────────┬────────────────┘          └──────────────┬────────────────┘
               │                                          │
               └────────────────────┬─────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                 CPU Quantized Inference Engine (engine/llm_engine.py)                   │
│                                                                                         │
│ • Model: Qwen2.5-3B-Instruct (or Llama-3.2-3B) quantized to Q4_K_M GGUF                 │
│ • RAM Footprint: ~2.2 GB model + ~400 MB KV Cache = < 3.0 GB RAM total                 │
│ • CPU Throughput: 30 - 45 tokens/second on standard 8-core CPU                         │
│ • Multi-Backend Support: llama-cpp-python | Ollama Bridge | Smart Synthesis Fallback    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                      Structured Response Output
        (Markdown Breakdown, Badges, Fitment JSON, Safety Warnings)
```

---

## ⚡ 2. Why RAG + Tool-Calling SLM vs. Pure Model Training?

In consumer chatbots, fine-tuning an LLM on facts is common. **In automotive EV battery ecosystems, doing so is dangerous**:
- **Electrical Catastrophe Prevention**: EV battery voltages are strictly vehicle-specific (48V vs. 51.1V vs. 52V vs. 72V). A model hallucinating that a 72V Ola pack works on a 48V Bajaj Chetak could destroy the controller MOSFETs or trigger a fire.
- **Dynamic Pricing & Stock**: Battery prices fluctuate, new supplier batches arrive, and ₹2,500 exchange rebates must balance dynamically.
- **The Solution**: 
  - The **Catalog Tool** acts as the deterministic source of truth for certified fitment, prices, and warranties.
  - The **Live Web Search Tool** pulls fresh aftermarket parts, uncataloged EVs, user manuals, and forum problem reports.
  - The **Fine-Tuned SLM** acts as the reasoning brain and conversational interface, enforcing safety rules and formatting.

---

## 💻 3. CPU Inference Specifications (8GB - 16GB RAM)

For standard enterprise cloud CPUs (e.g. AWS c6i/c7i, Azure F-series, or Intel i5/i7/Xeon):

| Metric | Target Specification |
| :--- | :--- |
| **Model Size** | 3 Billion Parameters (Qwen2.5-3B-Instruct or Llama-3.2-3B-Instruct) |
| **Quantization** | GGUF `Q4_K_M` (4-bit medium) |
| **File Size on Disk** | **~2.1 GB** |
| **RAM Footprint (Weights)** | **~2.2 GB** |
| **RAM Footprint (4K KV Cache)** | **~400 MB** |
| **Total System RAM Required** | **~2.85 GB** (Runs comfortably on 8GB machines) |
| **CPU Threads Allocated** | Physical core count (4 to 8 threads) |
| **Generation Speed** | **30 to 45 tokens per second** |

---

## 🏋️ 4. How to Train / Fine-Tune Your Domain Model

### Step 1: Generate Training Data
Generate synthetic EV technical QA, fitment dialogs, and booking transcripts:
```bash
python -m ai_service.training.dataset_generator
```
Output:
- `ai_service/training/data/train.jsonl`
- `ai_service/training/data/val.jsonl`

### Step 2: Fine-Tune using QLoRA (GPU Environment)
Run fine-tuning on an NVIDIA GPU (Google Colab T4, RTX 3060/4060, or AWS EC2 g4dn):
```bash
python -m ai_service.training.train_qlora --base_model Qwen/Qwen2.5-3B-Instruct --epochs 3
```
This trains a Low-Rank Adapter (LoRA) on top of the base 3B weights using 4-bit `bitsandbytes` in ~2 hours.

### Step 3: Merge LoRA & Export to GGUF for CPU Inference
```bash
# 1. Merge LoRA adapter into base weights
python -c "
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer
base = AutoModelForCausalLM.from_pretrained('Qwen/Qwen2.5-3B-Instruct', torch_dtype='auto')
model = PeftModel.from_pretrained(base, 'ai_service/training/output_lora')
merged = model.merge_and_unload()
merged.save_pretrained('ai_service/training/merged_model')
AutoTokenizer.from_pretrained('Qwen/Qwen2.5-3B-Instruct').save_pretrained('ai_service/training/merged_model')
"

# 2. Clone llama.cpp and convert to GGUF format
git clone https://github.com/ggerganov/llama.cpp
python llama.cpp/convert_hf_to_gguf.py ai_service/training/merged_model --outfile ai_service/models/qwen2.5-3b-fp16.gguf

# 3. Quantize to 4-bit Medium for CPU
./llama.cpp/llama-quantize ai_service/models/qwen2.5-3b-fp16.gguf ai_service/models/qwen2.5-3b-instruct-q4_k_m.gguf Q4_K_M
```

---

## 🚀 5. Running the AI Service Locally

### Prerequisites
```bash
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings httpx duckduckgo-search psutil
```

*(Optional for local GGUF loading)*:
```bash
pip install llama-cpp-python
```

### Start the Service
```bash
python -m ai_service.server
```
The service launches at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

---

## 📡 6. API Reference

### `POST /api/v1/chat`
Process multi-turn user query, resolve vehicle fitment, execute live internet search, and apply safety guards.

**Request Body:**
```json
{
  "query": "I have an Ather 450X Gen 3. What replacement batteries and brake pads can I get?",
  "vehicle_model": "Ather 450X Gen 3",
  "history": []
}
```

**Response (Truncated Sample):**
```json
{
  "query": "Ather 450X Gen 3: What replacement batteries and brake pads can I get?",
  "response": "### 🛵 Guaranteed Fitment Match: **Ather 450X Gen 3**\n- **System Voltage**: `51.1V`\n...",
  "matched_vehicle": {
    "brand": "Ather",
    "model": "450X Gen 3",
    "nominal_voltage": 51.1,
    "connector_type": "Ather High-Flow Prop Plug"
  },
  "compatible_batteries": [
    {
      "id": "bat_voltpro_ather_lfp",
      "name": "VoltPro Ultra-Life LFP 51.1V 4.0kWh",
      "price": 47999,
      "effective_price_with_rebate": 45499,
      "rebate_amount": 2500,
      "warranty_months": 60
    }
  ],
  "compatible_parts": [
    {
      "name": "CeramiGlide Front & Rear Disc Brake Pad Set",
      "price": 899,
      "category": "brakes"
    }
  ],
  "sources": [
    {"type": "catalog", "title": "Riderzpro Verified Fitment Engine"},
    {"type": "web", "title": "Ather 450X Forum - Brake Pad Life"}
  ],
  "safety_advisories": [
    "✅ Guaranteed Fitment Verified: Strictly matching Ather 450X Gen 3 with 51.1V and Ather Prop Plug."
  ],
  "web_search_executed": true,
  "latency_ms": 142.5
}
```

### `GET /api/v1/fitment?vehicle=Ather+450X`
Direct deterministic fitment check without conversational wrapper.

### `GET /api/v1/search?q=Ola+S1+pro+battery+fire+safety`
Direct live DuckDuckGo query with local caching.

### `GET /api/v1/health`
Returns server health, RAM utilization, active inference backend, and thread count.

---

## 🚀 7. Running the Service
Start the AI inference API server:
```bash
python -m ai_service.server
```
The server runs on `http://127.0.0.1:8000`. The frontend app at `/assistant` connects directly to `/api/v1/chat` and `/api/v1/health`.
