import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Send, _t as Eye, qt as Bell } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-CQjqc3RE.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassSelect } from "./GlassSelect-BzoeLAya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NotificationsScreen-Xy-z6J6B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsScreen() {
	const { notifications, sendNotificationCampaign } = useAdminStore();
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("Push Notification");
	const [targetAudience, setTargetAudience] = (0, import_react.useState)("Bengaluru Users");
	const columns = [
		{
			key: "title",
			header: "Campaign Title",
			sortable: true,
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-[#111111] text-sm",
				children: n.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#4B5563] font-medium line-clamp-1 mt-0.5",
				children: n.body
			})] })
		},
		{
			key: "channel",
			header: "Channel",
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-[#E31E24]",
				children: n.channel
			})
		},
		{
			key: "targetAudience",
			header: "Audience Segment",
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold text-[#111111] text-xs",
				children: n.targetAudience
			})
		},
		{
			key: "reachCount",
			header: "Delivered To",
			sortable: true,
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: [n.reachCount.toLocaleString("en-IN"), " users"]
			})
		},
		{
			key: "openRate",
			header: "Engagement Rate",
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold text-emerald-700 text-xs",
				children: n.openRate
			})
		},
		{
			key: "sentAt",
			header: "Dispatched",
			sortable: true,
			render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-[#6B7280] font-medium",
				children: new Date(n.sentAt).toLocaleDateString("en-IN")
			})
		}
	];
	const handleSend = (e) => {
		e.preventDefault();
		if (!title.trim() || !body.trim()) return;
		sendNotificationCampaign(title.trim(), body.trim(), channel, targetAudience);
		setTitle("");
		setBody("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Broadcast Communications & Notification Engine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Push notifications, SMS dispatch alerts and email newsletters across customer segments and riders."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-[#111111] mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compose Message Broadcast" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSend,
							className: "space-y-4 text-xs text-[#111111]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
										children: "Delivery Channel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										value: channel,
										onChange: (e) => setChannel(e.target.value),
										options: [
											{
												value: "Push Notification",
												label: "Mobile Push Notification"
											},
											{
												value: "SMS",
												label: "Priority SMS Broadcast"
											},
											{
												value: "Email",
												label: "Email Newsletter"
											}
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
										children: "Target Audience Segment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										value: targetAudience,
										onChange: (e) => setTargetAudience(e.target.value),
										options: [
											{
												value: "Bengaluru Users",
												label: "Bengaluru Hub Users (1,420)"
											},
											{
												value: "Active Riders",
												label: "Active Delivery Riders (142)"
											},
											{
												value: "All Customers",
												label: "All Registered Customers (2,840)"
											},
											{
												value: "High-Value Buyers",
												label: "High-Value VIP Buyers (640)"
											}
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
									children: "Notification Header / Subject"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
									required: true,
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "e.g. ⚡ Express 3-Hour Delivery Live in Indiranagar"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
									children: "Message Body"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									required: true,
									value: body,
									onChange: (e) => setBody(e.target.value),
									placeholder: "Type message content here...",
									className: "w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] shadow-2xs font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
										variant: "primary",
										size: "md",
										type: "submit",
										disabled: !title.trim() || !body.trim(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send Broadcast Now" })]
									})
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 flex flex-col items-center text-center shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-xs uppercase tracking-wider text-[#6B7280] mb-4 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Phone Notification Preview" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-64 rounded-[32px] border-4 border-gray-800 bg-gray-950 p-3 shadow-2xl relative text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-3 w-16 rounded-full bg-gray-800 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-gray-200 bg-white p-3 shadow-lg space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px] text-gray-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-[#E31E24] flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-2.5 w-2.5" }), " RIDERZPRO"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "now" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-[#111111] text-xs leading-tight",
										children: title || "Notification Title Preview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#4B5563] leading-normal line-clamp-3 font-medium",
										children: body || "Your message body will appear here on customer lockscreens."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-[10px] text-gray-500 mt-6 font-mono",
								children: "RiderzPro OS 2026"
							})
						]
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: notifications,
				columns,
				searchPlaceholder: "Search past campaigns...",
				searchKey: "title",
				keyExtractor: (n) => n.id,
				exportFileName: "riderzpro_notifications_history"
			})
		]
	});
}
//#endregion
export { NotificationsScreen };
