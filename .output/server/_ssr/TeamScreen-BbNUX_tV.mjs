import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { it as KeyRound, o as UserPlus, u as Trash2 } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-CQjqc3RE.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassSelect } from "./GlassSelect-BzoeLAya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TeamScreen-BbNUX_tV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamScreen() {
	const { team, inviteTeamMember, removeTeamMember } = useAdminStore();
	const [isInviteModalOpen, setIsInviteModalOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("Operations");
	const columns = [
		{
			key: "name",
			header: "Team Member",
			sortable: true,
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs",
					children: m.avatarInitials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[#111111] text-sm",
					children: m.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#4B5563] font-medium",
					children: m.email
				})] })]
			})
		},
		{
			key: "role",
			header: "Console Role",
			sortable: true,
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-bold text-xs ${m.role === "Super Admin" ? "text-[#E31E24]" : m.role === "Operations" ? "text-sky-700" : "text-[#4B5563]"}`,
				children: m.role
			})
		},
		{
			key: "permissions",
			header: "Access Rights",
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 text-[10px]",
				children: [
					m.permissions.orders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold",
						children: "Orders"
					}),
					m.permissions.sellers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold",
						children: "Sellers"
					}),
					m.permissions.payments && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold",
						children: "Finance"
					}),
					m.permissions.settings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold",
						children: "Settings"
					})
				]
			})
		},
		{
			key: "lastActive",
			header: "Activity",
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#6B7280] text-[11px] font-medium",
				children: m.lastActive
			})
		},
		{
			key: "status",
			header: "Status",
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: m.status,
				size: "sm"
			})
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right",
			render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-end",
				onClick: (e) => e.stopPropagation(),
				children: m.role !== "Super Admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => removeTeamMember(m.id),
					className: "rounded-lg bg-red-100 hover:bg-red-200 p-1.5 text-red-700 transition cursor-pointer",
					title: "Revoke console access",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
				})
			})
		}
	];
	const handleInvite = (e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim()) return;
		inviteTeamMember({
			name: name.trim(),
			email: email.trim().toLowerCase(),
			role,
			permissions: {
				orders: true,
				sellers: role === "Super Admin" || role === "Operations",
				riders: role === "Super Admin" || role === "Operations",
				products: role === "Super Admin" || role === "Operations",
				payments: role === "Super Admin" || role === "Finance",
				settings: role === "Super Admin"
			}
		});
		setName("");
		setEmail("");
		setIsInviteModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Team Members & Role-Based Permissions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Manage administrative staff, operations specialists, finance managers and granular module access."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					variant: "primary",
					size: "md",
					onClick: () => setIsInviteModalOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Invite Team Member" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: team,
				columns,
				searchPlaceholder: "Search team member by name or email...",
				searchKey: (m) => `${m.name} ${m.email} ${m.role}`,
				keyExtractor: (m) => m.id,
				exportFileName: "riderzpro_team"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-sm text-[#111111] mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role Permission Capability Matrix" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[#E5E7EB] text-[#6B7280] uppercase font-bold bg-gray-50/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Role Level"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Orders & Dispatches"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Sellers & KYC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Fleet GPS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Payouts & Finance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Global Settings"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-[#F3F4F6] font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-bold text-[#E31E24]",
										children: "Super Admin"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-bold text-sky-800",
										children: "Operations Lead"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-[#6B7280]",
										children: "Read Only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-gray-400",
										children: "No Access"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-bold text-[#374151]",
										children: "Support Specialist"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-[#6B7280]",
										children: "Read Only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-[#6B7280]",
										children: "Read Only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-gray-400",
										children: "No Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-gray-400",
										children: "No Access"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-bold text-amber-800",
										children: "Finance Manager"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-[#6B7280]",
										children: "Read Only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-gray-400",
										children: "No Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-emerald-800 font-bold",
										children: "Full Access"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-center text-gray-400",
										children: "No Access"
									})
								] })
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isInviteModalOpen,
				onClose: () => setIsInviteModalOpen(false),
				maxWidth: "md",
				title: "Invite New Console User",
				description: "Assign a security role and grant immediate operations access.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleInvite,
					className: "space-y-4 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
							children: "Full Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Anjali Verma"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
							children: "Corporate Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "anjali.v@riderzpro.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
							children: "Assigned Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
							value: role,
							onChange: (e) => setRole(e.target.value),
							options: [
								{
									value: "Operations",
									label: "Operations Specialist (Orders, Riders, KYC)"
								},
								{
									value: "Support",
									label: "Customer Support Specialist (Tickets, Reviews)"
								},
								{
									value: "Finance",
									label: "Finance & Accounts (Payouts, Commissions)"
								},
								{
									value: "Super Admin",
									label: "Super Admin (Full Root System Access)"
								}
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => setIsInviteModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								type: "submit",
								variant: "primary",
								size: "sm",
								children: "Send Console Invite"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { TeamScreen };
