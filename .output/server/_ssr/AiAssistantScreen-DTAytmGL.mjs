import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { K as MessageSquare, O as Search, g as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AiAssistantScreen-DTAytmGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CONVERSATION_LOGS = [
	{
		id: "conv_01",
		time: "10 mins ago",
		userPrompt: "My Ola S1 Pro Gen 2 brake disc is scraping when riding two up. Which ceramic pad do you recommend?",
		aiResponse: "Recommended Kavach Sintered Ceramic Front Brake Pad Set (₹1,599). Guaranteed OEM caliper fitment for Ola Gen 2 with high thermal tolerance.",
		matchedBike: "Ola S1 Pro Gen 2",
		suggestedProduct: "Kavach Ceramic Brake Pads",
		wasResolved: true,
		userSatisfaction: "Thumbs Up"
	},
	{
		id: "conv_02",
		time: "25 mins ago",
		userPrompt: "Can I use HyperCharge 72V 12A fast charger with an Ather 450X Gen 3?",
		aiResponse: "Yes, Ather Gen 3 supports the fast DC protocol via the compatible converter harness included in the box. Verified safe by our technical hub.",
		matchedBike: "Ather 450X Gen 3",
		suggestedProduct: "HyperCharge Pro 72V 12A",
		wasResolved: true,
		userSatisfaction: "Thumbs Up"
	},
	{
		id: "conv_03",
		time: "42 mins ago",
		userPrompt: "I need a doorstep mechanic in Whitefield today to change my belt drive.",
		aiResponse: "Connecting you with human operations lead. Technician booking initiated for Whitefield hub.",
		matchedBike: "Ather 450X",
		suggestedProduct: "Apex Carbon Steel Belt 78T",
		wasResolved: false,
		userSatisfaction: "Thumbs Up"
	},
	{
		id: "conv_04",
		time: "1 hour ago",
		userPrompt: "What is the warranty period on VoltRide 60V 30Ah battery pack?",
		aiResponse: "VoltRide 60V 30Ah pack comes with 36 months manufacturer warranty covering cell degradation below 75% capacity.",
		matchedBike: "Universal",
		suggestedProduct: "VoltRide 60V 30Ah Battery",
		wasResolved: true,
		userSatisfaction: "Thumbs Up"
	}
];
function AiAssistantScreen() {
	const [filterQuery, setFilterQuery] = (0, import_react.useState)("");
	const filteredLogs = CONVERSATION_LOGS.filter((c) => filterQuery ? c.userPrompt.toLowerCase().includes(filterQuery.toLowerCase()) : true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "AI Automotive Assistant Telemetry & Logs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Conversational queries, VIN match accuracy, knowledge base resolution rates and human support handoffs."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "AI Resolution Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums",
								children: "92.4%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "Answered without human escalation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Total Questions Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-[#111111] mt-1 tabular-nums",
								children: "648"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "Average response time 1.2s"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Human Handoffs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-[#B45309] mt-1 tabular-nums",
								children: "49"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "Transferred to technicians"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Cart Conversion via AI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-[#E31E24] mt-1 tabular-nums",
								children: "34.8%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "Directly added suggested spare part"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-sm text-[#111111] mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Top User Automotive Prompts This Week" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111]",
								children: "\"Which battery fits Ather 450X?\""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] mt-1 text-[11px] font-medium",
								children: "184 queries · Suggested VoltRide 60V 30Ah"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111]",
								children: "\"Doorstep brake installation fee in Bengaluru?\""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] mt-1 text-[11px] font-medium",
								children: "142 queries · Guided to ₹299 garage fitment"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111]",
								children: "\"Ola S1 Pro Gen 2 fast charger speed?\""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] mt-1 text-[11px] font-medium",
								children: "98 queries · Verified HyperCharge 72V 12A"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-[#111111] flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recent Conversational Transcripts" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search user query text...",
							value: filterQuery,
							onChange: (e) => setFilterQuery(e.target.value),
							className: "h-9 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-9 pr-3 text-xs text-[#111111] font-medium placeholder:text-[#9CA3AF] shadow-2xs outline-none focus:border-[#E31E24]"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filteredLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[#6B7280] text-[11px] font-medium",
								children: log.time
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] text-[#E31E24] font-bold",
									children: log.matchedBike
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${log.wasResolved ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-900 border-amber-300"}`,
									children: log.wasResolved ? "Resolved by AI" : "Escalated to Tech"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-bold text-[#111111]",
								children: [
									"👤 User: \"",
									log.userPrompt,
									"\""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[#374151] bg-gray-50/80 p-3 rounded-xl border border-[#E5E7EB] font-medium leading-relaxed",
								children: [
									"🤖 AI: \"",
									log.aiResponse,
									"\""
								]
							})]
						})]
					}, log.id))
				})]
			})
		]
	});
}
//#endregion
export { AiAssistantScreen };
