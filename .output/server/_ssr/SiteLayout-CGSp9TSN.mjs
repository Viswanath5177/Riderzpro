import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Dt as CircleQuestionMark, Ft as ChevronDown, It as Check, J as Menu, Jt as Battery, Kt as Bike, Nt as ChevronRight, O as Search, S as Shield, Tt as Circle, V as Package, Z as LogOut, a as User, b as ShoppingCart, ct as House, d as Tag, dt as HardHat, g as Sparkles, n as X, nt as LayoutDashboard, r as Wrench, tn as ArrowRight, x as ShoppingBag, zt as Car } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Logo, w as useStore } from "./bits-6XfYm-PF.mjs";
import { n as useAuth } from "./auth-ga-2flKS.mjs";
import { t as isDevAdminEnabled } from "./AdminDevBypass-BnAPMAZ6.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteLayout-CGSp9TSN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var categories = [
	{
		title: "Electric Bikes",
		desc: "Smart performance electric motorcycles & scooters",
		cat: "Electric Bikes",
		icon: Bike
	},
	{
		title: "Batteries & Chargers",
		desc: "OEM replacement packs, BMS & portable fast chargers",
		cat: "Battery",
		icon: Battery
	},
	{
		title: "Spare Parts",
		desc: "OEM disc brakes, Kevlar drive belts & hub motors",
		cat: "Spare Parts",
		icon: Wrench
	},
	{
		title: "Bike Accessories",
		desc: "Waterproof covers, sirens, disc locks & phone mounts",
		cat: "Bike Accessories",
		icon: Shield
	},
	{
		title: "Car Accessories",
		desc: "Dashcams, 150PSI tire inflators & Level-2 wallboxes",
		cat: "Car Accessories",
		icon: Car
	},
	{
		title: "Riding Gear & Helmets",
		desc: "ECE 22.06 helmets, CE Level-2 armored jackets & gloves",
		cat: "Riding Gear & Helmets",
		icon: HardHat
	}
];
function MegaMenu({ isOpen, onClose }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute left-0 right-0 top-[72px] z-50 border-b border-[#ececec] bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200",
		onMouseLeave: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-4 border-b border-[#ececec] mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-[#111111]",
					children: "Shop by Category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#6b7280] mt-0.5",
					children: "Explore 100% verified automotive parts and accessories"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					onClick: onClose,
					className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#e11d2a] hover:text-[#c91823] transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View all products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
				children: categories.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { cat: item.cat },
						onClick: onClose,
						className: "group flex items-start gap-3.5 rounded-xl border border-[#ececec] bg-white p-3.5 transition hover:border-[#e11d2a] hover:shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f8] text-[#111111] transition group-hover:bg-red-50 group-hover:text-[#e11d2a]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-[#111111] group-hover:text-[#e11d2a] transition",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 opacity-0 -translate-x-1 text-[#e11d2a] transition-all group-hover:opacity-100 group-hover:translate-x-0" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#6b7280] mt-0.5 line-clamp-1",
								children: item.desc
							})]
						})]
					}, item.title);
				})
			})]
		})
	});
}
var shopCategories = [
	{
		title: "Electric Bikes",
		cat: "Electric Bikes",
		icon: Bike
	},
	{
		title: "Batteries & Chargers",
		cat: "Battery",
		icon: Battery
	},
	{
		title: "Spare Parts",
		cat: "Spare Parts",
		icon: Wrench
	},
	{
		title: "Bike Accessories",
		cat: "Bike Accessories",
		icon: Shield
	},
	{
		title: "Car Accessories",
		cat: "Car Accessories",
		icon: Car
	},
	{
		title: "Riding Gear & Helmets",
		cat: "Riding Gear & Helmets",
		icon: HardHat
	}
];
function MobileDrawer({ isOpen, onClose, isAuthenticated, activeName, onSignOut }) {
	const [isShopExpanded, setIsShopExpanded] = (0, import_react.useState)(true);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	if (!isOpen) return null;
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate({
				to: "/shop",
				search: { q: searchQuery.trim() }
			});
			onClose();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex lg:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex w-full max-w-sm flex-1 flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-[72px] items-center justify-between border-b border-[#ececec] px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-10 w-10 items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f7f8] hover:text-[#111111] transition cursor-pointer",
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 border-b border-[#ececec]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearchSubmit,
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search parts, batteries, brands...",
							className: "h-10 w-full rounded-xl border border-[#ececec] bg-[#f7f7f8] pl-9 pr-4 text-xs font-medium text-[#111111] placeholder:text-[#6b7280] focus:border-[#e11d2a] focus:bg-white focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7280]" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto px-4 py-3 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsShopExpanded(!isShopExpanded),
							className: "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop Categories" }), isShopExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-[#6b7280]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-[#6b7280]" })]
						}), isShopExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 ml-2 space-y-0.5 border-l-2 border-[#ececec] pl-2",
							children: shopCategories.map((c) => {
								const Icon = c.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/shop",
									search: { cat: c.cat },
									onClick: onClose,
									className: "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#4b5563] hover:text-[#e11d2a] hover:bg-red-50/50 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-[#6b7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.title })]
								}, c.title);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/garage",
							onClick: onClose,
							className: "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#6b7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Garage" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/orders",
							onClick: onClose,
							className: "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-[#6b7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Orders" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/offers",
							onClick: onClose,
							className: "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-[#6b7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Offers" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/assistant",
							onClick: onClose,
							className: "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4 text-[#6b7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Help & Support" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-[#ececec] p-4 bg-[#f7f7f8]",
					children: isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs",
								children: activeName?.slice(0, 2).toUpperCase() || "CU"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-[#111111] truncate",
									children: activeName || "Customer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#6b7280]",
									children: "Customer Account"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/customer",
								onClick: onClose,
								className: "flex-1 rounded-xl border border-[#ececec] bg-white py-2 text-center text-xs font-semibold text-[#111111] hover:bg-gray-50 transition",
								children: "Dashboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									onSignOut();
									onClose();
								},
								className: "rounded-xl border border-[#ececec] bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" })
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/auth",
						onClick: onClose,
						className: "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e11d2a] text-xs font-semibold text-white transition hover:bg-[#c91823]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in" })]
					})
				})
			]
		})]
	});
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function Header() {
	const { cart, userProfile } = useStore();
	const { user, isAuthenticated, signOut } = useAuth();
	const navigate = useNavigate();
	const [isMegaMenuOpen, setIsMegaMenuOpen] = (0, import_react.useState)(false);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = (0, import_react.useState)(false);
	const [isSearchExpanded, setIsSearchExpanded] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const searchInputRef = (0, import_react.useRef)(null);
	const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
	(0, import_react.useEffect)(() => {
		if (isSearchExpanded && searchInputRef.current) searchInputRef.current.focus();
	}, [isSearchExpanded]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate({
				to: "/shop",
				search: { q: searchQuery.trim() }
			});
			setIsSearchExpanded(false);
		}
	};
	const handleSignOut = async () => {
		await signOut();
		toast.success("Signed out successfully", { description: "You have been signed out from Riderzpro." });
		navigate({ to: "/" });
	};
	const activeName = user?.name || userProfile?.name || "Customer";
	const initials = activeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 h-[72px] border-b border-[#ececec] bg-white/95 backdrop-blur-md transition-shadow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsMobileDrawerOpen(true),
						className: "flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] lg:hidden cursor-pointer",
						"aria-label": "Open mobile menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8 sm:h-9" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden lg:flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							onMouseEnter: () => setIsMegaMenuOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsMegaMenuOpen(!isMegaMenuOpen),
								className: `flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${isMegaMenuOpen ? "text-[#e11d2a] bg-red-50/50" : "text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180 text-[#e11d2a]" : "text-[#6b7280]"}` })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/garage",
							className: "px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition",
							activeProps: { className: "!text-[#e11d2a] !bg-red-50/50" },
							children: "My Garage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders",
							className: "px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition",
							activeProps: { className: "!text-[#e11d2a] !bg-red-50/50" },
							children: "Orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/offers",
							className: "px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition",
							activeProps: { className: "!text-[#e11d2a] !bg-red-50/50" },
							children: "Offers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/assistant",
							className: "px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition",
							activeProps: { className: "!text-[#e11d2a] !bg-red-50/50" },
							children: "Help"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: isSearchExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSearchSubmit,
								className: "flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: searchInputRef,
										type: "text",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										placeholder: "Search parts, batteries...",
										className: "h-10 w-48 sm:w-64 rounded-xl border border-[#ececec] bg-[#f7f7f8] pl-9 pr-3 text-xs font-medium text-[#111111] placeholder:text-[#6b7280] focus:border-[#e11d2a] focus:bg-white focus:outline-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#6b7280]" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsSearchExpanded(false),
									className: "flex h-10 w-10 items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f7f8] hover:text-[#111111] transition cursor-pointer",
									"aria-label": "Close search",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsSearchExpanded(true),
								className: "flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] transition cursor-pointer",
								"aria-label": "Search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4.5 w-4.5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							className: "relative flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] transition",
							"aria-label": "View Cart",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4.5 w-4.5" }), cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#e11d2a] px-1 text-[10px] font-bold text-white leading-none shadow-xs",
								children: cartCount
							})]
						}),
						isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-2 rounded-xl border border-[#ececec] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#111111] hover:border-gray-300 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-[10px]",
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline max-w-[90px] truncate",
									children: activeName.split(" ")[0]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56 rounded-2xl p-1.5 shadow-xl border border-[#ececec] bg-white z-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-3 py-2 border-b border-[#ececec] mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-[#111111] truncate",
										children: activeName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#6b7280] truncate",
										children: user?.email || user?.phone || userProfile?.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/dashboard/customer",
										className: "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dashboard" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/garage",
										className: "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Garage" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/orders",
										className: "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-[#e11d2a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Orders" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1 bg-[#ececec]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: handleSignOut,
									className: "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							className: "inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#e11d2a] hover:bg-[#c91823] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in" })]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MegaMenu, {
			isOpen: isMegaMenuOpen,
			onClose: () => setIsMegaMenuOpen(false)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDrawer, {
		isOpen: isMobileDrawerOpen,
		onClose: () => setIsMobileDrawerOpen(false),
		isAuthenticated,
		activeName,
		onSignOut: handleSignOut
	})] });
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-[#ececec] bg-white text-[#111111]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-[#6b7280] leading-relaxed max-w-sm",
							children: "India's specialized automotive marketplace for electric bike batteries, chargers, accessories, and chassis-verified replacement spares."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold text-[#111111] mb-4",
						children: "Shop"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2.5 text-sm text-[#6b7280]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Electric Bikes" },
								className: "hover:text-[#e11d2a] transition",
								children: "Electric Bikes"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Battery" },
								className: "hover:text-[#e11d2a] transition",
								children: "Batteries & Chargers"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Spare Parts" },
								className: "hover:text-[#e11d2a] transition",
								children: "Spare Parts"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Bike Accessories" },
								className: "hover:text-[#e11d2a] transition",
								children: "Bike Accessories"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Car Accessories" },
								className: "hover:text-[#e11d2a] transition",
								children: "Car Accessories"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { cat: "Riding Gear & Helmets" },
								className: "hover:text-[#e11d2a] transition",
								children: "Riding Gear & Helmets"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold text-[#111111] mb-4",
						children: "Company"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2.5 text-sm text-[#6b7280]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-[#e11d2a] transition",
								children: "About Us"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/assistant",
								className: "hover:text-[#e11d2a] transition",
								children: "Contact"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-[#e11d2a] transition",
								children: "Careers"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "hover:text-[#e11d2a] transition",
								children: "Partner with Us"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold text-[#111111] mb-4",
						children: "Support"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2.5 text-sm text-[#6b7280]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/assistant",
								className: "hover:text-[#e11d2a] transition",
								children: "Help Center"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/garage",
								className: "hover:text-[#e11d2a] transition",
								children: "Warranty Policy"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/orders",
								className: "hover:text-[#e11d2a] transition",
								children: "Returns & Refunds"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-[#e11d2a] transition",
								children: "Privacy Policy"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-[#e11d2a] transition",
								children: "Terms of Service"
							}) })
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ececec] pt-8 text-xs text-[#6b7280]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 RiderzPro Technologies. All rights reserved." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://twitter.com",
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-[#111111] transition",
							children: "Twitter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://instagram.com",
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-[#111111] transition",
							children: "Instagram"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://linkedin.com",
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-[#111111] transition",
							children: "LinkedIn"
						}),
						isDevAdminEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							className: "text-[#6b7280] hover:text-[#e11d2a] font-medium transition",
							children: "Admin"
						})
					]
				})]
			})]
		})
	});
}
function AIChatButton() {
	const [showTooltip, setShowTooltip] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-40",
		children: [showTooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-in fade-in zoom-in-95 duration-150 pointer-events-none",
			children: ["Ask AI Assistant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-[#111111]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/assistant",
			onMouseEnter: () => setShowTooltip(true),
			onMouseLeave: () => setShowTooltip(false),
			"aria-label": "Ask AI Automotive Assistant",
			className: "flex h-13 w-13 items-center justify-center rounded-full bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
		})]
	});
}
function SiteLayout({ children }) {
	const { cart } = useStore();
	const { isAuthenticated } = useAuth();
	const cartCount = cart.reduce((s, c) => s + c.qty, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white text-[#111111] pb-16 md:pb-0 font-sans selection:bg-red-500 selection:text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-h-[calc(100vh-72px)]",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBottomBar, {
				count: cartCount,
				isAuthenticated
			})
		]
	});
}
function MobileBottomBar({ count, isAuthenticated }) {
	const navigate = useNavigate();
	const tabs = [
		{
			to: "/",
			label: "Home",
			Icon: House,
			requiresAuth: false
		},
		{
			to: "/shop",
			label: "Shop",
			Icon: ShoppingBag,
			requiresAuth: false
		},
		{
			to: "/orders",
			label: "Orders",
			Icon: Package,
			requiresAuth: true
		},
		{
			to: isAuthenticated ? "/dashboard/customer" : "/auth",
			search: !isAuthenticated ? { redirect: "/dashboard/customer" } : void 0,
			label: "Account",
			Icon: User,
			requiresAuth: false
		}
	];
	const handleClick = (e, tab) => {
		if (tab.requiresAuth && !isAuthenticated) {
			e.preventDefault();
			navigate({
				to: "/auth",
				search: { redirect: tab.to }
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-[#ececec] bg-white/95 px-2 backdrop-blur-md md:hidden",
		children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: t.to,
			search: "search" in t ? t.search : void 0,
			onClick: (e) => handleClick(e, t),
			activeOptions: { exact: t.to === "/" },
			className: "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]",
			activeProps: { className: "!text-[#e11d2a]" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { className: "h-4.5 w-4.5" }), t.to === "/orders" && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#e11d2a]" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label })]
		}, t.label))
	});
}
//#endregion
export { SiteLayout as t };
