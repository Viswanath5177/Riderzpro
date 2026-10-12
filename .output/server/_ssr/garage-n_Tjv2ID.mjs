import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as Check, et as Bike, l as Trash2, w as ScanLine } from "../_libs/lucide-react.mjs";
import { D as useStore, d as bikes, m as decodeVin, y as getBike } from "./bits-PIC53EAH.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as scooter_default } from "./scooter-ILmB-gJJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/garage-n_Tjv2ID.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Garage() {
	const { garage, addBike, removeBike, activeBikeId, setActiveBikeId } = useStore();
	const [vin, setVin] = (0, import_react.useState)("");
	const [bikeId, setBikeId] = (0, import_react.useState)(bikes[0].id);
	const [year, setYear] = (0, import_react.useState)(bikes[0].years.at(-1));
	const sel = getBike(bikeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl md:text-7xl",
				children: "My Garage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Your bikes decide which parts we show as compatible."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-6 w-6 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl",
							children: "Decode VIN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "17 characters, found on your RC book or frame."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: vin,
								onChange: (e) => setVin(e.target.value),
								maxLength: 17,
								placeholder: "MD9A450XAN1234567",
								className: "h-12 flex-1 rounded-xl border border-border bg-background px-4 font-mono uppercase tracking-wider outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									const r = decodeVin(vin);
									if (!r.ok || !r.bike) return toast.error(r.error);
									addBike({
										bikeId: r.bike.id,
										year: r.year,
										vin: vin.toUpperCase()
									});
									toast.success(`${r.bike.make} ${r.bike.model} ${r.year ?? ""} added`);
									setVin("");
								},
								className: "rounded-xl bg-primary px-5 font-semibold text-primary-foreground",
								children: "Decode"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [vin.length, "/17 · Try MD9A450XAN1234567 (Ather) or P6R1S1PR2PN000001 (Ola)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								"or pick manually",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: bikeId,
								onChange: (e) => {
									setBikeId(e.target.value);
									setYear(getBike(e.target.value).years.at(-1));
								},
								className: "h-12 rounded-xl border border-border bg-background px-3",
								children: bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: b.id,
									children: [
										b.make,
										" ",
										b.model
									]
								}, b.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: year,
								onChange: (e) => setYear(+e.target.value),
								className: "h-12 rounded-xl border border-border bg-background px-3",
								children: sel.years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: y }, y))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								addBike({
									bikeId,
									year
								});
								toast.success("Bike added");
							},
							className: "mt-3 w-full rounded-xl border border-primary py-3 font-semibold text-primary",
							children: "Add to garage"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						garage.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground",
							children: "No bikes yet."
						}),
						garage.map((g) => {
							const b = getBike(g.bikeId);
							const active = activeBikeId === g.bikeId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center gap-4 overflow-hidden rounded-3xl border bg-card p-3 shadow-card ${active ? "border-primary" : "border-border"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: scooter_default,
										alt: b.model,
										loading: "lazy",
										width: 96,
										height: 96,
										className: "h-20 w-20 rounded-2xl object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-display text-2xl leading-none",
												children: [
													b.make,
													" ",
													b.model
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground",
												children: [
													g.year ?? "—",
													" · ",
													b.voltage,
													"V system"
												]
											}),
											g.vin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs text-muted-foreground",
												children: g.vin
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveBikeId(g.bikeId),
										className: `flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-primary text-primary-foreground" : "border border-border"}`,
										children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), "Active"] }) : "Set active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Remove",
										onClick: () => removeBike(g.bikeId),
										className: "p-2 text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}, g.bikeId);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							className: "flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4" }), " Shop parts for my active bike"]
						})
					]
				})]
			})
		]
	}) });
}
//#endregion
export { Garage as component };
