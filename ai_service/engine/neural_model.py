"""
Riderzpro Live Neural Language Model Engine
Runs real CPU neural inference using Hugging Face Transformers and Qwen2.5-0.5B-Instruct.
Zero external API costs. Genuine neural token generation.
"""

import os
import torch
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("riderzpro_ai.neural")

MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"


class NeuralModelEngine:
    _instance = None

    def __init__(self):
        self.model_id = MODEL_ID
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        self._load_model()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = NeuralModelEngine()
        return cls._instance

    def _load_model(self):
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            logger.info(f"Loading real neural model {self.model_id} on CPU...")
            torch.set_num_threads(8)
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_id,
                dtype=torch.bfloat16
            )
            self.model.to("cpu")
            self.model.eval()
            self.is_loaded = True
            logger.info("Real neural model loaded successfully on CPU with 8 threads (bfloat16).")
        except Exception as e:
            logger.error(f"Error loading neural model: {e}")
            self.is_loaded = False

    def generate(
        self,
        messages: List[Dict[str, str]],
        max_new_tokens: int = 120,
        temperature: float = 0.0,
        top_p: float = 1.0,
        do_sample: bool = False
    ) -> str:
        """
        Executes genuine neural forward pass with fast greedy decoding on CPU.
        """
        if not self.is_loaded or self.model is None or self.tokenizer is None:
            raise RuntimeError("Neural model is not loaded in memory.")

        prompt_text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        inputs = self.tokenizer([prompt_text], return_tensors="pt")
        input_ids = inputs.input_ids.to("cpu")
        attention_mask = inputs.attention_mask.to("cpu")

        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_new_tokens=max_new_tokens,
                do_sample=do_sample,
                pad_token_id=self.tokenizer.eos_token_id
            )

        # Decode generated tokens
        new_tokens = outputs[:, input_ids.shape[1]:]
        response = self.tokenizer.batch_decode(new_tokens, skip_special_tokens=True)[0]
        return response.strip()


neural_engine = NeuralModelEngine.get_instance()
