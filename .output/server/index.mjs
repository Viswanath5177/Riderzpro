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
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"d2-0pJxbgLG+EDoUWmTwFAZCX6mvLc\"",
		"mtime": "2026-10-13T05:46:46.307Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-13T05:46:46.303Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-13T05:46:46.309Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-13T05:46:46.311Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:46:46.306Z",
		"size": 190454,
		"path": "../public/logo.png"
	},
	"/assets/admin.ai-assistant-BIYy4Nhx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36f-q3albRd3NoAJnDvEze4eenJPi30\"",
		"mtime": "2026-10-13T11:22:41.252Z",
		"size": 879,
		"path": "../public/assets/admin.ai-assistant-BIYy4Nhx.js"
	},
	"/assets/admin.approvals-CetkSXx1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ca-QgQSnFn8moapkwhE/9hnTQXOJ3U\"",
		"mtime": "2026-10-13T11:22:41.620Z",
		"size": 1482,
		"path": "../public/assets/admin.approvals-CetkSXx1.js"
	},
	"/assets/admin-DipOHlKK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cbb-q9McuwR1+SdptKNN0F2Lbd1smAo\"",
		"mtime": "2026-10-13T11:22:41.249Z",
		"size": 23739,
		"path": "../public/assets/admin-DipOHlKK.js"
	},
	"/assets/admin.fitment-aObWzRCa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35b-UVIJsER/o2VrmVR7ZVjEUD6GZ6M\"",
		"mtime": "2026-10-13T11:22:41.620Z",
		"size": 859,
		"path": "../public/assets/admin.fitment-aObWzRCa.js"
	},
	"/assets/admin.customers-C0MNMqaa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56f-I8y4hwf3VJV2sA0lIxQjWfPHiYQ\"",
		"mtime": "2026-10-13T11:22:41.620Z",
		"size": 1391,
		"path": "../public/assets/admin.customers-C0MNMqaa.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-13T05:46:46.316Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/admin.index-C9Ib2bgp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da-xOhZDbzwqYjewf8jR7My/08vwco\"",
		"mtime": "2026-10-13T11:22:42.296Z",
		"size": 1498,
		"path": "../public/assets/admin.index-C9Ib2bgp.js"
	},
	"/assets/admin.notifications-DAL5Pit4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4cd-f6LOsymaHr/OQweRbGj1fbja10A\"",
		"mtime": "2026-10-13T11:22:42.300Z",
		"size": 1229,
		"path": "../public/assets/admin.notifications-DAL5Pit4.js"
	},
	"/assets/admin.orders-BkxgG75a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"568-A1QNuk2+yAxC68EIVvuLSrz+vAs\"",
		"mtime": "2026-10-13T11:22:42.301Z",
		"size": 1384,
		"path": "../public/assets/admin.orders-BkxgG75a.js"
	},
	"/assets/admin.login-CY13eM5s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2788-w3uzCv2yJesa0wapp+Q8lOpVfw0\"",
		"mtime": "2026-10-13T11:22:42.296Z",
		"size": 10120,
		"path": "../public/assets/admin.login-CY13eM5s.js"
	},
	"/assets/admin.analytics-D6u-5L-8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-0caxz4Y27GyKBKexpNFjqOBh80s\"",
		"mtime": "2026-10-13T11:22:41.255Z",
		"size": 850,
		"path": "../public/assets/admin.analytics-D6u-5L-8.js"
	},
	"/assets/admin.offers-Bk-0eClq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54a-Uv2tkV2VwJKiIptscQAuHlPITEo\"",
		"mtime": "2026-10-13T11:22:42.301Z",
		"size": 1354,
		"path": "../public/assets/admin.offers-Bk-0eClq.js"
	},
	"/assets/admin.payments-BtGFcDaP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"50a-fLCcIeL7NPDbNNhVYp8IXwlHcrM\"",
		"mtime": "2026-10-13T11:22:42.303Z",
		"size": 1290,
		"path": "../public/assets/admin.payments-BtGFcDaP.js"
	},
	"/assets/admin.products-D0whVsqu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"574-BHvwJmjgiEFKvDD7ZY0e4rkx8ug\"",
		"mtime": "2026-10-13T11:22:42.365Z",
		"size": 1396,
		"path": "../public/assets/admin.products-D0whVsqu.js"
	},
	"/assets/admin.riders-B5jM_8dJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"521-Rpekij3KNJSHR1tvyp2oWdkMNT4\"",
		"mtime": "2026-10-13T11:22:42.387Z",
		"size": 1313,
		"path": "../public/assets/admin.riders-B5jM_8dJ.js"
	},
	"/assets/admin.reviews-BmOAHzSs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d-G3DeGkMKUTYmaoLdWETFqXCcNwU\"",
		"mtime": "2026-10-13T11:22:42.367Z",
		"size": 1069,
		"path": "../public/assets/admin.reviews-BmOAHzSs.js"
	},
	"/assets/admin.support-CnsSUq79.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c1-8n2hiLdJieTQPKlA3Wlyw7kKYDI\"",
		"mtime": "2026-10-13T11:22:42.473Z",
		"size": 1217,
		"path": "../public/assets/admin.support-CnsSUq79.js"
	},
	"/assets/admin.settings-CCYe8DrS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b4-QOE3y1eBsJmmonE/ai4/c54+weY\"",
		"mtime": "2026-10-13T11:22:42.403Z",
		"size": 1204,
		"path": "../public/assets/admin.settings-CCYe8DrS.js"
	},
	"/assets/admin.sellers-ltXnWzK-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b2-wQZVxOBY+ErZhAWfR2CnEQLEpbQ\"",
		"mtime": "2026-10-13T11:22:42.398Z",
		"size": 1458,
		"path": "../public/assets/admin.sellers-ltXnWzK-.js"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:46:46.311Z",
		"size": 190454,
		"path": "../public/riderzpro-logo.png"
	},
	"/assets/AdminDevBypass-vCI3VFcS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f4-gAcv+TpQfYlG35oL5txIqhtwF60\"",
		"mtime": "2026-10-13T11:22:40.741Z",
		"size": 500,
		"path": "../public/assets/AdminDevBypass-vCI3VFcS.js"
	},
	"/assets/admin.warranty-DO0YPy9C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a7-/kQvcyvIJbXZPdcoUw5TlXuU1/A\"",
		"mtime": "2026-10-13T11:22:44.209Z",
		"size": 1191,
		"path": "../public/assets/admin.warranty-DO0YPy9C.js"
	},
	"/assets/admin.team-C-WrmHI7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"548-+Jx+BPmUZH2827pepMcCtNxLe2g\"",
		"mtime": "2026-10-13T11:22:42.964Z",
		"size": 1352,
		"path": "../public/assets/admin.team-C-WrmHI7.js"
	},
	"/assets/AnalyticsScreen-CrCrkik4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"485f-+SPJB+YTjUi8oq/+CtazI+QDjgs\"",
		"mtime": "2026-10-13T11:22:40.745Z",
		"size": 18527,
		"path": "../public/assets/AnalyticsScreen-CrCrkik4.js"
	},
	"/assets/adminStore-DREEtfbQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e777-6U1Kz6bhUMAT2RJEVISprPeibx4\"",
		"mtime": "2026-10-13T11:22:44.702Z",
		"size": 59255,
		"path": "../public/assets/adminStore-DREEtfbQ.js"
	},
	"/assets/AiAssistantScreen-CJ9lQPkA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d58-ickKPnkmE64FUxDiSGyro+ruaTs\"",
		"mtime": "2026-10-13T11:22:40.744Z",
		"size": 7512,
		"path": "../public/assets/AiAssistantScreen-CJ9lQPkA.js"
	},
	"/assets/arrow-left-hNlAnx9b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-ZyT0jPBNcXS+OgAyEBMBBXcK70k\"",
		"mtime": "2026-10-13T11:22:44.703Z",
		"size": 165,
		"path": "../public/assets/arrow-left-hNlAnx9b.js"
	},
	"/assets/arrow-right-Do1YRq-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-MG5M3ZeCIHQIg1nOyWoIY5g1a7Y\"",
		"mtime": "2026-10-13T11:22:44.704Z",
		"size": 165,
		"path": "../public/assets/arrow-right-Do1YRq-l.js"
	},
	"/assets/auth-BE6ks9qw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-ou8hIdgVFYiHl5nKThUWZnMqNrQ\"",
		"mtime": "2026-10-13T11:22:44.739Z",
		"size": 269,
		"path": "../public/assets/auth-BE6ks9qw.js"
	},
	"/assets/AnimatePresence-DOBXEDKg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1089-9ZeaJUPXic9Oc0G9fdYHlVcPexs\"",
		"mtime": "2026-10-13T11:22:40.747Z",
		"size": 4233,
		"path": "../public/assets/AnimatePresence-DOBXEDKg.js"
	},
	"/assets/ban-BfmLDQsn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-7Wa/mGqPPXqgSJc9kiPafvZhkd0\"",
		"mtime": "2026-10-13T11:22:44.740Z",
		"size": 181,
		"path": "../public/assets/ban-BfmLDQsn.js"
	},
	"/assets/assistant-CHJ00VpH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147c-W94FZQxaYL6+cq70jXW2sw+G8/E\"",
		"mtime": "2026-10-13T11:22:44.736Z",
		"size": 5244,
		"path": "../public/assets/assistant-CHJ00VpH.js"
	},
	"/assets/battery-DxtljaS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0-zXMxADODh4bZ/0fvfurNliKTsOk\"",
		"mtime": "2026-10-13T11:22:44.740Z",
		"size": 192,
		"path": "../public/assets/battery-DxtljaS-.js"
	},
	"/assets/bike-CKDoK2gI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-XoTlQRMv1QGXw1kZs4yQFjIGqeQ\"",
		"mtime": "2026-10-13T11:22:44.742Z",
		"size": 288,
		"path": "../public/assets/bike-CKDoK2gI.js"
	},
	"/assets/AreaChart-BpFiA2Ka.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4465-vW4VKvY9MWUX0xvUVFfusS2aWQI\"",
		"mtime": "2026-10-13T11:22:40.747Z",
		"size": 17509,
		"path": "../public/assets/AreaChart-BpFiA2Ka.js"
	},
	"/assets/building-BAq3JF8S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"233-Gt/+lfCWIFxcrN+BFx+BW7uZ3MQ\"",
		"mtime": "2026-10-13T11:22:44.744Z",
		"size": 563,
		"path": "../public/assets/building-BAq3JF8S.js"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-13T11:22:45.568Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-13T11:22:46.917Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-13T11:22:46.915Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/check-D5PIylc8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-uJ2Ivy+wmexk4Na2norU3xh+2cM\"",
		"mtime": "2026-10-13T11:22:44.749Z",
		"size": 124,
		"path": "../public/assets/check-D5PIylc8.js"
	},
	"/assets/chevron-down-CZjeXQdU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"80-XCXba4/HZOV6r/hiyw5ygkJ3Izs\"",
		"mtime": "2026-10-13T11:22:44.749Z",
		"size": 128,
		"path": "../public/assets/chevron-down-CZjeXQdU.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-13T11:22:46.931Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/cart-D8kIIZSR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4692-6+2v1xNvNalVkv6TdsTIGZZ11SU\"",
		"mtime": "2026-10-13T11:22:44.747Z",
		"size": 18066,
		"path": "../public/assets/cart-D8kIIZSR.js"
	},
	"/assets/AuthPage-Da0R49S2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c16-suFNDWvYU3l7Kax0FmTWDwXtXpY\"",
		"mtime": "2026-10-13T11:22:40.749Z",
		"size": 23574,
		"path": "../public/assets/AuthPage-Da0R49S2.js"
	},
	"/assets/chevron-right-Cn2uMVoe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-7efaqzS43fErngDiSn7T2ryY4BE\"",
		"mtime": "2026-10-13T11:22:44.771Z",
		"size": 130,
		"path": "../public/assets/chevron-right-Cn2uMVoe.js"
	},
	"/assets/circle-alert-Cefc45Zt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-GHDo7/jCmhVC5ajBHjWBn0BqdYk\"",
		"mtime": "2026-10-13T11:22:44.773Z",
		"size": 250,
		"path": "../public/assets/circle-alert-Cefc45Zt.js"
	},
	"/assets/chevron-left-DmTDziyb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-UHU04BmBy5cnfocsG6QiVpkmrr4\"",
		"mtime": "2026-10-13T11:22:44.770Z",
		"size": 130,
		"path": "../public/assets/chevron-left-DmTDziyb.js"
	},
	"/assets/circle-C6563C5v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-ulktNrhofJMvUKKOv4sJ0vah1v0\"",
		"mtime": "2026-10-13T11:22:44.773Z",
		"size": 130,
		"path": "../public/assets/circle-C6563C5v.js"
	},
	"/assets/ConfirmDialog-P9D0Yelu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"438-ArgtWrPFI8zaT/OyrxS20jGYXE4\"",
		"mtime": "2026-10-13T11:22:40.750Z",
		"size": 1080,
		"path": "../public/assets/ConfirmDialog-P9D0Yelu.js"
	},
	"/assets/copy-BywfabTK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-W7Py1a1ZK7Zc+IZBAyp1tfHCmms\"",
		"mtime": "2026-10-13T11:22:44.775Z",
		"size": 236,
		"path": "../public/assets/copy-BywfabTK.js"
	},
	"/assets/createLucideIcon-GbkIog0d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab-bE0625NoUfmUOMhS6HSRsuzW/PE\"",
		"mtime": "2026-10-13T11:22:44.781Z",
		"size": 1195,
		"path": "../public/assets/createLucideIcon-GbkIog0d.js"
	},
	"/assets/CustomersScreen-DXMMRP7B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f7-CuThEOQg7ZGMiI3/1biDnFlruKY\"",
		"mtime": "2026-10-13T11:22:40.750Z",
		"size": 8695,
		"path": "../public/assets/CustomersScreen-DXMMRP7B.js"
	},
	"/assets/DashboardScreen-CrM2ega7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c269-z1T0DvjSSiBQzuCtJj4oAaCDly4\"",
		"mtime": "2026-10-13T11:22:40.750Z",
		"size": 49769,
		"path": "../public/assets/DashboardScreen-CrM2ega7.js"
	},
	"/assets/DataTable-C9lvhbga.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2311-6OOzD2xLxXejG7K7OcC9jQTeJ2s\"",
		"mtime": "2026-10-13T11:22:40.752Z",
		"size": 8977,
		"path": "../public/assets/DataTable-C9lvhbga.js"
	},
	"/assets/download-NrqcxJqw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-sAHtVaXhg4HITLPodkglPIhc354\"",
		"mtime": "2026-10-13T11:22:44.785Z",
		"size": 232,
		"path": "../public/assets/download-NrqcxJqw.js"
	},
	"/assets/dist-Dc4n_JS1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91c1-WmU6att4Xi+jg5CTa6BMxze1y5A\"",
		"mtime": "2026-10-13T11:22:44.783Z",
		"size": 37313,
		"path": "../public/assets/dist-Dc4n_JS1.js"
	},
	"/assets/eye-off-DnFEQm3-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-sogIRH8tcppCYgnlH3t0CpJwXd8\"",
		"mtime": "2026-10-13T11:22:44.786Z",
		"size": 430,
		"path": "../public/assets/eye-off-DnFEQm3-.js"
	},
	"/assets/eye-TENnIjOD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-sXvkYd+iPeqfPUNDsT4HGGwb004\"",
		"mtime": "2026-10-13T11:22:44.786Z",
		"size": 256,
		"path": "../public/assets/eye-TENnIjOD.js"
	},
	"/assets/file-check-BXvwo3cH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-dKZxSGE8T5nvH7gkBPqw1B6LhM8\"",
		"mtime": "2026-10-13T11:22:44.787Z",
		"size": 318,
		"path": "../public/assets/file-check-BXvwo3cH.js"
	},
	"/assets/FitmentScreen-BH-wAw30.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8a-ehm3qVRUZO84wBDBkbjTVe4TgkY\"",
		"mtime": "2026-10-13T11:22:40.752Z",
		"size": 6794,
		"path": "../public/assets/FitmentScreen-BH-wAw30.js"
	},
	"/assets/flag-DiS3nXzh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe-dybqyLBqse42OCIvrHqyjuElqr0\"",
		"mtime": "2026-10-13T11:22:44.788Z",
		"size": 254,
		"path": "../public/assets/flag-DiS3nXzh.js"
	},
	"/assets/garage-DP0UwSf9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13ee-QcVccNUz/UJzY7Qy/oURAQJyP8I\"",
		"mtime": "2026-10-13T11:22:44.789Z",
		"size": 5102,
		"path": "../public/assets/garage-DP0UwSf9.js"
	},
	"/assets/dashboard.customer-DxOLmb8u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0bcb-kCDbxw/fQcEGxnBJUIhAChy1Xa8\"",
		"mtime": "2026-10-13T11:22:44.782Z",
		"size": 789451,
		"path": "../public/assets/dashboard.customer-DxOLmb8u.js"
	},
	"/assets/ev-login-showcase-nZh_Lq1H.jpg": {
		"type": "image/jpeg",
		"etag": "\"b272a-Y/uO9CgSJ1uAZBm3HryjPs7qswU\"",
		"mtime": "2026-10-13T11:22:46.935Z",
		"size": 730922,
		"path": "../public/assets/ev-login-showcase-nZh_Lq1H.jpg"
	},
	"/assets/generateCategoricalChart-DzppBnwg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58d92-VatrR8oTY7daytgyFp3/X1j1/V0\"",
		"mtime": "2026-10-13T11:22:45.082Z",
		"size": 363922,
		"path": "../public/assets/generateCategoricalChart-DzppBnwg.js"
	},
	"/assets/GlassCard-BJyc8r9X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49f-qHDZd5oNdZw5oOKUDGDveVGAMio\"",
		"mtime": "2026-10-13T11:22:40.754Z",
		"size": 1183,
		"path": "../public/assets/GlassCard-BJyc8r9X.js"
	},
	"/assets/GlassButton-kC8UFQoX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6af-F8F2XHNiHsj4N/lDXJDkAxpoN84\"",
		"mtime": "2026-10-13T11:22:40.754Z",
		"size": 1711,
		"path": "../public/assets/GlassButton-kC8UFQoX.js"
	},
	"/assets/GlassDrawer-CNxlrhDt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ea-2tZwGBErW5eCSzSjWh3EdySIvkc\"",
		"mtime": "2026-10-13T11:22:40.757Z",
		"size": 1770,
		"path": "../public/assets/GlassDrawer-CNxlrhDt.js"
	},
	"/assets/GlassInput-D4lq8CSp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4da-aDzIVK/1Yl2n5driGjuSl8VVFcM\"",
		"mtime": "2026-10-13T11:22:40.762Z",
		"size": 1242,
		"path": "../public/assets/GlassInput-D4lq8CSp.js"
	},
	"/assets/GlassModal-Cc6i7N6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f9-Zfuc55FunXsW5E+SdgRf7kFFt0M\"",
		"mtime": "2026-10-13T11:22:40.763Z",
		"size": 1785,
		"path": "../public/assets/GlassModal-Cc6i7N6u.js"
	},
	"/assets/headphones-Cwy0Boi5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed-oUwR4P/B4+gkz4P6c7qtN6mqIjE\"",
		"mtime": "2026-10-13T11:22:45.324Z",
		"size": 237,
		"path": "../public/assets/headphones-Cwy0Boi5.js"
	},
	"/assets/image-B3pNzbko.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-AcykRjgd8OtI0WkaKxe4FZCCC7I\"",
		"mtime": "2026-10-13T11:22:45.331Z",
		"size": 269,
		"path": "../public/assets/image-B3pNzbko.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-13T11:22:47.033Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/GlassSelect-Bo4k7Kcl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-TcioUF1BWUGLPDcizREtAQjIr7k\"",
		"mtime": "2026-10-13T11:22:40.765Z",
		"size": 1249,
		"path": "../public/assets/GlassSelect-Bo4k7Kcl.js"
	},
	"/assets/key-round-DQT4Zn0H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"163-iL3Zgri1Dw+cn+ba/nury5NQrGU\"",
		"mtime": "2026-10-13T11:22:45.332Z",
		"size": 355,
		"path": "../public/assets/key-round-DQT4Zn0H.js"
	},
	"/assets/layout-grid-CzHDZ-bg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15a-thN1EYUSFRj0u5Crdf8DLXlcdAk\"",
		"mtime": "2026-10-13T11:22:45.332Z",
		"size": 346,
		"path": "../public/assets/layout-grid-CzHDZ-bg.js"
	},
	"/assets/jsx-runtime-D3jfb0Ew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22c5-Qh7NbnnF5pPMnr2eoPNshytf37o\"",
		"mtime": "2026-10-13T11:22:45.331Z",
		"size": 8901,
		"path": "../public/assets/jsx-runtime-D3jfb0Ew.js"
	},
	"/assets/loader-circle-Ck2ScGJP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-sdGFsXF6ZEi2yWiedQkoa5MTHWc\"",
		"mtime": "2026-10-13T11:22:45.333Z",
		"size": 144,
		"path": "../public/assets/loader-circle-Ck2ScGJP.js"
	},
	"/assets/link-Cqw0SZOf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c2a-asAmG8MrxyYTGUXjPVvQ9xoEFbE\"",
		"mtime": "2026-10-13T11:22:45.333Z",
		"size": 11306,
		"path": "../public/assets/link-Cqw0SZOf.js"
	},
	"/assets/LiveMap-CpiZDWwT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac8-M8hyGbJgSpviJLs2Ka9BYkQbVAs\"",
		"mtime": "2026-10-13T11:22:40.766Z",
		"size": 2760,
		"path": "../public/assets/LiveMap-CpiZDWwT.js"
	},
	"/assets/index-D8Ai_bhM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7fbcc-tbmBWL7t3ypJKrMzLBR3zOHHERw\"",
		"mtime": "2026-10-13T11:22:40.739Z",
		"size": 523212,
		"path": "../public/assets/index-D8Ai_bhM.js"
	},
	"/assets/lock-DCqpUZJL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-xvHgpSujGWONPJvypndV6j0Nkso\"",
		"mtime": "2026-10-13T11:22:45.334Z",
		"size": 206,
		"path": "../public/assets/lock-DCqpUZJL.js"
	},
	"/assets/log-out-2pNj3F3t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-lR/ZFDEPmawOKHfSv/hhxLMgIHI\"",
		"mtime": "2026-10-13T11:22:45.343Z",
		"size": 230,
		"path": "../public/assets/log-out-2pNj3F3t.js"
	},
	"/assets/mail-B3ecmZxY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-2X5CnuswS/la/WNiF3BXzxaQQx8\"",
		"mtime": "2026-10-13T11:22:45.355Z",
		"size": 213,
		"path": "../public/assets/mail-B3ecmZxY.js"
	},
	"/assets/login-DXyeQ8d8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3720-sWW90nF+9Lm/MJDtbCQWMS7jkiE\"",
		"mtime": "2026-10-13T11:22:45.346Z",
		"size": 14112,
		"path": "../public/assets/login-DXyeQ8d8.js"
	},
	"/assets/map-pin-DxXv5Z8Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-sIlXujEGjWsZqvhuZ26jBk0R3vU\"",
		"mtime": "2026-10-13T11:22:45.356Z",
		"size": 259,
		"path": "../public/assets/map-pin-DxXv5Z8Q.js"
	},
	"/assets/menu-DUA9vcl_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd-d0qatkeRa0PTZLW1ivFK/rbzA1c\"",
		"mtime": "2026-10-13T11:22:45.357Z",
		"size": 189,
		"path": "../public/assets/menu-DUA9vcl_.js"
	},
	"/assets/MeshBackground-DiQjrKfP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73e-cyap2AYgzTUEoUeUkpmrpxnRkGE\"",
		"mtime": "2026-10-13T11:22:40.768Z",
		"size": 1854,
		"path": "../public/assets/MeshBackground-DiQjrKfP.js"
	},
	"/assets/message-square-Ovxawd2M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-eWCppCXahXqr60ElI+e/0BFJEsE\"",
		"mtime": "2026-10-13T11:22:45.358Z",
		"size": 233,
		"path": "../public/assets/message-square-Ovxawd2M.js"
	},
	"/assets/mic-C8Lw6CHI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-oJdubWUFOT2zwDA2RqjaGa5kxJU\"",
		"mtime": "2026-10-13T11:22:45.363Z",
		"size": 235,
		"path": "../public/assets/mic-C8Lw6CHI.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-10-13T11:22:45.365Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/NotificationsScreen-BIGiiWiS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18b8-O1pykkE1TnyWsQjuD9/bf9G/K7M\"",
		"mtime": "2026-10-13T11:22:40.769Z",
		"size": 6328,
		"path": "../public/assets/NotificationsScreen-BIGiiWiS.js"
	},
	"/assets/offers-CPkaFqM3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e5-QzaA6pBqbah9uDnnLJgwl0y4Gcs\"",
		"mtime": "2026-10-13T11:22:45.367Z",
		"size": 5349,
		"path": "../public/assets/offers-CPkaFqM3.js"
	},
	"/assets/OffersScreen-5yLP2Pez.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fa-67QD0Mc91zFfApVovRDfAmwHYdg\"",
		"mtime": "2026-10-13T11:22:40.770Z",
		"size": 9210,
		"path": "../public/assets/OffersScreen-5yLP2Pez.js"
	},
	"/assets/orders-CO251ZwO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a79-K+Mj1sbs2sGjgIDp71a9eQzM0/U\"",
		"mtime": "2026-10-13T11:22:45.368Z",
		"size": 2681,
		"path": "../public/assets/orders-CO251ZwO.js"
	},
	"/assets/OrdersScreen-CW46yEiz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3624-W6cSsGoEYdppeQ0ImYk66LTwAjI\"",
		"mtime": "2026-10-13T11:22:40.771Z",
		"size": 13860,
		"path": "../public/assets/OrdersScreen-CW46yEiz.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-13T11:22:47.034Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/pen-line-CVqjvcvV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115-ocV+2WrALFcbrAkggTAd+lo/xtQ\"",
		"mtime": "2026-10-13T11:22:45.371Z",
		"size": 277,
		"path": "../public/assets/pen-line-CVqjvcvV.js"
	},
	"/assets/percent-_tREKk22.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-RhBdDqB+yYMZ6iRCYLHAxVfKBSE\"",
		"mtime": "2026-10-13T11:22:45.377Z",
		"size": 242,
		"path": "../public/assets/percent-_tREKk22.js"
	},
	"/assets/pen-OHS_AcDC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-0YdMvRyNYxEV25g/qR7FFvPD724\"",
		"mtime": "2026-10-13T11:22:45.369Z",
		"size": 235,
		"path": "../public/assets/pen-OHS_AcDC.js"
	},
	"/assets/phone-CBVm8lDH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-fsbp4iI28ZPt2U97GdKQt4iRi/A\"",
		"mtime": "2026-10-13T11:22:45.378Z",
		"size": 322,
		"path": "../public/assets/phone-CBVm8lDH.js"
	},
	"/assets/product._id-C2_2wP5h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14ec-j0f+yBmYzYnPc3dPNUKKak5Xjt0\"",
		"mtime": "2026-10-13T11:22:45.379Z",
		"size": 5356,
		"path": "../public/assets/product._id-C2_2wP5h.js"
	},
	"/assets/PaymentsScreen-RVaueM1U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1839-zNiQoSmlUkZBTLsaAS7yYmhaQNQ\"",
		"mtime": "2026-10-13T11:22:40.771Z",
		"size": 6201,
		"path": "../public/assets/PaymentsScreen-RVaueM1U.js"
	},
	"/assets/ProductApprovalsScreen-CCAhs9AG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"731a-nBKEyzytsyV5tbXuT7NYHdn563Y\"",
		"mtime": "2026-10-13T11:22:41.007Z",
		"size": 29466,
		"path": "../public/assets/ProductApprovalsScreen-CCAhs9AG.js"
	},
	"/assets/proxy-Cw7EYqOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de86-dnlMnZvmIOjnly8QmnFSNxjv7fc\"",
		"mtime": "2026-10-13T11:22:45.380Z",
		"size": 122502,
		"path": "../public/assets/proxy-Cw7EYqOo.js"
	},
	"/assets/ProductsScreen-BAAfAgON.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"262f-62nCZwV9H83D1q2rrlgvXkI6UKg\"",
		"mtime": "2026-10-13T11:22:41.233Z",
		"size": 9775,
		"path": "../public/assets/ProductsScreen-BAAfAgON.js"
	},
	"/assets/ReviewsScreen-Bvxw3-GR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e88-CUI1KRDTs0IfHCQKSEMylhKyWOw\"",
		"mtime": "2026-10-13T11:22:41.234Z",
		"size": 3720,
		"path": "../public/assets/ReviewsScreen-Bvxw3-GR.js"
	},
	"/assets/RidersScreen-Do--cCaP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e7-0aPepDwhTZKxRrDslWmHIGs5JAI\"",
		"mtime": "2026-10-13T11:22:41.235Z",
		"size": 9191,
		"path": "../public/assets/RidersScreen-Do--cCaP.js"
	},
	"/assets/save-D_UJP6q2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-sIXveLt/zlIstbDwR1bLvZgIfQI\"",
		"mtime": "2026-10-13T11:22:45.381Z",
		"size": 327,
		"path": "../public/assets/save-D_UJP6q2.js"
	},
	"/assets/rider-CxFpmyvi.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a6e1-TzcSK9202J+eYGEGQBjAJsGuB9k\"",
		"mtime": "2026-10-13T11:22:47.036Z",
		"size": 173793,
		"path": "../public/assets/rider-CxFpmyvi.jpg"
	},
	"/assets/routes-C9xidJMe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d20-lCVUJ8Rc3XD7e50Y16Fcr2Z8Rao\"",
		"mtime": "2026-10-13T11:22:45.380Z",
		"size": 27936,
		"path": "../public/assets/routes-C9xidJMe.js"
	},
	"/assets/riderzpro-logo-CWZDaQYu.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T11:22:47.301Z",
		"size": 190454,
		"path": "../public/assets/riderzpro-logo-CWZDaQYu.png"
	},
	"/assets/scan-line-Ct2Pxuj2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14b-CcNd3G8UmYZn2MtrQtkuHnQi5Is\"",
		"mtime": "2026-10-13T11:22:45.382Z",
		"size": 331,
		"path": "../public/assets/scan-line-Ct2Pxuj2.js"
	},
	"/assets/send-Chj7lHyJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-trSJyhyIveEMc8LYXvsRp32YEy4\"",
		"mtime": "2026-10-13T11:22:45.383Z",
		"size": 290,
		"path": "../public/assets/send-Chj7lHyJ.js"
	},
	"/assets/SellersScreen-wD_HHbpz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59ae-4XcXdrTo2S/tpPwm3TyAZ5N/We8\"",
		"mtime": "2026-10-13T11:22:41.236Z",
		"size": 22958,
		"path": "../public/assets/SellersScreen-wD_HHbpz.js"
	},
	"/assets/seedData-BdjERrrj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48b9-pPYpUxgsxqQiR6lXu64pimhTB48\"",
		"mtime": "2026-10-13T11:22:45.382Z",
		"size": 18617,
		"path": "../public/assets/seedData-BdjERrrj.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-13T11:22:47.980Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/settings-B4uxjljw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e7-8XKuHN3c3kWPcRp2E8HNSZ5qJSI\"",
		"mtime": "2026-10-13T11:22:45.383Z",
		"size": 487,
		"path": "../public/assets/settings-B4uxjljw.js"
	},
	"/assets/SettingsScreen-DK_kZUw2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4406-7fZS7faDLfNkvikFFLnYzjIq4Cg\"",
		"mtime": "2026-10-13T11:22:41.237Z",
		"size": 17414,
		"path": "../public/assets/SettingsScreen-DK_kZUw2.js"
	},
	"/assets/shield-alert-BucUbQ0D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"161-TvRhHWLfvFhywTKY/gJp982+JT8\"",
		"mtime": "2026-10-13T11:22:45.384Z",
		"size": 353,
		"path": "../public/assets/shield-alert-BucUbQ0D.js"
	},
	"/assets/shield-BdD636bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"110-Vh2aJWwt8QTPz6AntmodtuczZwc\"",
		"mtime": "2026-10-13T11:22:45.384Z",
		"size": 272,
		"path": "../public/assets/shield-BdD636bX.js"
	},
	"/assets/shield-check-uWDGVtnq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-7GZONstXYhkot8gSDrPIjAYP48M\"",
		"mtime": "2026-10-13T11:22:45.385Z",
		"size": 320,
		"path": "../public/assets/shield-check-uWDGVtnq.js"
	},
	"/assets/shopping-bag-DjRy7kDM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"238-rnezyc2o9X2LknXkChiv0In9cuA\"",
		"mtime": "2026-10-13T11:22:45.388Z",
		"size": 568,
		"path": "../public/assets/shopping-bag-DjRy7kDM.js"
	},
	"/assets/shop-CHN_YeSB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19d1-G+sm68hSWizKERF51SZQmfDFgwE\"",
		"mtime": "2026-10-13T11:22:45.387Z",
		"size": 6609,
		"path": "../public/assets/shop-CHN_YeSB.js"
	},
	"/assets/signup-C6wInSdN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"105-kaMS1Paz67gbveZ5IZzYjnkIzrA\"",
		"mtime": "2026-10-13T11:22:45.389Z",
		"size": 261,
		"path": "../public/assets/signup-C6wInSdN.js"
	},
	"/assets/SiteLayout-CkASjsmq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c98a-uHB2p+gpxeQWD4NDiyMhKHDwaF0\"",
		"mtime": "2026-10-13T11:22:41.237Z",
		"size": 117130,
		"path": "../public/assets/SiteLayout-CkASjsmq.js"
	},
	"/assets/Skeleton-DicmxCb6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-k0xYcJr6fRFicJ1SZ6wdmPDNffQ\"",
		"mtime": "2026-10-13T11:22:41.241Z",
		"size": 291,
		"path": "../public/assets/Skeleton-DicmxCb6.js"
	},
	"/assets/sliders-horizontal-DmRN6ZTZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-/1TmObC4D51pUtnY53vsjN39dFY\"",
		"mtime": "2026-10-13T11:22:45.390Z",
		"size": 424,
		"path": "../public/assets/sliders-horizontal-DmRN6ZTZ.js"
	},
	"/assets/sparkles-BNBj2awz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-uGtTMOD3uwxC+E98+h6G/JFI9o0\"",
		"mtime": "2026-10-13T11:22:45.390Z",
		"size": 494,
		"path": "../public/assets/sparkles-BNBj2awz.js"
	},
	"/assets/square-DIk8-68s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93-EBtfI/E0uF1ozZpP/OnL0rOwXMI\"",
		"mtime": "2026-10-13T11:22:45.397Z",
		"size": 147,
		"path": "../public/assets/square-DIk8-68s.js"
	},
	"/assets/StatusBadge-CHFO4C2J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ff-1wTZo9vri5KcUs/CPKcFnkCydXw\"",
		"mtime": "2026-10-13T11:22:41.243Z",
		"size": 1279,
		"path": "../public/assets/StatusBadge-CHFO4C2J.js"
	},
	"/assets/store-CquHo9lk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f2-xn1HsURQuSmnbXp7CUk7kuYPOyU\"",
		"mtime": "2026-10-13T11:22:45.398Z",
		"size": 498,
		"path": "../public/assets/store-CquHo9lk.js"
	},
	"/assets/store._slug-DF8Sa5gV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183f-TIHROFuJMiIsxk2E6jpts8t0e24\"",
		"mtime": "2026-10-13T11:22:45.399Z",
		"size": 6207,
		"path": "../public/assets/store._slug-DF8Sa5gV.js"
	},
	"/assets/styles-8vB3evcc.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"2ff60-DwZAjnd6F96jiBnWMI1Jnn1gjSg\"",
		"mtime": "2026-10-13T11:22:53.610Z",
		"size": 196448,
		"path": "../public/assets/styles-8vB3evcc.css"
	},
	"/assets/trash-2-Cm6tgp9z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-kkdYxImvW5H1opLcwfRwYyram0w\"",
		"mtime": "2026-10-13T11:22:45.401Z",
		"size": 328,
		"path": "../public/assets/trash-2-Cm6tgp9z.js"
	},
	"/assets/SupportScreen-DMRY9hqi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1801-UhpAeDB87FWmnWpw8Tv11uVSd3E\"",
		"mtime": "2026-10-13T11:22:41.243Z",
		"size": 6145,
		"path": "../public/assets/SupportScreen-DMRY9hqi.js"
	},
	"/assets/track._id-DuV1bHLI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130d-nVaKwStLIuQbTF6X4p8aiCwvE58\"",
		"mtime": "2026-10-13T11:22:45.400Z",
		"size": 4877,
		"path": "../public/assets/track._id-DuV1bHLI.js"
	},
	"/assets/TeamScreen-BfzMigew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fc-RAS/0nvSCLke4t3+w7U2Y34z5Js\"",
		"mtime": "2026-10-13T11:22:41.244Z",
		"size": 9212,
		"path": "../public/assets/TeamScreen-BfzMigew.js"
	},
	"/assets/upload--b5nanI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-hhxsl1PlPiqzFZOQcu5UU1ioy7Q\"",
		"mtime": "2026-10-13T11:22:45.402Z",
		"size": 230,
		"path": "../public/assets/upload--b5nanI5.js"
	},
	"/assets/useMatch-2Khnpv0R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24b-eU+tni+VH/Saq/v27Wk5vJaGhIA\"",
		"mtime": "2026-10-13T11:22:45.405Z",
		"size": 587,
		"path": "../public/assets/useMatch-2Khnpv0R.js"
	},
	"/assets/user-CQYrussp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-9x6D9f8roLL24/SgbNK38+ulQ+o\"",
		"mtime": "2026-10-13T11:22:45.405Z",
		"size": 196,
		"path": "../public/assets/user-CQYrussp.js"
	},
	"/assets/validators-zNdq-4Lf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f39e-fjJxtwpTpj5w/JdivcWSIL43bEc\"",
		"mtime": "2026-10-13T11:22:45.406Z",
		"size": 62366,
		"path": "../public/assets/validators-zNdq-4Lf.js"
	},
	"/assets/vendor.auth-BVoHpSjG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"596c-THyEPnPSlfpk1uyAp8yqeZNfnIs\"",
		"mtime": "2026-10-13T11:22:45.409Z",
		"size": 22892,
		"path": "../public/assets/vendor.auth-BVoHpSjG.js"
	},
	"/assets/vendor.dashboard-BOkSjWWW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25de8-pwJZuK+ZPSCtPxnZM6XChp6YVFg\"",
		"mtime": "2026-10-13T11:22:45.409Z",
		"size": 155112,
		"path": "../public/assets/vendor.dashboard-BOkSjWWW.js"
	},
	"/assets/vendor.pending-CdU3lY_l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c5-kqTB7HCoEEFdKogfYU5BFpkZuKo\"",
		"mtime": "2026-10-13T11:22:45.564Z",
		"size": 9925,
		"path": "../public/assets/vendor.pending-CdU3lY_l.js"
	},
	"/assets/wrench-D7JXycsl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-aCmgHotL4tOgZmPKnGDt3lQk9lU\"",
		"mtime": "2026-10-13T11:22:45.565Z",
		"size": 303,
		"path": "../public/assets/wrench-D7JXycsl.js"
	},
	"/images/hero-scooter-poster.jpg": {
		"type": "image/jpeg",
		"etag": "\"28425-QU72Dli4Y3Ik3eAbocg/IyGbZ2s\"",
		"mtime": "2026-10-13T10:58:23.564Z",
		"size": 164901,
		"path": "../public/images/hero-scooter-poster.jpg"
	},
	"/images/scooter-fallback.png": {
		"type": "image/png",
		"etag": "\"604e-60GO4dunbYa4L63sRRA8IAvVsis\"",
		"mtime": "2026-10-13T10:58:23.581Z",
		"size": 24654,
		"path": "../public/images/scooter-fallback.png"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-13T05:46:46.215Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-13T05:46:46.218Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-13T05:46:46.218Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-13T05:46:46.221Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/assets/vendor.onboarding-P7MHhWqO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19cb3-DBOnY1BxUpsU42oZBtKqPrf2+Z4\"",
		"mtime": "2026-10-13T11:22:45.563Z",
		"size": 105651,
		"path": "../public/assets/vendor.onboarding-P7MHhWqO.js"
	},
	"/assets/WarrantyScreen-B1aGBVeN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123c-qWWVDLSpuJBgYTOFlZc78MSGPVg\"",
		"mtime": "2026-10-13T11:22:41.245Z",
		"size": 4668,
		"path": "../public/assets/WarrantyScreen-B1aGBVeN.js"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-13T05:46:46.223Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-13T05:46:46.225Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-13T05:46:46.227Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-13T05:46:46.227Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/images/hero-scooter.jpg": {
		"type": "image/jpeg",
		"etag": "\"95498-/tuhkrLreUJDFYV0uMU7o9w3JcE\"",
		"mtime": "2026-10-13T10:58:23.577Z",
		"size": 611480,
		"path": "../public/images/hero-scooter.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-13T05:46:46.230Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-13T05:46:46.231Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-13T05:46:46.233Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-13T05:46:46.234Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-13T05:46:46.235Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-13T05:46:46.237Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-13T05:46:46.239Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-13T05:46:46.240Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-13T05:46:46.240Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-13T05:46:46.243Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-13T05:46:46.246Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-13T05:46:46.248Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-13T05:46:46.250Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-13T05:46:46.252Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-13T05:46:46.256Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-13T05:46:46.259Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-13T05:46:46.257Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-13T05:46:46.243Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-13T05:46:46.262Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-13T05:46:46.266Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-13T05:46:46.261Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-13T05:46:46.266Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:46:46.273Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-13T05:46:46.273Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-13T05:46:46.303Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:46:46.301Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:46:46.290Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:46:46.287Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:46:46.280Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:46:46.295Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0350/01.jpg"
	},
	"/videos/hero-scooter-scrub.mp4": {
		"type": "video/mp4",
		"etag": "\"b54b18-ZE9EuiIeS3CtPms1Oatv+058SUY\"",
		"mtime": "2026-10-13T10:58:23.987Z",
		"size": 11881240,
		"path": "../public/videos/hero-scooter-scrub.mp4"
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
var _lazy_fsHHJs = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_fsHHJs
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
