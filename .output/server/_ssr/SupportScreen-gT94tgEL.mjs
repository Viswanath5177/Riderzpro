import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, j as Send } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SupportScreen-gT94tgEL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupportScreen() {
	const { tickets, replyToTicket, updateTicketStatus } = useAdminStore();
	const [selectedTicket, setSelectedTicket] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [replyText, setReplyText] = (0, import_react.useState)("");
	const filterTabs = [
		{
			label: "All Tickets",
			value: "ALL",
			count: tickets.length
		},
		{
			label: "Open",
			value: "Open",
			count: tickets.filter((t) => t.status === "Open").length
		},
		{
			label: "In Progress",
			value: "In Progress",
			count: tickets.filter((t) => t.status === "In Progress").length
		},
		{
			label: "Resolved",
			value: "Resolved",
			count: tickets.filter((t) => t.status === "Resolved").length
		},
		{
			label: "Escalated",
			value: "Escalated",
			count: tickets.filter((t) => t.status === "Escalated").length
		}
	];
	const columns = [
		{
			key: "ticketNumber",
			header: "Ticket #",
			sortable: true,
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono font-bold text-[#111111] text-xs",
				children: t.ticketNumber
			})
		},
		{
			key: "customerName",
			header: "Customer",
			sortable: true,
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-[#111111] text-sm",
				children: t.customerName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-[#6B7280] font-medium",
				children: ["Order: ", t.orderId || "General"]
			})] })
		},
		{
			key: "subject",
			header: "Subject & Issue",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[#111111] text-xs truncate",
					children: t.subject
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-bold text-[#E31E24]",
					children: t.category
				})]
			})
		},
		{
			key: "priority",
			header: "Priority",
			sortable: true,
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-bold text-xs ${t.priority === "High" ? "text-red-700" : t.priority === "Medium" ? "text-amber-700" : "text-[#4B5563]"}`,
				children: t.priority
			})
		},
		{
			key: "assignedTo",
			header: "Assignee",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#111111] font-semibold text-xs",
				children: t.assignedTo
			})
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: t.status,
				size: "sm"
			})
		}
	];
	const handleSendReply = (e) => {
		e.preventDefault();
		if (!selectedTicket || !replyText.trim()) return;
		replyToTicket(selectedTicket.id, replyText.trim());
		setReplyText("");
		setSelectedTicket({
			...selectedTicket,
			status: "In Progress",
			messages: [...selectedTicket.messages, {
				id: `msg_${Date.now()}`,
				sender: "agent",
				senderName: "Operations Support",
				text: replyText.trim(),
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Customer Support & Ticket Desk"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Live technical assistance, fitment queries, delivery escalations and order troubleshooting."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: tickets,
				columns,
				searchPlaceholder: "Search ticket #, customer or subject...",
				searchKey: (t) => `${t.ticketNumber} ${t.customerName} ${t.subject} ${t.category}`,
				filterTabs,
				currentFilter: statusFilter,
				onFilterChange: setStatusFilter,
				filterPredicate: (t, f) => t.status === f,
				onRowClick: (ticket) => setSelectedTicket(ticket),
				keyExtractor: (t) => t.id,
				exportFileName: "riderzpro_support_tickets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedTicket),
				onClose: () => setSelectedTicket(null),
				width: "lg",
				title: selectedTicket ? `Ticket #${selectedTicket.ticketNumber}` : void 0,
				description: selectedTicket ? `Filed by ${selectedTicket.customerName} · ${selectedTicket.category}` : void 0,
				children: selectedTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col h-full space-y-4 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: selectedTicket.status,
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#4B5563] font-medium",
									children: ["Assigned: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-[#111111]",
										children: selectedTicket.assignedTo
									})]
								})]
							}), selectedTicket.status !== "Resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "primary",
								size: "sm",
								onClick: () => {
									updateTicketStatus(selectedTicket.id, "Resolved");
									setSelectedTicket({
										...selectedTicket,
										status: "Resolved"
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mark Resolved" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-700 font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }), " Issue Closed"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111] text-sm",
								children: selectedTicket.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-3 text-[#4B5563] text-[11px] font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Category: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-[#E31E24]",
										children: selectedTicket.category
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Priority: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-[#111111]",
										children: selectedTicket.priority
									})] }),
									selectedTicket.orderId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Order: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-[#111111]",
										children: selectedTicket.orderId
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 space-y-3 overflow-y-auto max-h-[360px] p-2 pr-1",
							children: selectedTicket.messages.map((msg) => {
								const isAgent = msg.sender === "agent";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex flex-col ${isAgent ? "items-end" : "items-start"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${isAgent ? "bg-red-50 border border-red-200 text-[#111111]" : "bg-gray-100 border border-gray-200 text-[#111111]"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-[10px] text-[#4B5563] mb-1",
												children: msg.senderName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-[#111111]",
												children: msg.text
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-[9px] text-[#6B7280] text-right font-medium",
												children: new Date(msg.timestamp).toLocaleTimeString("en-IN")
											})
										]
									})
								}, msg.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSendReply,
							className: "pt-2 border-t border-[#E5E7EB] flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Type reply to customer...",
								value: replyText,
								onChange: (e) => setReplyText(e.target.value),
								className: "flex-1 rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] shadow-2xs font-medium"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "primary",
								size: "sm",
								type: "submit",
								disabled: !replyText.trim(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { SupportScreen };
