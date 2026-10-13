globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-12T06:31:08.769Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"d2-0pJxbgLG+EDoUWmTwFAZCX6mvLc\"",
		"mtime": "2026-10-13T05:34:08.339Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-13T05:34:08.339Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:34:08.339Z",
		"size": 190454,
		"path": "../public/logo.png"
	},
	"/assets/admin-zg9ko7FO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cbb-S7Pcu3nJJ5pEc9THdVm/PlcPbyM\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 23739,
		"path": "../public/assets/admin-zg9ko7FO.js"
	},
	"/assets/admin.approvals-DAeGFBfV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ca-bKTi9Y4tNiyWwORHSCnRGm4LIrc\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1482,
		"path": "../public/assets/admin.approvals-DAeGFBfV.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T06:31:08.812Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/admin.customers-BF8K7hwM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56f-lM+BOdPOyNurwqJGlyuiz1XeGlE\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1391,
		"path": "../public/assets/admin.customers-BF8K7hwM.js"
	},
	"/assets/admin.ai-assistant-B112iKY8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36f-UtWGOB7LT5oEJkKmuljJX7cV1C8\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 879,
		"path": "../public/assets/admin.ai-assistant-B112iKY8.js"
	},
	"/assets/admin.fitment-BLxbzwEW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35b-o5Dhd+7G8/1EW2iEsPAs2XKGI3c\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 859,
		"path": "../public/assets/admin.fitment-BLxbzwEW.js"
	},
	"/assets/admin.analytics-D2jd06Oo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-GdTQaPOKoq0Cfs6IuHeWC9EPcEA\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 850,
		"path": "../public/assets/admin.analytics-D2jd06Oo.js"
	},
	"/assets/admin.notifications-5-5MA3Wv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4cd-myyPGs4QeEYtliphfBu97HTtTGs\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1229,
		"path": "../public/assets/admin.notifications-5-5MA3Wv.js"
	},
	"/assets/admin.login-2NM0vZHk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2788-CjwJAhL72XPnuGAXIf6A/E6jTgs\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 10120,
		"path": "../public/assets/admin.login-2NM0vZHk.js"
	},
	"/assets/admin.index-D3I8elFA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da-y+iwNUvA88tcSQssbQF6il6GNI0\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1498,
		"path": "../public/assets/admin.index-D3I8elFA.js"
	},
	"/assets/admin.offers-CvazbfIj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54a-wVgZlPjaFefSuCkEdI+FZW0DQdw\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1354,
		"path": "../public/assets/admin.offers-CvazbfIj.js"
	},
	"/assets/admin.orders-CdQqZuV4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"568-KRxSyC/oROQNGX4fc5+d1sybOrI\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1384,
		"path": "../public/assets/admin.orders-CdQqZuV4.js"
	},
	"/assets/admin.products-DVF16u5y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"574-7YblgXa4uDsU0EvG/96GRutGMHE\"",
		"mtime": "2026-10-13T06:56:38.963Z",
		"size": 1396,
		"path": "../public/assets/admin.products-DVF16u5y.js"
	},
	"/assets/admin.reviews-Bp3D3kyV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d-pT1bqTA4R4qKL56WgWwM7KG5nIk\"",
		"mtime": "2026-10-13T06:56:38.963Z",
		"size": 1069,
		"path": "../public/assets/admin.reviews-Bp3D3kyV.js"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:34:08.339Z",
		"size": 190454,
		"path": "../public/riderzpro-logo.png"
	},
	"/assets/admin.sellers-I4sZhe9r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b2-492MLW4S4vwRLLA3HqLMgiOp77A\"",
		"mtime": "2026-10-13T06:56:38.963Z",
		"size": 1458,
		"path": "../public/assets/admin.sellers-I4sZhe9r.js"
	},
	"/assets/admin.payments-CslDAVCD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"50a-Sph/BcP13wKO2H34tL2o6PllBlo\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 1290,
		"path": "../public/assets/admin.payments-CslDAVCD.js"
	},
	"/assets/admin.riders-BqHRkkqe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"521-Z3jIzJ05uZLqnmx8lfiJ4JAtC7o\"",
		"mtime": "2026-10-13T06:56:38.963Z",
		"size": 1313,
		"path": "../public/assets/admin.riders-BqHRkkqe.js"
	},
	"/assets/admin.settings-CISxU53O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b4-/zADPRdUEiVgjrOi1wuYAuM0gZU\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 1204,
		"path": "../public/assets/admin.settings-CISxU53O.js"
	},
	"/assets/admin.support-BdjpCU_n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c1-7uKQYDq3OS8vJv+4dxd4bTWQMJ8\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 1217,
		"path": "../public/assets/admin.support-BdjpCU_n.js"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-13T05:34:08.339Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/assets/admin.team-BMbAL4YF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"548-xzIgjaXMM8e5ZofAb7Q42z+innw\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 1352,
		"path": "../public/assets/admin.team-BMbAL4YF.js"
	},
	"/assets/admin.warranty-BhzlenT5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a7-WUIXtuxeOak8WZUyT3tqKFDvJzA\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 1191,
		"path": "../public/assets/admin.warranty-BhzlenT5.js"
	},
	"/assets/AdminDevBypass-vCI3VFcS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f4-gAcv+TpQfYlG35oL5txIqhtwF60\"",
		"mtime": "2026-10-13T06:56:38.921Z",
		"size": 500,
		"path": "../public/assets/AdminDevBypass-vCI3VFcS.js"
	},
	"/assets/adminStore-ZmJ2oxeO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e777-AzO4J+xkdIxORldkaKX7FlB86Rg\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 59255,
		"path": "../public/assets/adminStore-ZmJ2oxeO.js"
	},
	"/assets/AnalyticsScreen-CCeVJLo8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"485f-3rY3J4XYNu10dc+/xA7G+olmNfU\"",
		"mtime": "2026-10-13T06:56:38.921Z",
		"size": 18527,
		"path": "../public/assets/AnalyticsScreen-CCeVJLo8.js"
	},
	"/assets/AnimatePresence-DOBXEDKg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1089-9ZeaJUPXic9Oc0G9fdYHlVcPexs\"",
		"mtime": "2026-10-13T06:56:38.929Z",
		"size": 4233,
		"path": "../public/assets/AnimatePresence-DOBXEDKg.js"
	},
	"/assets/AreaChart-LjrVprRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4465-F3TKDb4eaaCga36cVjelladOvDk\"",
		"mtime": "2026-10-13T06:56:38.929Z",
		"size": 17509,
		"path": "../public/assets/AreaChart-LjrVprRI.js"
	},
	"/assets/AiAssistantScreen-UywzGN8g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d58-PBANoGWL304Zt2DhtjovVwAvtUs\"",
		"mtime": "2026-10-13T06:56:38.921Z",
		"size": 7512,
		"path": "../public/assets/AiAssistantScreen-UywzGN8g.js"
	},
	"/assets/arrow-left-hNlAnx9b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-ZyT0jPBNcXS+OgAyEBMBBXcK70k\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 165,
		"path": "../public/assets/arrow-left-hNlAnx9b.js"
	},
	"/assets/arrow-right-Do1YRq-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-MG5M3ZeCIHQIg1nOyWoIY5g1a7Y\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 165,
		"path": "../public/assets/arrow-right-Do1YRq-l.js"
	},
	"/assets/assistant-BzbDHw3Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147c-cnV66eWgec4JVkszMhClHQHpKKw\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 5244,
		"path": "../public/assets/assistant-BzbDHw3Y.js"
	},
	"/assets/auth-CvDHuLlW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-jN5NU700h4S7gRr8n7UDN6rvhsQ\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 269,
		"path": "../public/assets/auth-CvDHuLlW.js"
	},
	"/assets/AuthPage-COz2AIo4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a55-NPCfi9DDt9t4uFQcRqCYG26LTwk\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 23125,
		"path": "../public/assets/AuthPage-COz2AIo4.js"
	},
	"/assets/ban-BfmLDQsn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-7Wa/mGqPPXqgSJc9kiPafvZhkd0\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 181,
		"path": "../public/assets/ban-BfmLDQsn.js"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-13T06:56:39.017Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-13T06:56:39.017Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/bike-CKDoK2gI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-XoTlQRMv1QGXw1kZs4yQFjIGqeQ\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 288,
		"path": "../public/assets/bike-CKDoK2gI.js"
	},
	"/assets/battery-DxtljaS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0-zXMxADODh4bZ/0fvfurNliKTsOk\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 192,
		"path": "../public/assets/battery-DxtljaS-.js"
	},
	"/assets/building-BAq3JF8S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"233-Gt/+lfCWIFxcrN+BFx+BW7uZ3MQ\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 563,
		"path": "../public/assets/building-BAq3JF8S.js"
	},
	"/assets/cart-Bqq4Al0M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4692-xQS89Rg3yOIAaVugULF2v6RFR0g\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 18066,
		"path": "../public/assets/cart-Bqq4Al0M.js"
	},
	"/assets/check-D5PIylc8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-uJ2Ivy+wmexk4Na2norU3xh+2cM\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 124,
		"path": "../public/assets/check-D5PIylc8.js"
	},
	"/assets/chevron-down-CZjeXQdU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"80-XCXba4/HZOV6r/hiyw5ygkJ3Izs\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 128,
		"path": "../public/assets/chevron-down-CZjeXQdU.js"
	},
	"/assets/chevron-left-DmTDziyb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-UHU04BmBy5cnfocsG6QiVpkmrr4\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 130,
		"path": "../public/assets/chevron-left-DmTDziyb.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/chevron-right-Cn2uMVoe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-7efaqzS43fErngDiSn7T2ryY4BE\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 130,
		"path": "../public/assets/chevron-right-Cn2uMVoe.js"
	},
	"/assets/circle-alert-Cefc45Zt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-GHDo7/jCmhVC5ajBHjWBn0BqdYk\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 250,
		"path": "../public/assets/circle-alert-Cefc45Zt.js"
	},
	"/assets/copy-BywfabTK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-W7Py1a1ZK7Zc+IZBAyp1tfHCmms\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 236,
		"path": "../public/assets/copy-BywfabTK.js"
	},
	"/assets/circle-C6563C5v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-ulktNrhofJMvUKKOv4sJ0vah1v0\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 130,
		"path": "../public/assets/circle-C6563C5v.js"
	},
	"/assets/ConfirmDialog-C-afro7F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"438-L1aHm0a76HZ5/GU2gEBJzJ+2Vts\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 1080,
		"path": "../public/assets/ConfirmDialog-C-afro7F.js"
	},
	"/assets/createLucideIcon-GbkIog0d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab-bE0625NoUfmUOMhS6HSRsuzW/PE\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 1195,
		"path": "../public/assets/createLucideIcon-GbkIog0d.js"
	},
	"/assets/CustomersScreen-Bd4FXAnn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f7-G60sWR4hZUFQbOIHzP0LOstpi7w\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 8695,
		"path": "../public/assets/CustomersScreen-Bd4FXAnn.js"
	},
	"/assets/DashboardScreen-D4-kP3OZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c269-HWlCxw1aP7O1rF1sRGJPGClHg+A\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 49769,
		"path": "../public/assets/DashboardScreen-D4-kP3OZ.js"
	},
	"/assets/DataTable-SKLcykx5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21b5-JlksrDN88biubBbqOv2XYoApQpc\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 8629,
		"path": "../public/assets/DataTable-SKLcykx5.js"
	},
	"/assets/dist-Dc4n_JS1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91c1-WmU6att4Xi+jg5CTa6BMxze1y5A\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 37313,
		"path": "../public/assets/dist-Dc4n_JS1.js"
	},
	"/assets/download-NrqcxJqw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-sAHtVaXhg4HITLPodkglPIhc354\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 232,
		"path": "../public/assets/download-NrqcxJqw.js"
	},
	"/assets/file-check-BXvwo3cH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-dKZxSGE8T5nvH7gkBPqw1B6LhM8\"",
		"mtime": "2026-10-13T06:56:38.980Z",
		"size": 318,
		"path": "../public/assets/file-check-BXvwo3cH.js"
	},
	"/assets/eye-off-DnFEQm3-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-sogIRH8tcppCYgnlH3t0CpJwXd8\"",
		"mtime": "2026-10-13T06:56:38.978Z",
		"size": 430,
		"path": "../public/assets/eye-off-DnFEQm3-.js"
	},
	"/assets/eye-TENnIjOD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-sXvkYd+iPeqfPUNDsT4HGGwb004\"",
		"mtime": "2026-10-13T06:56:38.978Z",
		"size": 256,
		"path": "../public/assets/eye-TENnIjOD.js"
	},
	"/assets/FitmentScreen-LtnpA99n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8a-JGrhFLzlZQRVEdrI8xGgNQ8l1Rs\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 6794,
		"path": "../public/assets/FitmentScreen-LtnpA99n.js"
	},
	"/assets/flag-DiS3nXzh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe-dybqyLBqse42OCIvrHqyjuElqr0\"",
		"mtime": "2026-10-13T06:56:38.980Z",
		"size": 254,
		"path": "../public/assets/flag-DiS3nXzh.js"
	},
	"/assets/GlassButton-X_sqI-GK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6af-pjTLtbRmxDhnJQQvNYv1JW23AI4\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 1711,
		"path": "../public/assets/GlassButton-X_sqI-GK.js"
	},
	"/assets/GlassCard-D3vJQvIG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49f-cuEsUyhh5/FJEp1FMT0ob4qgy5M\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 1183,
		"path": "../public/assets/GlassCard-D3vJQvIG.js"
	},
	"/assets/garage-DnLJJDd_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a2-aNU5LxafKrt41rAc/7RLGSaxvFs\"",
		"mtime": "2026-10-13T06:56:38.980Z",
		"size": 4770,
		"path": "../public/assets/garage-DnLJJDd_.js"
	},
	"/assets/GlassModal-DPdYEtRg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f9-8XCOPiClromj2O83e9K0+6JgwKc\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 1785,
		"path": "../public/assets/GlassModal-DPdYEtRg.js"
	},
	"/assets/GlassDrawer-BON4v8ih.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ea-X+dziYtGUplYQfbWShQ8UfR36ew\"",
		"mtime": "2026-10-13T06:56:38.931Z",
		"size": 1770,
		"path": "../public/assets/GlassDrawer-BON4v8ih.js"
	},
	"/assets/GlassInput-Be15N6uF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4da-Q8AdgNbkwK5g7j1bbFSsCbcp7mo\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 1242,
		"path": "../public/assets/GlassInput-Be15N6uF.js"
	},
	"/assets/generateCategoricalChart-BnjzgZGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58d92-ze2/F0d45XYZHQzWLDJsVs2q4Ns\"",
		"mtime": "2026-10-13T06:56:38.980Z",
		"size": 363922,
		"path": "../public/assets/generateCategoricalChart-BnjzgZGf.js"
	},
	"/assets/ev-login-showcase-nZh_Lq1H.jpg": {
		"type": "image/jpeg",
		"etag": "\"b272a-Y/uO9CgSJ1uAZBm3HryjPs7qswU\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 730922,
		"path": "../public/assets/ev-login-showcase-nZh_Lq1H.jpg"
	},
	"/assets/dashboard.customer-Cx6LAcPE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0886-OYQkDoRhO4D4gAwb0bZCsgGL8M8\"",
		"mtime": "2026-10-13T06:56:38.965Z",
		"size": 788614,
		"path": "../public/assets/dashboard.customer-Cx6LAcPE.js"
	},
	"/assets/GlassSelect-DWWTznM5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-z4UykyZ9RJc+Gt4IzocD8qI3DDc\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 1249,
		"path": "../public/assets/GlassSelect-DWWTznM5.js"
	},
	"/assets/headphones-Cwy0Boi5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed-oUwR4P/B4+gkz4P6c7qtN6mqIjE\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 237,
		"path": "../public/assets/headphones-Cwy0Boi5.js"
	},
	"/assets/jsx-runtime-D3jfb0Ew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22c5-Qh7NbnnF5pPMnr2eoPNshytf37o\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 8901,
		"path": "../public/assets/jsx-runtime-D3jfb0Ew.js"
	},
	"/assets/key-round-DQT4Zn0H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"163-iL3Zgri1Dw+cn+ba/nury5NQrGU\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 355,
		"path": "../public/assets/key-round-DQT4Zn0H.js"
	},
	"/assets/image-B3pNzbko.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-AcykRjgd8OtI0WkaKxe4FZCCC7I\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 269,
		"path": "../public/assets/image-B3pNzbko.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/layout-grid-CzHDZ-bg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15a-thN1EYUSFRj0u5Crdf8DLXlcdAk\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 346,
		"path": "../public/assets/layout-grid-CzHDZ-bg.js"
	},
	"/assets/link-Cqw0SZOf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c2a-asAmG8MrxyYTGUXjPVvQ9xoEFbE\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 11306,
		"path": "../public/assets/link-Cqw0SZOf.js"
	},
	"/assets/index-CDN663Xf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f102-UnUCP048uUQV8bov/bQXh/+3pTQ\"",
		"mtime": "2026-10-13T06:56:38.921Z",
		"size": 520450,
		"path": "../public/assets/index-CDN663Xf.js"
	},
	"/assets/lock-DCqpUZJL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-xvHgpSujGWONPJvypndV6j0Nkso\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 206,
		"path": "../public/assets/lock-DCqpUZJL.js"
	},
	"/assets/loader-circle-Ck2ScGJP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-sdGFsXF6ZEi2yWiedQkoa5MTHWc\"",
		"mtime": "2026-10-13T06:56:38.984Z",
		"size": 144,
		"path": "../public/assets/loader-circle-Ck2ScGJP.js"
	},
	"/assets/log-out-2pNj3F3t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-lR/ZFDEPmawOKHfSv/hhxLMgIHI\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 230,
		"path": "../public/assets/log-out-2pNj3F3t.js"
	},
	"/assets/LiveMap-CpiZDWwT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac8-M8hyGbJgSpviJLs2Ka9BYkQbVAs\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 2760,
		"path": "../public/assets/LiveMap-CpiZDWwT.js"
	},
	"/assets/login-BhUipm3K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"371b-3BICcOiLLfMW9KrdhMHSuH4U5WI\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 14107,
		"path": "../public/assets/login-BhUipm3K.js"
	},
	"/assets/mail-B3ecmZxY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-2X5CnuswS/la/WNiF3BXzxaQQx8\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 213,
		"path": "../public/assets/mail-B3ecmZxY.js"
	},
	"/assets/message-square-Ovxawd2M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-eWCppCXahXqr60ElI+e/0BFJEsE\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 233,
		"path": "../public/assets/message-square-Ovxawd2M.js"
	},
	"/assets/menu-DUA9vcl_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd-d0qatkeRa0PTZLW1ivFK/rbzA1c\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 189,
		"path": "../public/assets/menu-DUA9vcl_.js"
	},
	"/assets/mic-C8Lw6CHI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-oJdubWUFOT2zwDA2RqjaGa5kxJU\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 235,
		"path": "../public/assets/mic-C8Lw6CHI.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/MeshBackground-DiQjrKfP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73e-cyap2AYgzTUEoUeUkpmrpxnRkGE\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 1854,
		"path": "../public/assets/MeshBackground-DiQjrKfP.js"
	},
	"/assets/map-pin-DxXv5Z8Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-sIlXujEGjWsZqvhuZ26jBk0R3vU\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 259,
		"path": "../public/assets/map-pin-DxXv5Z8Q.js"
	},
	"/assets/offers-CJPUI00A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e5-QzK9u0Y5u4oHY5l/e4cyBrrG38w\"",
		"mtime": "2026-10-13T06:56:38.989Z",
		"size": 5349,
		"path": "../public/assets/offers-CJPUI00A.js"
	},
	"/assets/NotificationsScreen-DHg8JQc0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18b8-To0JAdrnZZrDIrfvxLgcHKmcSR8\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 6328,
		"path": "../public/assets/NotificationsScreen-DHg8JQc0.js"
	},
	"/assets/OffersScreen-P6F_ceIf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fa-MeeK2MAGWHxSCGEh+lyRNv1YBG0\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 9210,
		"path": "../public/assets/OffersScreen-P6F_ceIf.js"
	},
	"/assets/orders-DIu_RAPD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b5-o43DU/WAtc+C35/MeChG/NWyaCg\"",
		"mtime": "2026-10-13T06:56:38.994Z",
		"size": 1973,
		"path": "../public/assets/orders-DIu_RAPD.js"
	},
	"/assets/PaymentsScreen-CFBtVk_D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1839-n353d5yx8SmHOcW7SYznlhiEXrU\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 6201,
		"path": "../public/assets/PaymentsScreen-CFBtVk_D.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/pen-line-CVqjvcvV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115-ocV+2WrALFcbrAkggTAd+lo/xtQ\"",
		"mtime": "2026-10-13T06:56:38.994Z",
		"size": 277,
		"path": "../public/assets/pen-line-CVqjvcvV.js"
	},
	"/assets/phone-CBVm8lDH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-fsbp4iI28ZPt2U97GdKQt4iRi/A\"",
		"mtime": "2026-10-13T06:56:38.997Z",
		"size": 322,
		"path": "../public/assets/phone-CBVm8lDH.js"
	},
	"/assets/OrdersScreen-B83fPco4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3624-4QSoeCCLjRfwjGKdzb9I3vl6ttU\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 13860,
		"path": "../public/assets/OrdersScreen-B83fPco4.js"
	},
	"/assets/product._id-2fgG85iC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e7-7k3rDx7Mnqflj67aiIKZZedX1fA\"",
		"mtime": "2026-10-13T06:56:38.997Z",
		"size": 5351,
		"path": "../public/assets/product._id-2fgG85iC.js"
	},
	"/assets/ProductApprovalsScreen-DhQN3NcW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7354-ear6ZR0bt0pwLZatkYDFtIIiAw0\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 29524,
		"path": "../public/assets/ProductApprovalsScreen-DhQN3NcW.js"
	},
	"/assets/percent-_tREKk22.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-RhBdDqB+yYMZ6iRCYLHAxVfKBSE\"",
		"mtime": "2026-10-13T06:56:38.997Z",
		"size": 242,
		"path": "../public/assets/percent-_tREKk22.js"
	},
	"/assets/pen-OHS_AcDC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-0YdMvRyNYxEV25g/qR7FFvPD724\"",
		"mtime": "2026-10-13T06:56:38.994Z",
		"size": 235,
		"path": "../public/assets/pen-OHS_AcDC.js"
	},
	"/assets/ProtectedRoute-BtDusQHF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e1-4SDAOyBD9zRu9RoePdYvDGaSHwY\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 993,
		"path": "../public/assets/ProtectedRoute-BtDusQHF.js"
	},
	"/assets/proxy-Cw7EYqOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de86-dnlMnZvmIOjnly8QmnFSNxjv7fc\"",
		"mtime": "2026-10-13T06:56:38.997Z",
		"size": 122502,
		"path": "../public/assets/proxy-Cw7EYqOo.js"
	},
	"/assets/RidersScreen-DCIPOSBv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e7-w308HvanKE21oUa5JaEF4O03oTI\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 9191,
		"path": "../public/assets/RidersScreen-DCIPOSBv.js"
	},
	"/assets/riderzpro-logo-CWZDaQYu.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 190454,
		"path": "../public/assets/riderzpro-logo-CWZDaQYu.png"
	},
	"/assets/save-D_UJP6q2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-sIXveLt/zlIstbDwR1bLvZgIfQI\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 327,
		"path": "../public/assets/save-D_UJP6q2.js"
	},
	"/assets/scan-line-Ct2Pxuj2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14b-CcNd3G8UmYZn2MtrQtkuHnQi5Is\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 331,
		"path": "../public/assets/scan-line-Ct2Pxuj2.js"
	},
	"/assets/ReviewsScreen-DLqlrqlh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e88-GY6dkqtDXHqHZbO7lzzdPEMy5As\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 3720,
		"path": "../public/assets/ReviewsScreen-DLqlrqlh.js"
	},
	"/assets/routes-gmmiQvCj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"519c-nGqg0TGoKozeqTMkT6o4VxD3jIM\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 20892,
		"path": "../public/assets/routes-gmmiQvCj.js"
	},
	"/assets/ProductsScreen-BFqqOU9N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"262f-lwH8hSDl1KTUYNbBCA28xNdKRjY\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 9775,
		"path": "../public/assets/ProductsScreen-BFqqOU9N.js"
	},
	"/assets/rider-CxFpmyvi.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a6e1-TzcSK9202J+eYGEGQBjAJsGuB9k\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 173793,
		"path": "../public/assets/rider-CxFpmyvi.jpg"
	},
	"/assets/SellersScreen-LfWl5wks.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59ae-416N6JqXf6cM88xuAoJoj3RxKvY\"",
		"mtime": "2026-10-13T06:56:38.937Z",
		"size": 22958,
		"path": "../public/assets/SellersScreen-LfWl5wks.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/send-Chj7lHyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-trSJyhyIveEMc8LYXvsRp32YEy4\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 290,
		"path": "../public/assets/send-Chj7lHyJ.js"
	},
	"/assets/seedData-BdjERrrj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48b9-pPYpUxgsxqQiR6lXu64pimhTB48\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 18617,
		"path": "../public/assets/seedData-BdjERrrj.js"
	},
	"/assets/settings-B4uxjljw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e7-8XKuHN3c3kWPcRp2E8HNSZ5qJSI\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 487,
		"path": "../public/assets/settings-B4uxjljw.js"
	},
	"/assets/SettingsScreen-DX4aO-ZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4406-Lq+BAKjIT1udgCklzRZdQ2pCQK0\"",
		"mtime": "2026-10-13T06:56:38.947Z",
		"size": 17414,
		"path": "../public/assets/SettingsScreen-DX4aO-ZW.js"
	},
	"/assets/shield-BdD636bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"110-Vh2aJWwt8QTPz6AntmodtuczZwc\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 272,
		"path": "../public/assets/shield-BdD636bX.js"
	},
	"/assets/shield-alert-BucUbQ0D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"161-TvRhHWLfvFhywTKY/gJp982+JT8\"",
		"mtime": "2026-10-13T06:56:38.999Z",
		"size": 353,
		"path": "../public/assets/shield-alert-BucUbQ0D.js"
	},
	"/assets/shield-check-uWDGVtnq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-7GZONstXYhkot8gSDrPIjAYP48M\"",
		"mtime": "2026-10-13T06:56:39.004Z",
		"size": 320,
		"path": "../public/assets/shield-check-uWDGVtnq.js"
	},
	"/assets/shop-COTH1XsS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a43-mZJ9C+JlNrUhd9aZP00J2EB7BWU\"",
		"mtime": "2026-10-13T06:56:39.004Z",
		"size": 6723,
		"path": "../public/assets/shop-COTH1XsS.js"
	},
	"/assets/signup-CuoAUXll.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"105-IbPyAkjmgC0zRJudEZdiVxAAMhI\"",
		"mtime": "2026-10-13T06:56:39.004Z",
		"size": 261,
		"path": "../public/assets/signup-CuoAUXll.js"
	},
	"/assets/SiteLayout-CFcLakKm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c825-vn8tjJ3g1fnHjQBJrexAaVJG+mY\"",
		"mtime": "2026-10-13T06:56:38.947Z",
		"size": 116773,
		"path": "../public/assets/SiteLayout-CFcLakKm.js"
	},
	"/assets/sliders-horizontal-DmRN6ZTZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-/1TmObC4D51pUtnY53vsjN39dFY\"",
		"mtime": "2026-10-13T06:56:39.004Z",
		"size": 424,
		"path": "../public/assets/sliders-horizontal-DmRN6ZTZ.js"
	},
	"/assets/shopping-bag-DjRy7kDM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"238-rnezyc2o9X2LknXkChiv0In9cuA\"",
		"mtime": "2026-10-13T06:56:39.004Z",
		"size": 568,
		"path": "../public/assets/shopping-bag-DjRy7kDM.js"
	},
	"/assets/Skeleton-CFFX9D-y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-A+NnSkv+vmc+8BLQ7iEJ2K9FRek\"",
		"mtime": "2026-10-13T06:56:38.947Z",
		"size": 291,
		"path": "../public/assets/Skeleton-CFFX9D-y.js"
	},
	"/assets/sparkles-BNBj2awz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-uGtTMOD3uwxC+E98+h6G/JFI9o0\"",
		"mtime": "2026-10-13T06:56:39.008Z",
		"size": 494,
		"path": "../public/assets/sparkles-BNBj2awz.js"
	},
	"/assets/store._slug-EI7oq3ND.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183f-bODiZATXTcx6Ucnz9+gFwNRykgs\"",
		"mtime": "2026-10-13T06:56:39.010Z",
		"size": 6207,
		"path": "../public/assets/store._slug-EI7oq3ND.js"
	},
	"/assets/square-DIk8-68s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-EBtfI/E0uF1ozZpP/OnL0rOwXMI\"",
		"mtime": "2026-10-13T06:56:39.008Z",
		"size": 147,
		"path": "../public/assets/square-DIk8-68s.js"
	},
	"/assets/store-CquHo9lk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f2-xn1HsURQuSmnbXp7CUk7kuYPOyU\"",
		"mtime": "2026-10-13T06:56:39.008Z",
		"size": 498,
		"path": "../public/assets/store-CquHo9lk.js"
	},
	"/assets/track._id-DoZuwMNA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130d-NhEE8aFVq0NuAF6LBUXdF9EDbcw\"",
		"mtime": "2026-10-13T06:56:39.010Z",
		"size": 4877,
		"path": "../public/assets/track._id-DoZuwMNA.js"
	},
	"/assets/TeamScreen-DKBpJA4Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fc-1rxKA+T2hfbk9eRu5rw7V8C4mhY\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 9212,
		"path": "../public/assets/TeamScreen-DKBpJA4Q.js"
	},
	"/assets/useMatch-2Khnpv0R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24b-eU+tni+VH/Saq/v27Wk5vJaGhIA\"",
		"mtime": "2026-10-13T06:56:39.013Z",
		"size": 587,
		"path": "../public/assets/useMatch-2Khnpv0R.js"
	},
	"/assets/StatusBadge-BIqDkTzn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ff-GXZkXEcn6oXqBA7CQU7ME0FgbLo\"",
		"mtime": "2026-10-13T06:56:38.947Z",
		"size": 1279,
		"path": "../public/assets/StatusBadge-BIqDkTzn.js"
	},
	"/assets/upload--b5nanI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-hhxsl1PlPiqzFZOQcu5UU1ioy7Q\"",
		"mtime": "2026-10-13T06:56:39.010Z",
		"size": 230,
		"path": "../public/assets/upload--b5nanI5.js"
	},
	"/assets/trash-2-Cm6tgp9z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-kkdYxImvW5H1opLcwfRwYyram0w\"",
		"mtime": "2026-10-13T06:56:39.010Z",
		"size": 328,
		"path": "../public/assets/trash-2-Cm6tgp9z.js"
	},
	"/assets/SupportScreen-CuRIxeio.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1801-kCP8/L7tBbbrn52Gp/+TdqZ+StM\"",
		"mtime": "2026-10-13T06:56:38.947Z",
		"size": 6145,
		"path": "../public/assets/SupportScreen-CuRIxeio.js"
	},
	"/assets/user-CQYrussp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-9x6D9f8roLL24/SgbNK38+ulQ+o\"",
		"mtime": "2026-10-13T06:56:39.013Z",
		"size": 196,
		"path": "../public/assets/user-CQYrussp.js"
	},
	"/assets/styles-BUOP1Eto.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"2edfb-44EITxEt3PWCGZFQjGBqla1HwKI\"",
		"mtime": "2026-10-13T06:56:39.020Z",
		"size": 191995,
		"path": "../public/assets/styles-BUOP1Eto.css"
	},
	"/assets/validators-zNdq-4Lf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f39e-fjJxtwpTpj5w/JdivcWSIL43bEc\"",
		"mtime": "2026-10-13T06:56:39.013Z",
		"size": 62366,
		"path": "../public/assets/validators-zNdq-4Lf.js"
	},
	"/assets/vendor.auth-CkLZ8znQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"596c-2oA+8R8WSLzo8DLUKQFypgTGRac\"",
		"mtime": "2026-10-13T06:56:39.013Z",
		"size": 22892,
		"path": "../public/assets/vendor.auth-CkLZ8znQ.js"
	},
	"/assets/vendor.dashboard-CUPj9PlV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25a3e-wdwI1a5v55RXHfrw4619vb7O6Wk\"",
		"mtime": "2026-10-13T06:56:39.013Z",
		"size": 154174,
		"path": "../public/assets/vendor.dashboard-CUPj9PlV.js"
	},
	"/assets/vendor.onboarding-D2Yut3Xp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a36-nrLinLxvsHug8v4e1FWRb6cFo0o\"",
		"mtime": "2026-10-13T06:56:39.017Z",
		"size": 105014,
		"path": "../public/assets/vendor.onboarding-D2Yut3Xp.js"
	},
	"/assets/wrench-D7JXycsl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-aCmgHotL4tOgZmPKnGDt3lQk9lU\"",
		"mtime": "2026-10-13T06:56:39.017Z",
		"size": 303,
		"path": "../public/assets/wrench-D7JXycsl.js"
	},
	"/assets/WarrantyScreen-TJ7Jd6Ig.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123c-hk4mDC7ciTAe7t9AeWgs2vitSKk\"",
		"mtime": "2026-10-13T06:56:38.951Z",
		"size": 4668,
		"path": "../public/assets/WarrantyScreen-TJ7Jd6Ig.js"
	},
	"/assets/vendor.pending-i6uAxYz0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c5-bgi6aMO+SLaeAImEZ5LLqFu6z74\"",
		"mtime": "2026-10-13T06:56:39.017Z",
		"size": 9925,
		"path": "../public/assets/vendor.pending-i6uAxYz0.js"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-13T05:34:08.254Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-13T05:34:08.238Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-13T05:34:08.254Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-13T05:34:08.255Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-13T05:34:08.272Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-13T05:34:08.270Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-13T05:34:08.272Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-13T05:34:08.272Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:34:08.288Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-13T05:34:08.293Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:34:08.312Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-13T05:34:08.272Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-13T05:34:08.338Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:34:08.318Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:34:08.335Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:34:08.328Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0350/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:34:08.305Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_ihtLgd = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_ihtLgd
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
