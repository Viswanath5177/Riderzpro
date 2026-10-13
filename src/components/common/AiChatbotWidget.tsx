import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ShoppingBag,
  Truck,
  Wrench,
  Check,
  ChevronRight,
  Mic,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { products, inr } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  recommendations?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    vendorId: string;
  }>;
  action?: {
    type: "track" | "cart" | "garage";
    label: string;
  };
}

export function AiChatbotWidget() {
  const { userProfile, activeBikeId, garage, orders, addToCart, setIsCartOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeBike = garage[0];
  const liveOrder = orders.find((o) => o.status < 5);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Hello ${userProfile.name ? userProfile.name.split(" ")[0] : "Aakash"}! 👋 I'm your RiderzPro AI Fitment & Support Copilot.\n\nI can verify parts compatibility for your ${
        activeBike?.nickname || "Ather 450X"
      }, track real-time courier dispatches, or recommend certified fast chargers. How can I help you today?`,
      time: "Just now",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const quickPrompts = [
    "⚡ Fast chargers for Ather 450X",
    "📦 Track my order #RZ-849201",
    "🔋 60V NMC battery packs",
    "🛠️ Book 24-point battery check",
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate AI response based on query
    setTimeout(() => {
      setIsTyping(false);
      const q = query.toLowerCase();

      let reply: ChatMessage;

      if (q.includes("track") || q.includes("order") || q.includes("rz-")) {
        const orderId = liveOrder ? liveOrder.id : "RZ-849201";
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Here is the live dispatch status for order **#${orderId}**:\n\n• **Status:** Courier Picked Up (Milestone 4/6)\n• **Courier Provider:** RiderzPro Fleet (GPS Live)\n• **Assigned Rider:** Suresh K. (Rating: 4.9 ★)\n• **ETA:** ~25 mins to Bellandur\n\nYou can inspect live telemetry or call the rider directly below.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          action: {
            type: "track",
            label: "Open Live GPS Tracker →",
          },
        };
      } else if (q.includes("charger") || q.includes("charging")) {
        const charger = products.find((p) => p.category === "Charger") || products[0];
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `For your Ather 450X (48V architecture), I recommend the **ChargeMax 48V Fast Charger** with auto temperature cutoff, or the **ChargeMax 3.3kW Fast Charger** for 60V architectures.\n\nHere are verified compatible chargers ready for 25-minute Indiranagar dispatch:`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          recommendations: [
            {
              id: charger.id,
              name: charger.name,
              price: charger.offers[0]?.price || 14500,
              image: charger.image,
              vendorId: charger.offers[0]?.vendorId || "v1",
            },
          ],
        };
      } else if (q.includes("battery") || q.includes("pack") || q.includes("nmc") || q.includes("lifepo4")) {
        const battery = products.find((p) => p.category === "Battery") || products[0];
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `We offer both **NMC (High energy density)** and **LiFePO4 (Ultra-safe 3000+ cycle)** battery packs with integrated Smart BMS.\n\n• **VoltRide 60V 30Ah NMC**: 110 km range, 36-month warranty.\n• **VoltEdge 48V 50Ah LiFePO4**: 120 km range, 48-month warranty (100% Ather compatible).`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          recommendations: [
            {
              id: battery.id,
              name: battery.name,
              price: battery.offers[0]?.price || 62000,
              image: battery.image,
              vendorId: battery.offers[0]?.vendorId || "v1",
            },
          ],
        };
      } else if (q.includes("service") || q.includes("health") || q.includes("diagnostic") || q.includes("bms")) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `We have a **Monsoon Special 24-Point Comprehensive Battery & BMS Diagnostic** available with zero booking fee using coupon code **EVSAFE**.\n\nA certified technician visits your doorstep in Bellandur, tests cell balancing drift, checks thermal sensors, and validates water seal integrity.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          action: {
            type: "garage",
            label: "Book Doorstep Technician (₹299 FREE) →",
          },
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `I've analyzed your question regarding "${query}". All our components come with verified VIN fitment guarantee and 25-minute express local dispatch in Bengaluru.\n\nWould you like me to recommend matching spare parts, track your live order, or check battery health?`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 700);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: "ai",
        text: `Chat reset. What would you like to explore next?`,
        time: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button in Bottom Right */}
      {/* Floating Launcher Button (Apple Intelligence Siri Glassmorphic Theme) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative group flex items-center gap-2.5 rounded-full px-4.5 py-3.5 text-white font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-xl border border-white/40",
            isOpen
              ? "bg-slate-900/90 text-white shadow-lg ring-2 ring-indigo-500/30"
              : "bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:shadow-[0_14px_45px_rgba(139,92,246,0.65)] hover:scale-105 ring-2 ring-indigo-400/40"
          )}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          title="Open Apple Glassmorphic Copilot"
        >
          {isOpen ? (
            <>
              <X className="h-5 w-5" />
              <span>Close Copilot</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <Sparkles className="h-4.5 w-4.5 text-white" />
              <span className="tracking-wide">Ask AI Copilot</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chatbot Window (Apple Intelligence Glassmorphism) */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[390px] sm:w-[430px] max-w-[calc(100vw-2rem)] h-[570px] max-h-[82vh] rounded-3xl bg-white/90 backdrop-blur-2xl backdrop-saturate-180 border border-indigo-500/25 shadow-[0_25px_70px_rgba(99,102,241,0.22)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white p-4 flex items-center justify-between border-b border-indigo-500/20 shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-display text-white">RiderzPro AI Copilot</h3>
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818CF8]" />
                </div>
                <p className="text-[11px] text-indigo-200/80">Apple Glassmorphic Fitment Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2.5 max-w-[88%]",
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "h-7 w-7 rounded-full grid place-items-center text-white shrink-0 mt-0.5 text-[10px] font-bold shadow-2xs",
                    m.sender === "user" ? "bg-gray-800" : "bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500"
                  )}
                >
                  {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-2xs",
                      m.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white rounded-tr-xs"
                        : "bg-indigo-50/70 text-gray-900 border border-indigo-100 rounded-tl-xs"
                    )}
                  >
                    {m.text}
                  </div>

                  {/* Recommendation Part Card */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {m.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-2.5 rounded-2xl bg-white border border-indigo-100 shadow-2xs flex items-center justify-between gap-3 hover:border-indigo-300 transition"
                        >
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="h-11 w-11 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-900 truncate">{rec.name}</p>
                            <p className="text-[10px] text-indigo-700 font-semibold">{inr(rec.price)}</p>
                          </div>
                          <button
                            onClick={() => {
                              addToCart(rec.id, rec.vendorId, 1);
                              setIsCartOpen(true);
                              toast.success(`Added ${rec.name} to cart!`);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 text-white text-[10px] font-bold hover:opacity-90 transition shrink-0 active:scale-95 shadow-2xs cursor-pointer"
                          >
                            + Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contextual Action Button */}
                  {m.action && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          if (m.action?.type === "track") {
                            toast.info("Navigating to Live GPS Tracking...");
                            window.location.href = "/dashboard/customer?tab=tracking";
                          } else if (m.action?.type === "garage") {
                            window.location.href = "/dashboard/customer?tab=service";
                          } else if (m.action?.type === "cart") {
                            setIsCartOpen(true);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-[11px] font-bold shadow-2xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{m.action.label}</span>
                      </button>
                    </div>
                  )}

                  <span className="text-[9.5px] text-gray-400 px-1 inline-block">{m.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 grid place-items-center text-white shrink-0">
                  <Bot className="h-3 w-3" />
                </span>
                <span className="p-2.5 rounded-2xl bg-indigo-50/80 rounded-tl-xs flex items-center gap-1 border border-indigo-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (Apple Glassmorphic chips) */}
          <div className="px-3 py-2 border-t border-indigo-100 bg-indigo-50/40 overflow-x-auto flex gap-1.5 shrink-0 no-scrollbar">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white border border-indigo-200/80 text-indigo-950 text-[10px] font-medium whitespace-nowrap transition active:scale-95 shadow-2xs cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-indigo-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fitment, batteries, orders..."
                  className="w-full h-10 rounded-full border border-indigo-200/80 bg-indigo-50/30 pl-3.5 pr-9 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => toast.info("Voice input listening...")}
                  className="absolute right-2.5 top-2.5 text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                  title="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white grid place-items-center hover:opacity-90 disabled:opacity-40 transition active:scale-95 shadow-xs shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
