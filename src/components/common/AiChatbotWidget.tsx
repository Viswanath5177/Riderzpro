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

interface AiChatbotWidgetProps {
  activeTab?: string;
}

export function AiChatbotWidget({ activeTab }: AiChatbotWidgetProps) {
  const { garage, orders, addToCart, setIsCartOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // VITE_ENABLE_AI_COPILOT flag check (defaults to true)
  const isAiEnabled = import.meta.env.VITE_ENABLE_AI_COPILOT !== "false";

  // Screen visibility filter: Only show on Home, Shop, and Product screens.
  // Hide on Cart, Checkout, Orders, Tracking, Profile, Login.
  const isAllowedScreen = (() => {
    if (!isAiEnabled) return false;
    if (activeTab) {
      return activeTab === "overview" || activeTab === "shop";
    }
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/" || p === "/shop" || p.startsWith("/product")) {
        return true;
      }
      return false;
    }
    return true;
  })();

  const initialGreeting: ChatMessage = {
    id: "m-initial",
    sender: "ai",
    text: "How can I help?",
    time: "Just now",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  if (!isAllowedScreen) {
    return null;
  }

  // At most 3 quick chips
  const quickChips = ["Where is my order?", "Find a part", "Check fitment"];

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

    const liveOrder = orders.find((o) => o.status < 5);

    setTimeout(() => {
      setIsTyping(false);
      const q = query.toLowerCase();
      let reply: ChatMessage;

      if (q.includes("order") || q.includes("where")) {
        const orderId = liveOrder ? liveOrder.id : "RZ-849201";
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Order #${orderId} is in transit. Rider assigned: Suresh K. ETA: 25 mins.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          action: {
            type: "track",
            label: "Track order",
          },
        };
      } else if (q.includes("part") || q.includes("find")) {
        const samplePart = products[0];
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Here are popular verified spares for quick delivery:",
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          recommendations: [
            {
              id: samplePart.id,
              name: samplePart.name,
              price: samplePart.offers[0]?.price || 14500,
              image: samplePart.image,
              vendorId: samplePart.offers[0]?.vendorId || "v1",
            },
          ],
        };
      } else if (q.includes("fit") || q.includes("check")) {
        const bikeName = garage[0]?.nickname || "Ather 450X";
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `All parts marked "Fits my bike" are guaranteed compatible with your ${bikeName}.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "I can check fitment, find parts, or track your orders.",
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
    setInput("");
  };

  return (
    <>
      {/* FIX 2: ONE icon-only round button (48px, sparkle icon, aria-label "Ask assistant")
          fixed bottom-right: right 16px, bottom calc(var(--nav-h) + 12px + env(safe-area-inset-bottom))
          z-index 55 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ask assistant"
        title="Ask assistant"
        className="fixed right-4 bottom-[calc(var(--nav-h,56px)+12px+env(safe-area-inset-bottom,0px))] z-[55] h-12 w-12 min-w-12 min-h-12 rounded-full grid place-items-center bg-[#111111] hover:bg-black text-white shadow-lg active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <Sparkles className="h-5 w-5 text-white" />
      </button>

      {/* Assistant Bottom Sheet: max 85% height, grab handle, z-index 60 */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Container */}
          <div className="relative z-10 w-full max-w-lg mx-auto h-[85dvh] max-h-[85dvh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-gray-300" />
            </div>

            {/* Header: Short title, actions */}
            <div className="px-4 py-2 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E31E24]" />
                <h3 className="text-sm font-bold text-gray-900">Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-8 w-8 rounded-full grid place-items-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full grid place-items-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                  title="Close assistant"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#F9FAFB]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full grid place-items-center text-white shrink-0 text-[10px] font-bold",
                      m.sender === "user" ? "bg-gray-900" : "bg-[#E31E24]"
                    )}
                  >
                    {m.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={cn(
                        "p-3 rounded-2xl whitespace-pre-line text-xs leading-relaxed",
                        m.sender === "user"
                          ? "bg-[#E31E24] text-white rounded-tr-xs"
                          : "bg-white text-gray-900 border border-[#E5E7EB] rounded-tl-xs shadow-2xs"
                      )}
                    >
                      {m.text}
                    </div>

                    {/* Recommendations if any */}
                    {m.recommendations && m.recommendations.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {m.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="p-2 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between gap-2"
                          >
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="h-10 w-10 rounded-lg object-cover bg-gray-50 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{rec.name}</p>
                              <p className="text-[11px] font-semibold text-gray-700">{inr(rec.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(rec.id, rec.vendorId, 1);
                                setIsCartOpen(true);
                                toast.success(`Added ${rec.name} to cart`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white text-[10px] font-bold shrink-0 cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action button if any */}
                    {m.action && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (m.action?.type === "track") {
                              setIsOpen(false);
                              window.location.href = "/dashboard/customer?tab=tracking";
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
                        >
                          {m.action.label}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="h-5 w-5 rounded-full bg-[#E31E24] grid place-items-center text-white shrink-0">
                    <Bot className="h-2.5 w-2.5" />
                  </span>
                  <span className="p-2 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-bounce" />
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips: Exactly 3 chips ("Where is my order?", "Find a part", "Check fitment") */}
            <div className="px-3 py-2 border-t border-[#E5E7EB] bg-white flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-full bg-[#F5F6F8] hover:bg-gray-200 border border-[#E5E7EB] text-gray-800 text-xs font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E5E7EB] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 h-11 rounded-full border border-[#E5E7EB] bg-[#F5F6F8] px-4 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E31E24] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="h-11 w-11 rounded-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-40 text-white grid place-items-center shrink-0 cursor-pointer transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
