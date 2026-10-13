import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Zap, Square } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { bikes, type Product } from "@/lib/data";
import { getCatalogueProducts } from "@/lib/catalogue";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Volt — voice assistant for EV parts — Riderzpro" },
      { name: "description", content: "Speak or type what you need and Volt finds compatible EV batteries and parts." },
      { property: "og:title", content: "Volt voice assistant — Riderzpro" },
      { property: "og:description", content: "Find EV parts by voice." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "bot"; text: string; items?: Product[] };

function answer(q: string, activeBikeId: string | null): Msg {
  const s = q.toLowerCase();
  const bike = bikes.find((b) => s.includes(b.model.toLowerCase()) || s.includes(b.make.toLowerCase())) ?? bikes.find((b) => b.id === activeBikeId);
  const volt = s.match(/(48|60|72)\s*v/)?.[1];
  const cat = s.includes("charger") ? "Charger" : s.includes("bms") ? "BMS" : s.includes("motor") ? "Motor" : s.includes("controller") ? "Controller" : s.includes("brake") ? "Brakes" : s.includes("batter") ? "Battery" : null;
  const catalogueProducts = getCatalogueProducts();
  let items = catalogueProducts.filter((p) => (!cat || p.category === cat) && (!volt || p.voltage === +volt) && (!bike || p.fits.includes(bike.id)));
  if (s.includes("cheap") || s.includes("budget")) items = [...items].sort((a, b) => a.offers[0].price - b.offers[0].price);
  items = items.slice(0, 4);
  if (!items.length) return { role: "bot", text: "I couldn't find a matching part. Try mentioning your bike model or voltage, like “60V battery for Ola S1 Pro”." };
  return {
    role: "bot",
    text: `Here ${items.length === 1 ? "is" : "are"} ${items.length} ${cat?.toLowerCase() ?? "part"}${items.length > 1 ? "s" : ""}${volt ? ` at ${volt}V` : ""}${bike ? ` verified for the ${bike.make} ${bike.model}` : ""}. Tap Add to put one in your cart.`,
    items,
  };
}

const suggestions = ["60V battery for Ola S1 Pro", "Cheap charger for Ather 450X", "72V battery for Revolt", "BMS for Bajaj Chetak"];

function Assistant() {
  const { activeBikeId } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hi, I'm Volt ⚡ Tell me your bike and what you need — hold the mic and speak, or type below." }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {}
    };
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, answer(text, activeBikeId)]), 450);
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setMsgs((m) => [...m, { role: "bot", text: "Voice isn't supported in this browser — please type instead (Chrome works best)." }]);
    if (listening) {
      try { recRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.onresult = (e: any) => setInput(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => { setListening(false); setInput((v) => { if (v) send(v); return v; }); };
    recRef.current = r;
    try {
      r.start();
      setListening(true);
    } catch {}
  };

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-4xl flex-col px-4 py-8 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Zap className="h-6 w-6" fill="currentColor" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Volt Assistant</h1>
            <p className="text-sm text-muted-foreground">Voice and text search for verified EV parts</p>
          </div>
        </div>
        <div className="mt-8 flex-1 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "max-w-full rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs text-[#111111]"
                }
              >
                <p className="leading-relaxed">{m.text}</p>
                {m.items && (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {m.items.map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111111] shadow-2xs transition hover:border-[#111111] hover:text-[#E31E24] active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="sticky bottom-24 mt-6 flex items-center gap-2 rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-lg md:bottom-6">
          <button
            onClick={toggleMic}
            aria-label="Speak"
            className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition-all ${
              listening ? "bg-destructive text-destructive-foreground shadow-md" : "bg-primary text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-105 active:scale-95"
            }`}
          >
            {listening && <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-ring" />}
            {listening ? <Square className="relative h-4 w-4" /> : <Mic className="h-5 w-5" />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={listening ? "Listening…" : "Ask for a part (e.g. 60V battery for Ather 450X)…"}
            className="h-12 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => send(input)}
            aria-label="Send"
            className="grid h-12 w-12 place-items-center rounded-full border border-border/80 bg-card/60 transition hover:border-primary hover:text-primary active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
