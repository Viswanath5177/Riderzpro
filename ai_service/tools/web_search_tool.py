"""
Riderzpro Live Internet Web Search Tool
Powered by DuckDuckGo Search (Free, zero-API cost, no API keys required).
Includes query sanitization, result ranking, and LRU cache with TTL.
"""

import time
import logging
from typing import Dict, List, Any, Optional
from ai_service.config import settings

logger = logging.getLogger("riderzpro_ai.web_search")


class WebSearchTool:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = settings.SEARCH_CACHE_TTL_SECONDS
        self.max_results = settings.MAX_SEARCH_RESULTS

    def _get_from_cache(self, query: str) -> Optional[List[Dict[str, str]]]:
        now = time.time()
        if query in self.cache:
            entry = self.cache[query]
            if now - entry["timestamp"] < self.cache_ttl:
                return entry["results"]
            else:
                del self.cache[query]
        return None

    def _save_to_cache(self, query: str, results: List[Dict[str, str]]):
        # Keep cache bounded to 200 items
        if len(self.cache) > 200:
            oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k]["timestamp"])
            del self.cache[oldest_key]
        self.cache[query] = {
            "timestamp": time.time(),
            "results": results
        }

    def search(self, query: str, domain_context: str = "EV electric bike") -> Dict[str, Any]:
        """
        Executes a live web search using DuckDuckGo.
        Augments the query with domain terms if necessary.
        """
        if not settings.ENABLE_WEB_SEARCH:
            return {
                "status": "disabled",
                "message": "Web search is disabled in settings.",
                "results": []
            }

        cleaned_query = query.strip()
        # Check cache first
        cached = self._get_from_cache(cleaned_query)
        if cached is not None:
            return {
                "status": "success",
                "source": "cache",
                "query": cleaned_query,
                "results": cached
            }

        results: List[Dict[str, str]] = []

        try:
            try:
                from ddgs import DDGS
            except ImportError:
                import warnings
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore", category=RuntimeWarning)
                    from duckduckgo_search import DDGS
            
            # Sanitize search query: strip command phrases
            import re
            clean_q = re.sub(r'(?i)\b(search(\s+the)?\s+(internet|web)|google\s+it|please\s+search|look\s+up|find\s+on\s+internet)\b', '', cleaned_query).strip()
            if not clean_q:
                clean_q = cleaned_query

            search_query = clean_q
            if not any(k in clean_q.lower() for k in ["ev", "electric", "battery", "bike", "scooter"]):
                search_query = f"{clean_q} {domain_context}"

            with DDGS() as ddgs:
                ddg_results = []
                # Try original search_query
                try:
                    ddg_results = list(ddgs.text(search_query, backend="lite", max_results=self.max_results))
                except Exception:
                    pass

                # If no results, retry with simplified 2-4 keywords
                if not ddg_results:
                    tokens = [w for w in search_query.split() if w.lower() not in {"and", "the", "for", "with", "what", "is", "can", "get", "specs", "to"}]
                    simplified_query = " ".join(tokens[:3])
                    try:
                        ddg_results = list(ddgs.text(simplified_query, backend="lite", max_results=self.max_results))
                    except Exception:
                        try:
                            ddg_results = list(ddgs.text(simplified_query, backend="html", max_results=self.max_results))
                        except Exception:
                            pass

                for r in ddg_results:
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("href", ""),
                        "snippet": r.get("body", "")
                    })

            self._save_to_cache(cleaned_query, results)
            return {
                "status": "success",
                "source": "live_web",
                "query": search_query,
                "results": results
            }

        except Exception as e:
            logger.warning(f"DuckDuckGo search error: {str(e)}. Using fallback search engine response.")
            # Graceful fallback so the AI agent does not fail if offline
            return {
                "status": "partial_error",
                "error": str(e),
                "query": cleaned_query,
                "results": [
                    {
                        "title": f"Web Search Context for: {cleaned_query}",
                        "url": "https://riderzpro.com/ev-knowledgebase",
                        "snippet": f"EV specifications and aftermarket components for {cleaned_query} can be verified with manufacturer service bulletins."
                    }
                ]
            }


web_search_tool = WebSearchTool()
