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
		"mtime": "2026-10-12T06:37:37.525Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T08:07:42.219Z",
		"size": 190454,
		"path": "../public/logo.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"d2-0pJxbgLG+EDoUWmTwFAZCX6mvLc\"",
		"mtime": "2026-10-12T06:37:37.526Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/assets/arrow-left-CH1Fq5on.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-7LzLgTObpQz+BfBHObJIHflnbTc\"",
		"mtime": "2026-10-12T19:41:56.071Z",
		"size": 153,
		"path": "../public/assets/arrow-left-CH1Fq5on.js"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-12T08:07:42.240Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/assets/arrow-right-J5k4efaC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-q6jV8fF7bz+HgLCEFZk4zYmGhlw\"",
		"mtime": "2026-10-12T19:41:56.071Z",
		"size": 153,
		"path": "../public/assets/arrow-right-J5k4efaC.js"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-12T08:07:42.240Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T06:37:37.526Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/bike-BnTcU-nr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-zP47GMVyh/L7hVeEAlr0XEgpbG0\"",
		"mtime": "2026-10-12T19:41:56.074Z",
		"size": 276,
		"path": "../public/assets/bike-BnTcU-nr.js"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T08:07:42.240Z",
		"size": 190454,
		"path": "../public/riderzpro-logo.png"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-12T19:41:56.134Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/bits-BSTb8VjJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dbd2-u8T9/v1t4w6nWiQybDPmVjzH2E8\"",
		"mtime": "2026-10-12T19:41:56.074Z",
		"size": 121810,
		"path": "../public/assets/bits-BSTb8VjJ.js"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-12T19:41:56.136Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/chevron-right-KioXc309.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-bs/0+N+Ee184cxuy5orb2iwCuVk\"",
		"mtime": "2026-10-12T19:41:56.080Z",
		"size": 118,
		"path": "../public/assets/chevron-right-KioXc309.js"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-12T19:41:56.136Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/check-Cx-1y7sV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70-rcmTrGcpN+9wgMzDKqzmNQ3Q9oQ\"",
		"mtime": "2026-10-12T19:41:56.078Z",
		"size": 112,
		"path": "../public/assets/check-Cx-1y7sV.js"
	},
	"/assets/credit-card-BUTQFevo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-e/gL7bx/0sAhsqopNWuFHxkGO7A\"",
		"mtime": "2026-10-12T19:41:56.084Z",
		"size": 195,
		"path": "../public/assets/credit-card-BUTQFevo.js"
	},
	"/assets/dashboard.customer-DAZX31D9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2924b-H9rZQCkXgQGpMz8QaEOL7130/F4\"",
		"mtime": "2026-10-12T19:41:56.086Z",
		"size": 168523,
		"path": "../public/assets/dashboard.customer-DAZX31D9.js"
	},
	"/assets/clock-rqe66a5W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-Tv7ExxzUiccgQLd6ulO3dZ0dxYA\"",
		"mtime": "2026-10-12T19:41:56.082Z",
		"size": 157,
		"path": "../public/assets/clock-rqe66a5W.js"
	},
	"/assets/cart-BYuoMfCr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4772-l8n9zAzLt+vU/JA0A4Vr+YZ3P2k\"",
		"mtime": "2026-10-12T19:41:56.076Z",
		"size": 18290,
		"path": "../public/assets/cart-BYuoMfCr.js"
	},
	"/assets/Charts-BphpWahH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce28-NdY9g+yOu1yhmUntvr+ieWMPJZQ\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 380456,
		"path": "../public/assets/Charts-BphpWahH.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-12T19:41:56.139Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/dashboard.vendor-D6zEqFHe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22cc-qe9suQW0jfF8RD/Uldx6vbpCFRU\"",
		"mtime": "2026-10-12T19:41:56.092Z",
		"size": 8908,
		"path": "../public/assets/dashboard.vendor-D6zEqFHe.js"
	},
	"/assets/assistant-gSL99G5I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155d-vHouvNNmF1apm8wwCKzVnujIpc0\"",
		"mtime": "2026-10-12T19:41:56.071Z",
		"size": 5469,
		"path": "../public/assets/assistant-gSL99G5I.js"
	},
	"/assets/dashboard.rider-BPsN-QOq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133e-oKyb0rAP6y5gwA8XPcPGNPyg+sU\"",
		"mtime": "2026-10-12T19:41:56.088Z",
		"size": 4926,
		"path": "../public/assets/dashboard.rider-BPsN-QOq.js"
	},
	"/assets/eye-DQfDMZan.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-rmRwdyXLhiRHuVDUhvohKTyy+3g\"",
		"mtime": "2026-10-12T19:41:56.096Z",
		"size": 244,
		"path": "../public/assets/eye-DQfDMZan.js"
	},
	"/assets/dashboards-BW830CSA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6dd-ZjCiAayZYPJlBIsK/3yatbfi1DY\"",
		"mtime": "2026-10-12T19:41:56.094Z",
		"size": 1757,
		"path": "../public/assets/dashboards-BW830CSA.js"
	},
	"/assets/DashboardShell-g8jWcZZy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e2-YIgZqdj0jpG2nqBUwIcyGVJtd0c\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 4578,
		"path": "../public/assets/DashboardShell-g8jWcZZy.js"
	},
	"/assets/dashboard.workshop-Ca4hqnJg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158d-/evXjzN/2JER07kS5YbgeRiU1wo\"",
		"mtime": "2026-10-12T19:41:56.094Z",
		"size": 5517,
		"path": "../public/assets/dashboard.workshop-Ca4hqnJg.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-12T19:41:56.139Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/indian-rupee-CjUE4ATh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-wVEYrKrQCVy2BusdwxQwOBnmrjo\"",
		"mtime": "2026-10-12T19:41:56.098Z",
		"size": 279,
		"path": "../public/assets/indian-rupee-CjUE4ATh.js"
	},
	"/assets/index-B9AcA5CM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6664d-B+zsv15PHMNY69Ho7fCLnnZP/WI\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 419405,
		"path": "../public/assets/index-B9AcA5CM.js"
	},
	"/assets/layout-dashboard-CDSGb5SR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"153-tJZVc4mWtpreD8/87TgXnVhZaB4\"",
		"mtime": "2026-10-12T19:41:56.100Z",
		"size": 339,
		"path": "../public/assets/layout-dashboard-CDSGb5SR.js"
	},
	"/assets/layout-grid-DyhX5mu0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-dRKNYMYqid6VIUdw/rGmZEKKcZ0\"",
		"mtime": "2026-10-12T19:41:56.102Z",
		"size": 334,
		"path": "../public/assets/layout-grid-DyhX5mu0.js"
	},
	"/assets/LiveMap-DjLC7lXZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7a-knGJHlGZ5d7boXSnAhnrm/tLqk0\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 2938,
		"path": "../public/assets/LiveMap-DjLC7lXZ.js"
	},
	"/assets/loader-circle-Dvt75RNy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"84-5lsbLVkmW2V894fJN6KUOxVlR5s\"",
		"mtime": "2026-10-12T19:41:56.102Z",
		"size": 132,
		"path": "../public/assets/loader-circle-Dvt75RNy.js"
	},
	"/assets/lock-Bq_56N6n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-BiFCEL8Yd1fYUIKAk9LXJ9oTQRM\"",
		"mtime": "2026-10-12T19:41:56.104Z",
		"size": 194,
		"path": "../public/assets/lock-Bq_56N6n.js"
	},
	"/assets/garage-CAAROsvg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"46df-DzeUsTlSOCL1ogJHGF/Jd45nvdM\"",
		"mtime": "2026-10-12T19:41:56.098Z",
		"size": 18143,
		"path": "../public/assets/garage-CAAROsvg.js"
	},
	"/assets/map-pin-DFkflbTC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-XNBbiQyP7s7ZNpuwzkKWGS/8zBI\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 247,
		"path": "../public/assets/map-pin-DFkflbTC.js"
	},
	"/assets/menu-C2CjNeCQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35a-UremE7cj7fihdGGW8+lcjO7rmGs\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 858,
		"path": "../public/assets/menu-C2CjNeCQ.js"
	},
	"/assets/mic-DvQcxR9g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df-LtG70ja03srr1vmGYQxM+oEeI1M\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 223,
		"path": "../public/assets/mic-DvQcxR9g.js"
	},
	"/assets/navigation-ofDd0W3j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"88-cnkCd9ZUfr9UB1ZjtWezaj1DwLM\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 136,
		"path": "../public/assets/navigation-ofDd0W3j.js"
	},
	"/assets/login-DYUOq5f9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3557-AgC16BeInmQ+yXqrRIJCONrzlyw\"",
		"mtime": "2026-10-12T19:41:56.104Z",
		"size": 13655,
		"path": "../public/assets/login-DYUOq5f9.js"
	},
	"/assets/package-0bf2VvCk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"168-+XbobFETkxK3GgS4lw5zwYNfZ3c\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 360,
		"path": "../public/assets/package-0bf2VvCk.js"
	},
	"/assets/plus-CUYkj0K7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-9nZnW7WNsy2zm81Li/7Iqdj5P2I\"",
		"mtime": "2026-10-12T19:41:56.110Z",
		"size": 141,
		"path": "../public/assets/plus-CUYkj0K7.js"
	},
	"/assets/orders-DVLWircz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"729-EQb2PixXpxolU6WEvLVvYBgMIio\"",
		"mtime": "2026-10-12T19:41:56.106Z",
		"size": 1833,
		"path": "../public/assets/orders-DVLWircz.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-12T19:41:56.144Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/layers-BAYlttDT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40e-d7hW0dc6lkifRgfuosMKmJ8GmbE\"",
		"mtime": "2026-10-12T19:41:56.100Z",
		"size": 1038,
		"path": "../public/assets/layers-BAYlttDT.js"
	},
	"/assets/ProductFormPage-C-NvwnFG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8511-wAYbgb6bU/3BMBZrfv2cADALFnQ\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 34065,
		"path": "../public/assets/ProductFormPage-C-NvwnFG.js"
	},
	"/assets/refresh-cw-CW778KKc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-DD7qC3QX6aizQQpmJbnvNiTl7Qs\"",
		"mtime": "2026-10-12T19:41:56.110Z",
		"size": 309,
		"path": "../public/assets/refresh-cw-CW778KKc.js"
	},
	"/assets/product._id-DNvxyIwg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f0-CJd7ezfws8SGgCimrQXps83rH2k\"",
		"mtime": "2026-10-12T19:41:56.110Z",
		"size": 752,
		"path": "../public/assets/product._id-DNvxyIwg.js"
	},
	"/assets/rotate-ccw-DcI-Hc5G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc-/u8hVQFlev/ooWuNh7G7j+AYD58\"",
		"mtime": "2026-10-12T19:41:56.114Z",
		"size": 188,
		"path": "../public/assets/rotate-ccw-DcI-Hc5G.js"
	},
	"/assets/product._id-BlUh2OJn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a03-yRFbqxx55Z6bFTMCE3SElF4MqGM\"",
		"mtime": "2026-10-12T19:41:56.110Z",
		"size": 6659,
		"path": "../public/assets/product._id-BlUh2OJn.js"
	},
	"/assets/scan-line-8C2Aa4h9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-vOfMHpey9oT4T4tp6dWR1R7H1Fo\"",
		"mtime": "2026-10-12T19:41:56.115Z",
		"size": 319,
		"path": "../public/assets/scan-line-8C2Aa4h9.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-12T19:41:56.148Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/search-CLlJBzvu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-/n8sNeY3OajXcsukrgcC6bQEZPc\"",
		"mtime": "2026-10-12T19:41:56.117Z",
		"size": 162,
		"path": "../public/assets/search-CLlJBzvu.js"
	},
	"/assets/shield-check-DjPSkgWI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-414+Sz62cQnw7HoVcMRqNocCum4\"",
		"mtime": "2026-10-12T19:41:56.117Z",
		"size": 308,
		"path": "../public/assets/shield-check-DjPSkgWI.js"
	},
	"/assets/riderzpro-logo-CWZDaQYu.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T19:41:56.144Z",
		"size": 190454,
		"path": "../public/assets/riderzpro-logo-CWZDaQYu.png"
	},
	"/assets/shopping-bag-DJS2LLIj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-zV+TA+/Z0HbL01ngE/gTWzdCH+g\"",
		"mtime": "2026-10-12T19:41:56.121Z",
		"size": 328,
		"path": "../public/assets/shopping-bag-DJS2LLIj.js"
	},
	"/assets/shop-bhMFkVHz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2810-bOjhupQ7mESSxlixEr4B3wUN4mw\"",
		"mtime": "2026-10-12T19:41:56.119Z",
		"size": 10256,
		"path": "../public/assets/shop-bhMFkVHz.js"
	},
	"/assets/sparkles-Ddq8J2dP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2-fwBPW3W53QP7e+aVtEir58QMSD0\"",
		"mtime": "2026-10-12T19:41:56.121Z",
		"size": 482,
		"path": "../public/assets/sparkles-Ddq8J2dP.js"
	},
	"/assets/store-DJGTnAqR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-Mq8B7XFhDv92smkR1wPaQ03teLs\"",
		"mtime": "2026-10-12T19:41:56.121Z",
		"size": 486,
		"path": "../public/assets/store-DJGTnAqR.js"
	},
	"/assets/ev-login-showcase-nZh_Lq1H.jpg": {
		"type": "image/jpeg",
		"etag": "\"b272a-Y/uO9CgSJ1uAZBm3HryjPs7qswU\"",
		"mtime": "2026-10-12T19:41:56.139Z",
		"size": 730922,
		"path": "../public/assets/ev-login-showcase-nZh_Lq1H.jpg"
	},
	"/assets/routes-C1330suU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66ae-jtSRkH7vTWon3FvosRkJ0UZhINk\"",
		"mtime": "2026-10-12T19:41:56.115Z",
		"size": 26286,
		"path": "../public/assets/routes-C1330suU.js"
	},
	"/assets/tag-DeUKTe97.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a-ZSS5NVE1JP0XLqxtZxL3i6p7/u0\"",
		"mtime": "2026-10-12T19:41:56.123Z",
		"size": 314,
		"path": "../public/assets/tag-DeUKTe97.js"
	},
	"/assets/SiteLayout-DKa6hFNG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a80-wos4Y8u/J58tkR+zPVJfwT2Av7Y\"",
		"mtime": "2026-10-12T19:41:56.066Z",
		"size": 14976,
		"path": "../public/assets/SiteLayout-DKa6hFNG.js"
	},
	"/assets/preload-helper-dXHAmqAw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ef-4C3EkwIxOGlEXii/MNzmSS5gtIY\"",
		"mtime": "2026-10-12T19:41:56.110Z",
		"size": 5615,
		"path": "../public/assets/preload-helper-dXHAmqAw.js"
	},
	"/assets/trash-2-bWhRRLZs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-DJp69VS3ffYaeTHEDnCJDmlhdIE\"",
		"mtime": "2026-10-12T19:41:56.127Z",
		"size": 316,
		"path": "../public/assets/trash-2-bWhRRLZs.js"
	},
	"/assets/triangle-alert-DH2Z3MiX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b4-gUwHqiZlestq+PpzxGED6FJepl4\"",
		"mtime": "2026-10-12T19:41:56.129Z",
		"size": 436,
		"path": "../public/assets/triangle-alert-DH2Z3MiX.js"
	},
	"/assets/styles-DvYDp15w.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"23d5c-6zUQkrKY9e4fABF99am5Kt/mx3Q\"",
		"mtime": "2026-10-12T19:41:56.148Z",
		"size": 146780,
		"path": "../public/assets/styles-DvYDp15w.css"
	},
	"/assets/truck-Ct6wSE2X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a-QAtQ8bxl9mZY2eWWwERt28SRjS8\"",
		"mtime": "2026-10-12T19:41:56.129Z",
		"size": 394,
		"path": "../public/assets/truck-Ct6wSE2X.js"
	},
	"/assets/useNavigate-fPzjnqKQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-zdCC3uqr9E0x54yQ9tn23gUHWmc\"",
		"mtime": "2026-10-12T19:41:56.129Z",
		"size": 186,
		"path": "../public/assets/useNavigate-fPzjnqKQ.js"
	},
	"/assets/user-CTTIFqql.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c5-lpb5+CYKaDo/XLT16lNJ0Yaxzrs\"",
		"mtime": "2026-10-12T19:41:56.131Z",
		"size": 453,
		"path": "../public/assets/user-CTTIFqql.js"
	},
	"/assets/users-CWkHejoX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-sHcx/8wATJ5TJfpGD3orlTSK1d8\"",
		"mtime": "2026-10-12T19:41:56.131Z",
		"size": 294,
		"path": "../public/assets/users-CWkHejoX.js"
	},
	"/assets/wrench-BPbjLtDG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-oQPOg0m45duQJhvr1hEWGuMqrdI\"",
		"mtime": "2026-10-12T19:41:56.131Z",
		"size": 291,
		"path": "../public/assets/wrench-BPbjLtDG.js"
	},
	"/assets/x-C1Y-nW6H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d9-NUGA4I+xMdiXMiOI1DRs1seoshQ\"",
		"mtime": "2026-10-12T19:41:56.131Z",
		"size": 217,
		"path": "../public/assets/x-C1Y-nW6H.js"
	},
	"/assets/zap-BZOXZ6Lf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-5CtZjEFJdmA7WW/8p23u25NlQOU\"",
		"mtime": "2026-10-12T19:41:56.134Z",
		"size": 250,
		"path": "../public/assets/zap-BZOXZ6Lf.js"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-12T12:23:37.963Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-12T12:23:37.965Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-12T12:23:37.967Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-12T12:23:37.967Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-12T12:23:37.967Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-12T12:23:37.969Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-12T12:23:37.963Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-12T12:23:37.969Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-12T12:23:37.972Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-12T12:23:37.972Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-12T12:23:37.976Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-12T12:23:37.974Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-12T12:23:37.976Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-12T12:23:37.981Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-12T12:23:37.978Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/assets/track._id-BBdYaOyt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ea-5V9Zi/W1GJCxBGqL1q9nPPA+ryk\"",
		"mtime": "2026-10-12T19:41:56.125Z",
		"size": 4586,
		"path": "../public/assets/track._id-BBdYaOyt.js"
	},
	"/assets/track._id-ROPj0Bnq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f9-57eB2aUQZK4RCJKZOGXo8O41zVc\"",
		"mtime": "2026-10-12T19:41:56.127Z",
		"size": 1017,
		"path": "../public/assets/track._id-ROPj0Bnq.js"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-12T12:23:37.987Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-12T12:23:37.981Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-12T12:23:37.989Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-12T12:23:37.990Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-12T12:23:37.988Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-12T12:23:37.994Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-12T12:23:37.997Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-12T12:23:37.996Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-12T12:23:37.999Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-12T12:23:38.005Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-12T12:23:38.006Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-12T12:23:38.001Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-12T12:23:38.003Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-12T12:23:38.013Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-12T12:23:38.037Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-12T12:23:38.022Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T12:23:38.035Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T12:23:38.050Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T12:23:38.064Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T12:23:38.050Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T12:23:38.045Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-12T12:23:38.066Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T12:23:38.061Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0350/01.jpg"
	},
	"/assets/workshop-Dml3A2bw.jpg": {
		"type": "image/jpeg",
		"etag": "\"27d25-vJh05HWgC6L7nvrfu53MmEhdu5I\"",
		"mtime": "2026-10-12T19:41:56.148Z",
		"size": 163109,
		"path": "../public/assets/workshop-Dml3A2bw.jpg"
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
var _lazy_8ePkh0 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_8ePkh0
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
