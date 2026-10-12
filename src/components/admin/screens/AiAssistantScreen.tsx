import React, { useState } from "react";
import {
  Bot,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Users,
  Search,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";

interface ConversationLog {
  id: string;
  time: string;
  userPrompt: string;
  aiResponse: string;
  matchedBike: string;
  suggestedProduct: string;
  wasResolved: boolean;
  userSatisfaction: "Thumbs Up" | "Thumbs Down";
}

const CONVERSATION_LOGS: ConversationLog[] = [
  {
    id: "conv_01",
    time: "10 mins ago",
    userPrompt: "My Ola S1 Pro Gen 2 brake disc is scraping when riding two up. Which ceramic pad do you recommend?",
    aiResponse: "Recommended Kavach Sintered Ceramic Front Brake Pad Set (₹1,599). Guaranteed OEM caliper fitment for Ola Gen 2 with high thermal tolerance.",
    matchedBike: "Ola S1 Pro Gen 2",
    suggestedProduct: "Kavach Ceramic Brake Pads",
    wasResolved: true,
    userSatisfaction: "Thumbs Up",
  },
  {
    id: "conv_02",
    time: "25 mins ago",
    userPrompt: "Can I use HyperCharge 72V 12A fast charger with an Ather 450X Gen 3?",
    aiResponse: "Yes, Ather Gen 3 supports the fast DC protocol via the compatible converter harness included in the box. Verified safe by our technical hub.",
    matchedBike: "Ather 450X Gen 3",
    suggestedProduct: "HyperCharge Pro 72V 12A",
    wasResolved: true,
    userSatisfaction: "Thumbs Up",
  },
  {
    id: "conv_03",
    time: "42 mins ago",
    userPrompt: "I need a doorstep mechanic in Whitefield today to change my belt drive.",
    aiResponse: "Connecting you with human operations lead. Technician booking initiated for Whitefield hub.",
    matchedBike: "Ather 450X",
    suggestedProduct: "Apex Carbon Steel Belt 78T",
    wasResolved: false,
    userSatisfaction: "Thumbs Up",
  },
  {
    id: "conv_04",
    time: "1 hour ago",
    userPrompt: "What is the warranty period on VoltRide 60V 30Ah battery pack?",
    aiResponse: "VoltRide 60V 30Ah pack comes with 36 months manufacturer warranty covering cell degradation below 75% capacity.",
    matchedBike: "Universal",
    suggestedProduct: "VoltRide 60V 30Ah Battery",
    wasResolved: true,
    userSatisfaction: "Thumbs Up",
  },
];

export function AiAssistantScreen() {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredLogs = CONVERSATION_LOGS.filter((c) =>
    filterQuery ? c.userPrompt.toLowerCase().includes(filterQuery.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          AI Automotive Assistant Telemetry & Logs
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Conversational queries, VIN match accuracy, knowledge base resolution rates and human support handoffs.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">AI Resolution Rate</p>
          <p className="font-display text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums">92.4%</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">Answered without human escalation</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Total Questions Today</p>
          <p className="font-display text-3xl font-extrabold text-[#111111] mt-1 tabular-nums">648</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">Average response time 1.2s</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Human Handoffs</p>
          <p className="font-display text-3xl font-extrabold text-[#B45309] mt-1 tabular-nums">49</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">Transferred to technicians</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Cart Conversion via AI</p>
          <p className="font-display text-3xl font-extrabold text-[#E31E24] mt-1 tabular-nums">34.8%</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">Directly added suggested spare part</p>
        </div>
      </div>

      {/* Top Queried Topics Card */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-sm text-[#111111] mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#E31E24]" />
          <span>Top User Automotive Prompts This Week</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5">
            <p className="font-bold text-[#111111]">"Which battery fits Ather 450X?"</p>
            <p className="text-[#4B5563] mt-1 text-[11px] font-medium">184 queries · Suggested VoltRide 60V 30Ah</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5">
            <p className="font-bold text-[#111111]">"Doorstep brake installation fee in Bengaluru?"</p>
            <p className="text-[#4B5563] mt-1 text-[11px] font-medium">142 queries · Guided to ₹299 garage fitment</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5">
            <p className="font-bold text-[#111111]">"Ola S1 Pro Gen 2 fast charger speed?"</p>
            <p className="text-[#4B5563] mt-1 text-[11px] font-medium">98 queries · Verified HyperCharge 72V 12A</p>
          </div>
        </div>
      </div>

      {/* Conversation Logs Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#E31E24]" />
            <span>Recent Conversational Transcripts</span>
          </h3>

          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search user query text..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="h-9 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-9 pr-3 text-xs text-[#111111] font-medium placeholder:text-[#9CA3AF] shadow-2xs outline-none focus:border-[#E31E24]"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#6B7280] text-[11px] font-medium">{log.time}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] text-[#E31E24] font-bold">
                    {log.matchedBike}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      log.wasResolved ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-900 border-amber-300"
                    }`}
                  >
                    {log.wasResolved ? "Resolved by AI" : "Escalated to Tech"}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <p className="font-bold text-[#111111]">👤 User: "{log.userPrompt}"</p>
                <p className="text-[#374151] bg-gray-50/80 p-3 rounded-xl border border-[#E5E7EB] font-medium leading-relaxed">
                  🤖 AI: "{log.aiResponse}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
