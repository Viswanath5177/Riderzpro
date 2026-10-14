import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Zap, Square, AlertTriangle, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { bikes, products, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import charger from "@/assets/charger.jpg";
import parts from "@/assets/parts.jpg";

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

type Msg = {
  role: "user" | "bot";
  text: string;
  items?: Product[];
  safety?: string[];
};

function answerLocal(q: string, activeBikeId: string | null): Msg {
  const s = q.toLowerCase();
  const bike =
    bikes.find((b) => s.includes(b.model.toLowerCase()) || s.includes(b.make.toLowerCase())) ??
    bikes.find((b) => b.id === activeBikeId);
  const volt = s.match(/(48|60|72)\s*v/)?.[1];
  const cat = s.includes("charger")
    ? "Charger"
    : s.includes("bms")
    ? "BMS"
    : s.includes("motor")
    ? "Motor"
    : s.includes("controller")
    ? "Controller"
    : s.includes("brake")
    ? "Brakes"
    : s.includes("batter")
    ? "Battery"
    : null;
  let items = products.filter(
    (p) => (!cat || p.category === cat) && (!volt || p.voltage === +volt) && (!bike || p.fits.includes(bike.id))
  );
  if (s.includes("cheap") || s.includes("budget"))
    items = [...items].sort((a, b) => a.offers[0].price - b.offers[0].price);
  items = items.slice(0, 4);
  if (!items.length)
    return {
      role: "bot",
      text: "I couldn't find a matching part in the local catalog. Try mentioning your bike model or voltage, like “60V battery for Ola S1 Pro”.",
    };
  return {
    role: "bot",
    text: `Here ${items.length === 1 ? "is" : "are"} ${items.length} ${cat?.toLowerCase() ?? "part"}${
      items.length > 1 ? "s" : ""
    }${volt ? ` at ${volt}V` : ""}${bike ? ` verified for the ${bike.make} ${bike.model}` : ""}. Tap Add to put one in your cart.`,
    items,
  };
}

const suggestions = [
  "60V battery for Ola S1 Pro",
  "Cheap charger for Ather 450X",
  "Track order RZP-8492",
  "BMS for Bajaj Chetak",
];

function parseInline(text: string): React.ReactNode[] | string {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\)|\*.*?\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const label = token.substring(1, token.indexOf("]("));
      const url = token.substring(token.indexOf("](") + 2, token.length - 1);
      parts.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-semibold underline underline-offset-2 hover:opacity-80"
        >
          {label}
        </a>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={key++} className="italic text-muted-foreground">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }
  return parts.length > 0 ? parts : text;
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = () => {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows
        .slice(1)
        .filter((r) => !r.every((c) => c.replace(/[-:\s]/g, "").length === 0));
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="my-3 overflow-x-auto rounded-xl border border-border/80 shadow-sm"
        >
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/60">
                {header.map((col, idx) => (
                  <th key={idx} className="px-3 py-2 font-semibold text-foreground whitespace-nowrap">
                    {parseInline(col.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-foreground/90">
                      {parseInline(col.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cols = trimmed.slice(1, -1).split("|");
      tableRows.push(cols);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-3.5 mb-1.5 text-base font-bold tracking-tight text-foreground first:mt-0">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="mt-2.5 mb-1 text-sm font-semibold text-foreground/90">
          {parseInline(trimmed.slice(5))}
        </h4>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="my-2 rounded-r-xl border-l-3 border-primary/80 bg-primary/10 px-3 py-2 text-xs font-medium text-foreground"
        >
          {parseInline(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="ml-3 my-0.5 flex items-start gap-2 text-xs text-foreground/90">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
          <span className="leading-relaxed">{parseInline(trimmed.slice(2))}</span>
        </div>
      );
    } else if (trimmed === "---") {
      elements.push(<hr key={i} className="my-3 border-border/60" />);
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={i} className="my-1.5 text-xs md:text-sm leading-relaxed text-foreground/90">
          {parseInline(trimmed)}
        </p>
      );
    }
  }

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function Assistant() {
  const { activeBikeId } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi, I'm Volt ⚡ Your automotive & EV specialist for Riderzpro. Ask for compatible parts, check voltage safety, or track real-time orders below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {}
    };
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Append user message immediately
    setMsgs((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const activeBike = bikes.find((b) => b.id === activeBikeId);
      const vehicleModel = activeBike ? `${activeBike.make} ${activeBike.model}` : undefined;
      const historyPayload = msgs.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      let res: Response | null = null;
      try {
        res = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: trimmed,
            vehicle_model: vehicleModel,
            history: historyPayload,
          }),
        });
      } catch {
        res = null;
      }

      if (!res || !res.ok) {
        try {
          res = await fetch("http://127.0.0.1:8000/api/v1/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: trimmed,
              vehicle_model: vehicleModel,
              history: historyPayload,
            }),
          });
        } catch {
          res = null;
        }
      }

      if (!res || !res.ok) {
        throw new Error("AI API unavailable");
      }

      const data = await res.json();
      const matchedProducts: Product[] = [];

      // Map compatible batteries to Product objects
      if (Array.isArray(data.compatible_batteries)) {
        for (const b of data.compatible_batteries) {
          const existing = products.find(
            (p) => p.id === b.id || p.name.toLowerCase() === (b.name || "").toLowerCase()
          );
          if (existing) {
            matchedProducts.push(existing);
          } else {
            const v = b.voltage || 60;
            const chosenImg = v >= 72 ? battery3 : v >= 60 ? battery1 : battery2;
            matchedProducts.push({
              id: b.id || `bat-${Math.random().toString(36).substring(2, 7)}`,
              name: b.name || "EV Battery Pack",
              brand: b.brand || "VoltPro",
              category: "Battery",
              image: chosenImg,
              voltage: v,
              capacityAh: b.capacity_ah || 30,
              chemistry: b.chemistry || "Li-ion",
              warrantyMonths: b.warranty_months || 36,
              rangeKm: b.range_km || 100,
              weightKg: b.weight_kg || 15,
              fits: b.compatible_bike_ids || (activeBikeId ? [activeBikeId] : []),
              description: b.bms_features || b.name || "Certified High-Density EV Battery Pack",
              offers: [{ vendorId: "v1", price: b.price || 48999, stock: 10 }],
            });
          }
        }
      }

      // Map compatible parts to Product objects
      if (Array.isArray(data.compatible_parts)) {
        for (const p of data.compatible_parts) {
          const existing = products.find(
            (prod) => prod.id === p.id || prod.name.toLowerCase() === (p.name || "").toLowerCase()
          );
          if (existing) {
            matchedProducts.push(existing);
          } else {
            const isCharger =
              (p.category || "").toLowerCase().includes("charg") ||
              (p.name || "").toLowerCase().includes("charg");
            matchedProducts.push({
              id: p.id || `part-${Math.random().toString(36).substring(2, 7)}`,
              name: p.name || "Certified Spare Part",
              brand: "OEM Certified",
              category: isCharger ? "Charger" : "Spare Parts",
              image: isCharger ? charger : parts,
              warrantyMonths: p.warranty_months || 12,
              weightKg: 2,
              fits: p.compatible_bike_ids || (activeBikeId ? [activeBikeId] : []),
              description: p.specs || p.name || "Certified replacement component",
              offers: [{ vendorId: "v1", price: p.price || 2499, stock: 8 }],
            });
          }
        }
      }


      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: data.response || "Here are the verified fitment specs and products for your query.",
          items: matchedProducts.length > 0 ? matchedProducts.slice(0, 4) : undefined,
          safety: data.safety_advisories?.length ? data.safety_advisories : undefined,
        },
      ]);
    } catch {
      // Graceful offline fallback
      setMsgs((m) => [...m, answerLocal(trimmed, activeBikeId)]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      return setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: "Voice isn't supported in this browser — please type instead (Chrome works best).",
        },
      ]);
    }
    if (listening) {
      try {
        recRef.current?.stop();
      } catch {}
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.onresult = (e: any) => setInput(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => {
      setListening(false);
      setInput((v) => {
        if (v) send(v);
        return v;
      });
    };
    recRef.current = r;
    try {
      r.start();
      setListening(true);
    } catch {}
  };

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-4xl flex-col px-4 py-8 md:px-6">
        {/* Header matching ui branch */}
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Zap className="h-6 w-6" fill="currentColor" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Volt Assistant</h1>
            <p className="text-sm text-muted-foreground">Voice and text search for verified EV parts</p>
          </div>
        </div>

        {/* Message Thread */}
        <div className="mt-8 flex-1 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "max-w-full rounded-3xl border border-border/80 bg-card/85 p-5 shadow-card backdrop-blur-2xl text-foreground"
                }
              >
                {m.role === "user" ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                ) : (
                  <FormattedMessage text={m.text} />
                )}

                {/* Safety advisories banner if provided */}
                {m.safety && m.safety.length > 0 && (
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Electrical Safety Advisory</span>
                    </div>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      {m.safety.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Product Grid matching ui branch */}
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

          {/* Thinking Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-full rounded-3xl border border-border/80 bg-card/85 p-4 shadow-card backdrop-blur-2xl text-foreground">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Zap className="h-4 w-4 animate-pulse text-primary" />
                  <span>Volt is analyzing catalog & verified fitment specs…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition hover:border-primary hover:text-primary active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sticky Input Bar matching ui branch */}
        <div className="sticky bottom-24 mt-6 flex items-center gap-2 rounded-3xl border border-border/80 bg-card/85 p-2 shadow-2xl backdrop-blur-2xl md:bottom-6">
          <button
            onClick={toggleMic}
            aria-label="Speak"
            className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition-all ${
              listening
                ? "bg-destructive text-destructive-foreground shadow-md"
                : "bg-primary text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-105 active:scale-95"
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
            disabled={loading}
            aria-label="Send"
            className="grid h-12 w-12 place-items-center rounded-full border border-border/80 bg-card/60 transition hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
