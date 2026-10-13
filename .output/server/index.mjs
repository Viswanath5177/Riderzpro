globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { o as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
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
		"mtime": "2026-10-12T09:26:31.747Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-12T07:40:19.259Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"d2-0pJxbgLG+EDoUWmTwFAZCX6mvLc\"",
		"mtime": "2026-10-12T06:26:54.834Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-12T07:43:42.908Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T06:26:54.835Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"3d927-TayZuoMWHFidVYXxYmOdfnKN7eY\"",
		"mtime": "2026-10-13T06:20:17.450Z",
		"size": 252199,
		"path": "../public/logo.png"
	},
	"/assets/AiChatbotWidget-emfCAlHI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c8a-Fh8QHb2Y44JyHiR9vxtD2U/8hzI\"",
		"mtime": "2026-10-13T07:58:45.135Z",
		"size": 31882,
		"path": "../public/assets/AiChatbotWidget-emfCAlHI.js"
	},
	"/assets/auth-C0PgqhL5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9385-ehse64sIPmD/8y1hOond3yZlAUU\"",
		"mtime": "2026-10-13T07:58:45.137Z",
		"size": 37765,
		"path": "../public/assets/auth-C0PgqhL5.js"
	},
	"/assets/assistant-1i0cTfw5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1491-d/Vr0d+SXPO+slp3+CBmNP3PohY\"",
		"mtime": "2026-10-13T07:58:45.137Z",
		"size": 5265,
		"path": "../public/assets/assistant-1i0cTfw5.js"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"3d927-TayZuoMWHFidVYXxYmOdfnKN7eY\"",
		"mtime": "2026-10-13T06:20:17.448Z",
		"size": 252199,
		"path": "../public/riderzpro-logo.png"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-13T07:58:45.157Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/bike-CPR12LkV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-KZhSwCttsF7ywljaKaY86H2qyO0\"",
		"mtime": "2026-10-13T07:58:45.138Z",
		"size": 276,
		"path": "../public/assets/bike-CPR12LkV.js"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-13T07:58:45.158Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/car-BsRi9P-5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18b-25QzyH8h6dRlrmT1H9qjS4Q2rQw\"",
		"mtime": "2026-10-13T07:58:45.139Z",
		"size": 395,
		"path": "../public/assets/car-BsRi9P-5.js"
	},
	"/assets/cart-DznS0y6N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4bf5-0HX0l5Cwtn2Ogjji25xzEHMt7xE\"",
		"mtime": "2026-10-13T07:58:45.140Z",
		"size": 19445,
		"path": "../public/assets/cart-DznS0y6N.js"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-13T07:58:45.159Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/chevron-right-kMVqSI7R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-4J3iZYhUocG/aIpAnY1IYitUTfs\"",
		"mtime": "2026-10-13T07:58:45.140Z",
		"size": 118,
		"path": "../public/assets/chevron-right-kMVqSI7R.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-13T07:58:45.159Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/dashboard.rider-G92gGatG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12cc-0ud6aiTOga+0o8Re0RFSEH6u3Ug\"",
		"mtime": "2026-10-13T07:58:45.142Z",
		"size": 4812,
		"path": "../public/assets/dashboard.rider-G92gGatG.js"
	},
	"/assets/bits-s4_PEhKI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21213-bq7L05uVTAKuwpozfeS9MUIQCaA\"",
		"mtime": "2026-10-13T07:58:45.139Z",
		"size": 135699,
		"path": "../public/assets/bits-s4_PEhKI.js"
	},
	"/assets/dashboard.workshop-DwpDznyf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1545-aKaBWvZeYqYx7knIb+n+0WSpK18\"",
		"mtime": "2026-10-13T07:58:45.143Z",
		"size": 5445,
		"path": "../public/assets/dashboard.workshop-DwpDznyf.js"
	},
	"/assets/dashboards-Be9qC-Cb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-0RsHcbqPVvJ5DMosT1wWxK49mUo\"",
		"mtime": "2026-10-13T07:58:45.143Z",
		"size": 1632,
		"path": "../public/assets/dashboards-Be9qC-Cb.js"
	},
	"/assets/garage-B6sNI910.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"466f-VyCyIF6dJ/MZXvPhE+cROZXBY2E\"",
		"mtime": "2026-10-13T07:58:45.144Z",
		"size": 18031,
		"path": "../public/assets/garage-B6sNI910.js"
	},
	"/assets/dashboard.customer-LO-1bxDk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"322c7-DbnuAkHcmdqotCRtlS9DkJpIhEY\"",
		"mtime": "2026-10-13T07:58:45.141Z",
		"size": 205511,
		"path": "../public/assets/dashboard.customer-LO-1bxDk.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-13T07:58:45.161Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/invariant-CgFvOqN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c2-OtvVxjJzKVqOT1XQL6Tnz3B8fGk\"",
		"mtime": "2026-10-13T07:58:45.144Z",
		"size": 450,
		"path": "../public/assets/invariant-CgFvOqN2.js"
	},
	"/assets/LiveMap-BdJszUkJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9e-dtdwW+ALpxuSvXZt51f0q/lNkwo\"",
		"mtime": "2026-10-13T07:58:45.136Z",
		"size": 2974,
		"path": "../public/assets/LiveMap-BdJszUkJ.js"
	},
	"/assets/lock-CXybqVVc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-DNjDiFEjLbuuCiBKdSlQ5hYqMng\"",
		"mtime": "2026-10-13T07:58:45.146Z",
		"size": 194,
		"path": "../public/assets/lock-CXybqVVc.js"
	},
	"/assets/log-out-DfejT66r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a-c/EAEnDna1gNeufbU2aujedHU7w\"",
		"mtime": "2026-10-13T07:58:45.147Z",
		"size": 330,
		"path": "../public/assets/log-out-DfejT66r.js"
	},
	"/assets/login-BJD4m68H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"204b-dxzXmwb3+3SiTIAL3t4MQ3rbvWk\"",
		"mtime": "2026-10-13T07:58:45.148Z",
		"size": 8267,
		"path": "../public/assets/login-BJD4m68H.js"
	},
	"/assets/orders-KFDxJDPv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6da-uck+WGJ7oqsxB7gU+U30k7wSmJ8\"",
		"mtime": "2026-10-13T07:58:45.149Z",
		"size": 1754,
		"path": "../public/assets/orders-KFDxJDPv.js"
	},
	"/assets/navigation-D-hxba6T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"88-ZDbJm3SeOIjicwTX0e7TAFCps/M\"",
		"mtime": "2026-10-13T07:58:45.148Z",
		"size": 136,
		"path": "../public/assets/navigation-D-hxba6T.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-13T07:58:45.162Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/plus-DQV1Gh7C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-Hv/bdDG4GBqTaqvoZ034hP/5QjE\"",
		"mtime": "2026-10-13T07:58:45.149Z",
		"size": 141,
		"path": "../public/assets/plus-DQV1Gh7C.js"
	},
	"/assets/preload-helper-BuBPRxo1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1476-55nNl59c2kpcrlnaUxh4MZYnM9c\"",
		"mtime": "2026-10-13T07:58:45.150Z",
		"size": 5238,
		"path": "../public/assets/preload-helper-BuBPRxo1.js"
	},
	"/assets/product._id-BiNp38i7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61f4-JNumzvrLvJqnbBrjqwbtY0xSOdg\"",
		"mtime": "2026-10-13T07:58:45.151Z",
		"size": 25076,
		"path": "../public/assets/product._id-BiNp38i7.js"
	},
	"/assets/rider-CxFpmyvi.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a6e1-TzcSK9202J+eYGEGQBjAJsGuB9k\"",
		"mtime": "2026-10-13T07:58:45.163Z",
		"size": 173793,
		"path": "../public/assets/rider-CxFpmyvi.jpg"
	},
	"/assets/riderzpro-logo-DAzTmkSP.png": {
		"type": "image/png",
		"etag": "\"3d927-TayZuoMWHFidVYXxYmOdfnKN7eY\"",
		"mtime": "2026-10-13T07:58:45.165Z",
		"size": 252199,
		"path": "../public/assets/riderzpro-logo-DAzTmkSP.png"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-10-13T07:58:45.152Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/routes-WbjBP7CC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3330-3pHW/50PBa12DcGfnwpyKWptWdM\"",
		"mtime": "2026-10-13T07:58:45.153Z",
		"size": 13104,
		"path": "../public/assets/routes-WbjBP7CC.js"
	},
	"/assets/scan-line-Bzlo2YFD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-KzrnyRARae43K2O0rPpnDrqeFrE\"",
		"mtime": "2026-10-13T07:58:45.153Z",
		"size": 319,
		"path": "../public/assets/scan-line-Bzlo2YFD.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-13T07:58:45.166Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/shield-check-nICfxKBz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d7-6d8+q7TEyOCSeyefJmqaFVOhkp4\"",
		"mtime": "2026-10-13T07:58:45.154Z",
		"size": 727,
		"path": "../public/assets/shield-check-nICfxKBz.js"
	},
	"/assets/shop-ChJEZ3Uh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3707-9c9IfrOXn/pzypAwdMxx9/9hu+s\"",
		"mtime": "2026-10-13T07:58:45.154Z",
		"size": 14087,
		"path": "../public/assets/shop-ChJEZ3Uh.js"
	},
	"/assets/store-BTEHDSm2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b4-AFbQ75orRoToyuc+VYsXPBTrDu8\"",
		"mtime": "2026-10-13T07:58:45.155Z",
		"size": 692,
		"path": "../public/assets/store-BTEHDSm2.js"
	},
	"/assets/track._id-BkELYHSs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d7-MsV3FvKbHIhx7cu9DDGM+u8Qttk\"",
		"mtime": "2026-10-13T07:58:45.156Z",
		"size": 4567,
		"path": "../public/assets/track._id-BkELYHSs.js"
	},
	"/assets/wrench-uzX1865c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-WbxEtIpJGJqdq29vGVuqQaalVqg\"",
		"mtime": "2026-10-13T07:58:45.156Z",
		"size": 291,
		"path": "../public/assets/wrench-uzX1865c.js"
	},
	"/assets/x-CADm-ilO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c5-oIBtxILTtMb1XBVKiHRBQn/acCY\"",
		"mtime": "2026-10-13T07:58:45.157Z",
		"size": 709,
		"path": "../public/assets/x-CADm-ilO.js"
	},
	"/assets/styles-aVPAu1yC.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"27b48-sAts3JlXxxx5wklSMvSuLICK0tg\"",
		"mtime": "2026-10-13T07:58:45.166Z",
		"size": 162632,
		"path": "../public/assets/styles-aVPAu1yC.css"
	},
	"/assets/index-DvsxJmLh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ddd77-rnGNehVgEUFRgRo3Ipu8HyAPauc\"",
		"mtime": "2026-10-13T07:58:45.135Z",
		"size": 908663,
		"path": "../public/assets/index-DvsxJmLh.js"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-13T05:07:16.970Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-13T05:07:16.969Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-13T05:07:16.972Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-13T05:07:16.974Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-13T05:07:16.973Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-13T05:07:16.976Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-13T05:07:16.977Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-13T05:07:16.980Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-13T05:07:16.979Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-13T05:07:16.984Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-13T05:07:16.986Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-13T05:07:16.982Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-13T05:07:16.988Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-13T05:07:16.991Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-13T05:07:16.989Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-13T05:07:16.992Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-13T05:07:16.994Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-13T05:07:16.996Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-13T05:07:16.997Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-13T05:07:17.001Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-13T05:07:16.999Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-13T05:07:17.003Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-13T05:07:17.005Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-13T05:07:17.011Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-13T05:07:17.008Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-13T05:07:17.016Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-13T05:07:17.014Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-13T05:07:17.028Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-13T05:07:17.019Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:07:17.033Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-13T05:07:17.025Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-13T05:07:17.038Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:07:17.056Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:07:17.060Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-13T05:07:17.080Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:07:17.077Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:07:17.051Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:07:17.072Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0350/01.jpg"
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
var _lazy_GFTG3H = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_GFTG3H
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
