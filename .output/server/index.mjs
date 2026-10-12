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
		"mtime": "2026-10-12T10:17:35.257Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T10:17:35.259Z",
		"size": 190454,
		"path": "../public/logo.png"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-12T10:17:35.264Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"d2-0pJxbgLG+EDoUWmTwFAZCX6mvLc\"",
		"mtime": "2026-10-12T10:17:35.259Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-12T10:17:35.263Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/assets/arrow-right-CDxWwqQG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-Ox2lzMcKWMwJEW7Tu2Y2HQkiu7M\"",
		"mtime": "2026-10-12T11:07:11.401Z",
		"size": 153,
		"path": "../public/assets/arrow-right-CDxWwqQG.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T10:17:35.270Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T10:17:35.270Z",
		"size": 190454,
		"path": "../public/riderzpro-logo.png"
	},
	"/assets/assistant-BOWHk0sb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155f-50gB4e2SNrCj+Kq0zWJMyBKWBto\"",
		"mtime": "2026-10-12T11:07:11.401Z",
		"size": 5471,
		"path": "../public/assets/assistant-BOWHk0sb.js"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-12T11:07:11.474Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-12T11:07:11.475Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/bike-D3VKwdYC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-kkUg9X1ReBYdPrvI/DwVUMaLgs4\"",
		"mtime": "2026-10-12T11:07:11.402Z",
		"size": 276,
		"path": "../public/assets/bike-D3VKwdYC.js"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-12T11:07:11.478Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/cart-BjPOjx5F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40f2-qeGU6oV1MVhRBUvQPGh1w0UiXr4\"",
		"mtime": "2026-10-12T11:07:11.408Z",
		"size": 16626,
		"path": "../public/assets/cart-BjPOjx5F.js"
	},
	"/assets/bits-BMcn3vzE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d64d-tWQ3qp9LYhdHdnPovHTsf/AaXrQ\"",
		"mtime": "2026-10-12T11:07:11.402Z",
		"size": 120397,
		"path": "../public/assets/bits-BMcn3vzE.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-12T11:07:11.480Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/check-Cu_AGnye.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70-Z5iWMA4whbjBLa6GEghVXUArr7g\"",
		"mtime": "2026-10-12T11:07:11.409Z",
		"size": 112,
		"path": "../public/assets/check-Cu_AGnye.js"
	},
	"/assets/dashboard.rider-CP2jo_4H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1337-a6u0FM8PbJxH3nQ2jceGvSf1IS4\"",
		"mtime": "2026-10-12T11:07:11.427Z",
		"size": 4919,
		"path": "../public/assets/dashboard.rider-CP2jo_4H.js"
	},
	"/assets/dashboard.workshop-d5m2Jb5M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1568-MK2+NvPC8ad4RNuJiw2hFX6IjJk\"",
		"mtime": "2026-10-12T11:07:11.433Z",
		"size": 5480,
		"path": "../public/assets/dashboard.workshop-d5m2Jb5M.js"
	},
	"/assets/dashboard.vendor-3Zk_zWGK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aca-luxrDQjGhYQDsIXHqlTzV2ByFm8\"",
		"mtime": "2026-10-12T11:07:11.432Z",
		"size": 6858,
		"path": "../public/assets/dashboard.vendor-3Zk_zWGK.js"
	},
	"/assets/Charts-B_3Wsh_T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce28-fh41Ru3Nb8kwfVrBTvziyR72kR8\"",
		"mtime": "2026-10-12T11:07:11.398Z",
		"size": 380456,
		"path": "../public/assets/Charts-B_3Wsh_T.js"
	},
	"/assets/dashboards-CGFCp_ZF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6dd-rHrpQRZ2J0kb4xKdlUx9M2qByQA\"",
		"mtime": "2026-10-12T11:07:11.436Z",
		"size": 1757,
		"path": "../public/assets/dashboards-CGFCp_ZF.js"
	},
	"/assets/eye-DxIdmav9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-m1nINxNhkD/kUBF6iQ2HO2X0L5o\"",
		"mtime": "2026-10-12T11:07:11.437Z",
		"size": 244,
		"path": "../public/assets/eye-DxIdmav9.js"
	},
	"/assets/DashboardShell-DUATbdaC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11bc-yQkniSADY1QMHxA5XK9vH6LQAUQ\"",
		"mtime": "2026-10-12T11:07:11.398Z",
		"size": 4540,
		"path": "../public/assets/DashboardShell-DUATbdaC.js"
	},
	"/assets/dashboard.customer-6ME6-Or_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c1217-8aQs29G4pO9CxtqhatKNsVnGKFE\"",
		"mtime": "2026-10-12T11:07:11.426Z",
		"size": 791063,
		"path": "../public/assets/dashboard.customer-6ME6-Or_.js"
	},
	"/assets/garage-fsG3woyj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ab-3Z6iXLwoaCluYhA4c0RkNjVDZO4\"",
		"mtime": "2026-10-12T11:07:11.437Z",
		"size": 4523,
		"path": "../public/assets/garage-fsG3woyj.js"
	},
	"/assets/layout-grid-DY8QJYuG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-HZ9dDp7RyryO0gQFvI7LutONep4\"",
		"mtime": "2026-10-12T11:07:11.442Z",
		"size": 334,
		"path": "../public/assets/layout-grid-DY8QJYuG.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-12T11:07:11.481Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/LiveMap-l1nD5zA2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b73-eYlU7q16qONMaxE7vf+4C6sPy0A\"",
		"mtime": "2026-10-12T11:07:11.399Z",
		"size": 2931,
		"path": "../public/assets/LiveMap-l1nD5zA2.js"
	},
	"/assets/lock-IP_raKe8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-2VQrzFQw9Vm7TgeHzbsHDVkZntM\"",
		"mtime": "2026-10-12T11:07:11.444Z",
		"size": 194,
		"path": "../public/assets/lock-IP_raKe8.js"
	},
	"/assets/login-B1TeeFt0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2676-qRBtxnENHtULt5M0jJZjI5gbWIo\"",
		"mtime": "2026-10-12T11:07:11.444Z",
		"size": 9846,
		"path": "../public/assets/login-B1TeeFt0.js"
	},
	"/assets/mic-DdKKYlby.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df-7ymPs4GSA4Hhe0V3X/XXO9P4FhE\"",
		"mtime": "2026-10-12T11:07:11.445Z",
		"size": 223,
		"path": "../public/assets/mic-DdKKYlby.js"
	},
	"/assets/navigation-CN0bel5m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"88-5f2HOcVZQySfUu2gB4Bcu3NFw+c\"",
		"mtime": "2026-10-12T11:07:11.448Z",
		"size": 136,
		"path": "../public/assets/navigation-CN0bel5m.js"
	},
	"/assets/orders-CY8l5JZR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"727-t/8NQ0X32OZtO7gQofedKPDty+k\"",
		"mtime": "2026-10-12T11:07:11.449Z",
		"size": 1831,
		"path": "../public/assets/orders-CY8l5JZR.js"
	},
	"/assets/map-pin-B_3hfDo9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-9LNuJzqf4a/19zuGZ7SnwxTEMVs\"",
		"mtime": "2026-10-12T11:07:11.445Z",
		"size": 247,
		"path": "../public/assets/map-pin-B_3hfDo9.js"
	},
	"/assets/index-Bb5svZtp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64c65-3f9lv6gF95hCqyTyvrt94aYdemk\"",
		"mtime": "2026-10-12T11:07:11.397Z",
		"size": 412773,
		"path": "../public/assets/index-Bb5svZtp.js"
	},
	"/assets/phone-CTK2WoeV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6-G13x7+JEBfuoobWdHQDU4clFAvo\"",
		"mtime": "2026-10-12T11:07:11.449Z",
		"size": 470,
		"path": "../public/assets/phone-CTK2WoeV.js"
	},
	"/assets/preload-helper-D5oPwcmT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ef-/aaHZk2kGzie2iVCowRfP4t6fwM\"",
		"mtime": "2026-10-12T11:07:11.450Z",
		"size": 5615,
		"path": "../public/assets/preload-helper-D5oPwcmT.js"
	},
	"/assets/product._id-BAFpaWYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"481-YHYhRuVAawLNQw03vyo0QFjBG2w\"",
		"mtime": "2026-10-12T11:07:11.453Z",
		"size": 1153,
		"path": "../public/assets/product._id-BAFpaWYF.js"
	},
	"/assets/product._id-D15_7sI8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13dc-DpkGXwRGqRmsotoDs71PPVd++vE\"",
		"mtime": "2026-10-12T11:07:11.456Z",
		"size": 5084,
		"path": "../public/assets/product._id-D15_7sI8.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-12T11:07:11.482Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/shield-check-BaGDJQjb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-F/yD90KQhE0ywu6N0qB+MQI5n5k\"",
		"mtime": "2026-10-12T11:07:11.460Z",
		"size": 308,
		"path": "../public/assets/shield-check-BaGDJQjb.js"
	},
	"/assets/routes-SasZaXr9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"309f-z5ru1OWVyR4dbalXzp0W1W9Ui08\"",
		"mtime": "2026-10-12T11:07:11.457Z",
		"size": 12447,
		"path": "../public/assets/routes-SasZaXr9.js"
	},
	"/assets/shop-BajrVQ5Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2b-Wwwii4QHiUzQ+xoYdxLyYc1cLw0\"",
		"mtime": "2026-10-12T11:07:11.461Z",
		"size": 6699,
		"path": "../public/assets/shop-BajrVQ5Q.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-12T11:07:11.486Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/SiteLayout-BIT7pmMD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29ea-4yjvZhr0MA9IND9iwcnVmUzq7Ic\"",
		"mtime": "2026-10-12T11:07:11.399Z",
		"size": 10730,
		"path": "../public/assets/SiteLayout-BIT7pmMD.js"
	},
	"/assets/shopping-bag-a3kpdVWH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-a+Y0pGYUFP1j+xmDJ+uO8lWFmtQ\"",
		"mtime": "2026-10-12T11:07:11.462Z",
		"size": 328,
		"path": "../public/assets/shopping-bag-a3kpdVWH.js"
	},
	"/assets/rider-CxFpmyvi.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a6e1-TzcSK9202J+eYGEGQBjAJsGuB9k\"",
		"mtime": "2026-10-12T11:07:11.484Z",
		"size": 173793,
		"path": "../public/assets/rider-CxFpmyvi.jpg"
	},
	"/assets/riderzpro-logo-CWZDaQYu.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-12T11:07:11.485Z",
		"size": 190454,
		"path": "../public/assets/riderzpro-logo-CWZDaQYu.png"
	},
	"/assets/sliders-horizontal-lylijl0n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19c-Y8mqWQG+mT6Nrr1jgaaeLPLUpMk\"",
		"mtime": "2026-10-12T11:07:11.463Z",
		"size": 412,
		"path": "../public/assets/sliders-horizontal-lylijl0n.js"
	},
	"/assets/store-B_me3z2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-7UXsuTXe60VsO0ELsZW1Ab80vgg\"",
		"mtime": "2026-10-12T11:07:11.464Z",
		"size": 486,
		"path": "../public/assets/store-B_me3z2-.js"
	},
	"/assets/sparkles-B1QEcDcR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"252-xVzg6oWdyfK/8VpCYzIPdvjgj2E\"",
		"mtime": "2026-10-12T11:07:11.463Z",
		"size": 594,
		"path": "../public/assets/sparkles-B1QEcDcR.js"
	},
	"/assets/track._id-7q4WkftY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1295-TXLyFd0HCQ4LV6T6YlvIEG3/Jyg\"",
		"mtime": "2026-10-12T11:07:11.465Z",
		"size": 4757,
		"path": "../public/assets/track._id-7q4WkftY.js"
	},
	"/assets/styles-DH5UosZ9.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1d038-kmxwm9Y8I9cK9qi0L0ANAItAx44\"",
		"mtime": "2026-10-12T11:07:11.486Z",
		"size": 118840,
		"path": "../public/assets/styles-DH5UosZ9.css"
	},
	"/assets/trash-2-wZ6ZTbEr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"252-LTgNUw7kXrb5O+sNYS+IUSEFYrw\"",
		"mtime": "2026-10-12T11:07:11.466Z",
		"size": 594,
		"path": "../public/assets/trash-2-wZ6ZTbEr.js"
	},
	"/assets/truck-MtpoN1hA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a-08Lh+Ye9pjcILKWMWMJOJs5P3aQ\"",
		"mtime": "2026-10-12T11:07:11.467Z",
		"size": 394,
		"path": "../public/assets/truck-MtpoN1hA.js"
	},
	"/assets/useNavigate-CSND6Cq0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-PHYaCFjo8Jxy4Glg1FN/Dntw5us\"",
		"mtime": "2026-10-12T11:07:11.468Z",
		"size": 186,
		"path": "../public/assets/useNavigate-CSND6Cq0.js"
	},
	"/assets/user-DwQLc_zE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-uzuexdJzJ6uT2mxCxMM2B70LH1E\"",
		"mtime": "2026-10-12T11:07:11.470Z",
		"size": 320,
		"path": "../public/assets/user-DwQLc_zE.js"
	},
	"/assets/wrench-BKiVpqpy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-tBDgsmzUDYjGUkO/Uudyhj973oE\"",
		"mtime": "2026-10-12T11:07:11.471Z",
		"size": 291,
		"path": "../public/assets/wrench-BKiVpqpy.js"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-12T10:31:58.020Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-12T10:31:58.026Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-12T10:31:58.033Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-12T10:31:58.028Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-12T10:31:58.033Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-12T10:31:58.028Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-12T10:31:58.031Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-12T10:31:58.043Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-12T10:31:58.041Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-12T10:31:58.037Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-12T10:31:58.035Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-12T10:31:58.039Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-12T10:31:58.056Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-12T10:31:58.045Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-12T10:31:58.049Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-12T10:31:58.049Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-12T10:31:58.051Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-12T10:31:58.051Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-12T10:31:58.063Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-12T10:31:58.070Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-12T10:31:58.064Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-12T10:31:58.073Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-12T10:31:58.067Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-12T10:31:58.061Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-12T10:31:58.078Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-12T10:31:58.077Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-12T10:31:58.078Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-12T10:31:58.089Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-12T10:31:58.100Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-12T10:31:58.091Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T10:31:58.118Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-12T10:31:58.078Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T10:31:58.097Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T10:31:58.113Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-12T10:31:58.137Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T10:31:58.132Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T10:31:58.121Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T10:31:58.132Z",
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
var _lazy_fboKtm = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_fboKtm
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
