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
		"mtime": "2026-10-12T07:11:09.582Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-12T07:11:09.582Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T07:11:09.582Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/arrow-right-BB-BmcbZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-7wecYebYZBFwP7VEl55Osa2plks\"",
		"mtime": "2026-10-12T09:15:34.804Z",
		"size": 153,
		"path": "../public/assets/arrow-right-BB-BmcbZ.js"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-12T09:15:34.909Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-12T09:15:34.911Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/assets/assistant-C22mPbnS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"153a-YX3L6khjFznxwfPexnSwkuLR1L8\"",
		"mtime": "2026-10-12T09:15:34.805Z",
		"size": 5434,
		"path": "../public/assets/assistant-C22mPbnS.js"
	},
	"/assets/bike-B4BUVgFI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-J0HqQ4xRWl528fUx4ZFQJ1nI9DU\"",
		"mtime": "2026-10-12T09:15:34.806Z",
		"size": 276,
		"path": "../public/assets/bike-B4BUVgFI.js"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-12T09:15:34.911Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/cart-0mOTTO5z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16f0-TWuMllZJtBBH8dj/cqwYqUDagCg\"",
		"mtime": "2026-10-12T09:15:34.807Z",
		"size": 5872,
		"path": "../public/assets/cart-0mOTTO5z.js"
	},
	"/assets/bits-Nf20LLOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fad3-DQ4rWtEv4O8jQUtjy7ZLDp5gajI\"",
		"mtime": "2026-10-12T09:15:34.806Z",
		"size": 64211,
		"path": "../public/assets/bits-Nf20LLOo.js"
	},
	"/assets/clock-MpCX7dh3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-G8VNEVlcIE7/Mo7gIUbBT5/++Hs\"",
		"mtime": "2026-10-12T09:15:34.809Z",
		"size": 157,
		"path": "../public/assets/clock-MpCX7dh3.js"
	},
	"/assets/check-BeR4j51x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70-cI+4d05vxHsq7N6t2R+adNEA1Tg\"",
		"mtime": "2026-10-12T09:15:34.807Z",
		"size": 112,
		"path": "../public/assets/check-BeR4j51x.js"
	},
	"/assets/dashboard.admin-weWlWIdq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19ca-L5usQ4w4ftOLlCqv0Gz9s3LkGmU\"",
		"mtime": "2026-10-12T09:15:34.809Z",
		"size": 6602,
		"path": "../public/assets/dashboard.admin-weWlWIdq.js"
	},
	"/assets/dashboard.rider-FZpfBzBM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a7-cHbhAlXJcAEBiMv/Ow4U/E++1tU\"",
		"mtime": "2026-10-12T09:15:34.811Z",
		"size": 5031,
		"path": "../public/assets/dashboard.rider-FZpfBzBM.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-12T09:15:34.912Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/dashboard.vendor-BlxvlZC2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bf2-4jBohGFp/t7Nj3PEzrmes1WQVw4\"",
		"mtime": "2026-10-12T09:15:34.811Z",
		"size": 7154,
		"path": "../public/assets/dashboard.vendor-BlxvlZC2.js"
	},
	"/assets/dashboard.workshop-EdWw4oiK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f9-XGat1YxqZx+0orL1RdvIcCC+r50\"",
		"mtime": "2026-10-12T09:15:34.815Z",
		"size": 5625,
		"path": "../public/assets/dashboard.workshop-EdWw4oiK.js"
	},
	"/assets/dashboards-Cr3dM3dp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6fb-HhrOKDh6wx4/zP2JG0jcZgQW7es\"",
		"mtime": "2026-10-12T09:15:34.816Z",
		"size": 1787,
		"path": "../public/assets/dashboards-Cr3dM3dp.js"
	},
	"/assets/garage-CKxPzkRk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d6-uW+jLruD/5AGjSr+Mka2PzuPqvA\"",
		"mtime": "2026-10-12T09:15:34.818Z",
		"size": 5078,
		"path": "../public/assets/garage-CKxPzkRk.js"
	},
	"/assets/DashboardShell-C1c5L40S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121f-Sacd6IT9/+whtF5i62BWYhqXfDs\"",
		"mtime": "2026-10-12T09:15:34.800Z",
		"size": 4639,
		"path": "../public/assets/DashboardShell-C1c5L40S.js"
	},
	"/assets/house-V7CtgylD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-myVk/dTd3J0vx79VSy6sVbHz1ws\"",
		"mtime": "2026-10-12T09:15:34.818Z",
		"size": 269,
		"path": "../public/assets/house-V7CtgylD.js"
	},
	"/assets/Charts-CVpDKZ6t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cd32-Vjyo2gtdbcAs6b5xx77OBoblhj4\"",
		"mtime": "2026-10-12T09:15:34.798Z",
		"size": 380210,
		"path": "../public/assets/Charts-CVpDKZ6t.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-12T09:15:34.912Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/dashboard.customer-y_XOojJh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c6fb-rll387K9p2r352AoUC9NPG/Bjk8\"",
		"mtime": "2026-10-12T09:15:34.811Z",
		"size": 640763,
		"path": "../public/assets/dashboard.customer-y_XOojJh.js"
	},
	"/assets/indian-rupee-DD3Ze-1h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-qkXfJNfjqdEe00IAji7rTbGZRTY\"",
		"mtime": "2026-10-12T09:15:34.820Z",
		"size": 279,
		"path": "../public/assets/indian-rupee-DD3Ze-1h.js"
	},
	"/assets/layout-grid-BbelV6ug.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-Kc9DUUbNG8YUhLE164sFJoFj5Pg\"",
		"mtime": "2026-10-12T09:15:34.821Z",
		"size": 334,
		"path": "../public/assets/layout-grid-BbelV6ug.js"
	},
	"/assets/LiveMap-BGdJbqMG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"abc-fk6/7HbyTXzGbXkCvGsTJAqc0M4\"",
		"mtime": "2026-10-12T09:15:34.801Z",
		"size": 2748,
		"path": "../public/assets/LiveMap-BGdJbqMG.js"
	},
	"/assets/login-BD4zghgX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64e-qmeqfp5W48ZDnKksS1Vvk6aa/BE\"",
		"mtime": "2026-10-12T09:15:34.822Z",
		"size": 1614,
		"path": "../public/assets/login-BD4zghgX.js"
	},
	"/assets/orders-bTQBDvcl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"729-PDrPw/bYDGFwsEsM9lfrouk9hyc\"",
		"mtime": "2026-10-12T09:15:34.823Z",
		"size": 1833,
		"path": "../public/assets/orders-bTQBDvcl.js"
	},
	"/assets/package-BC1R3h4E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"168-jRJLKqsoEHur3/06fJe+sa/YIok\"",
		"mtime": "2026-10-12T09:15:34.824Z",
		"size": 360,
		"path": "../public/assets/package-BC1R3h4E.js"
	},
	"/assets/map-pin-Q04Xs7NI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-09ZPepXw2VQVM31aAdD/hxuSU9c\"",
		"mtime": "2026-10-12T09:15:34.822Z",
		"size": 247,
		"path": "../public/assets/map-pin-Q04Xs7NI.js"
	},
	"/assets/plus-DyAxn_Fb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-Qcaxr3pwBjJwrHOy9iz4bL1COpQ\"",
		"mtime": "2026-10-12T09:15:34.824Z",
		"size": 141,
		"path": "../public/assets/plus-DyAxn_Fb.js"
	},
	"/assets/preload-helper-aMSfQ1di.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ef-GCoiG+5j6j5X2JB8i5o9kQmYcdk\"",
		"mtime": "2026-10-12T09:15:34.825Z",
		"size": 5615,
		"path": "../public/assets/preload-helper-aMSfQ1di.js"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-12T09:15:34.918Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/index-DmpEewwo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5eb4d-DYPHFSW1xUgdsnainVM5tfxOUfA\"",
		"mtime": "2026-10-12T09:15:34.798Z",
		"size": 387917,
		"path": "../public/assets/index-DmpEewwo.js"
	},
	"/assets/product._id-CWxMteMy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"573-PaZfRNI5P1O/x66ml3oaj169gqI\"",
		"mtime": "2026-10-12T09:15:34.827Z",
		"size": 1395,
		"path": "../public/assets/product._id-CWxMteMy.js"
	},
	"/assets/product._id-DP0UobDq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e1-4nqXDOplCAQ4jT1loqWPtsxRA3M\"",
		"mtime": "2026-10-12T09:15:34.828Z",
		"size": 5089,
		"path": "../public/assets/product._id-DP0UobDq.js"
	},
	"/assets/rider-bRsPXdX4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32-rKvvO4sMzouy3NfPQlmCaSswPiw\"",
		"mtime": "2026-10-12T09:15:34.829Z",
		"size": 50,
		"path": "../public/assets/rider-bRsPXdX4.js"
	},
	"/assets/routes-B96xhLE-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"480c-2agG4Ptf6qf5YQjDWUDeWi+CRBI\"",
		"mtime": "2026-10-12T09:15:34.882Z",
		"size": 18444,
		"path": "../public/assets/routes-B96xhLE-.js"
	},
	"/assets/scooter-CZ6yA7ji.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34-vksVbD1nXryDaFLJu3rjSd+8QnE\"",
		"mtime": "2026-10-12T09:15:34.885Z",
		"size": 52,
		"path": "../public/assets/scooter-CZ6yA7ji.js"
	},
	"/assets/search-D6PLItYd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-yAjfVduR9MMlZjSi3sZZTVpkx68\"",
		"mtime": "2026-10-12T09:15:34.886Z",
		"size": 162,
		"path": "../public/assets/search-D6PLItYd.js"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-12T09:15:34.920Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/shield-check-D9h5Zx9G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-ITUMsAvsl3F55yN5CA/33FefhKM\"",
		"mtime": "2026-10-12T09:15:34.886Z",
		"size": 308,
		"path": "../public/assets/shield-check-D9h5Zx9G.js"
	},
	"/assets/shop-x_9BIAnh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108b-fRuiaogpCKY2r/dWLcViEG5knII\"",
		"mtime": "2026-10-12T09:15:34.888Z",
		"size": 4235,
		"path": "../public/assets/shop-x_9BIAnh.js"
	},
	"/assets/shopping-cart-WRrm0Lg_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-QEiR+DU92UBJAn++z0TuKc9reRA\"",
		"mtime": "2026-10-12T09:15:34.894Z",
		"size": 280,
		"path": "../public/assets/shopping-cart-WRrm0Lg_.js"
	},
	"/assets/shopping-bag-Czcpl6LB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-DrwGUH24WekfzlrP42bQzGThw2c\"",
		"mtime": "2026-10-12T09:15:34.888Z",
		"size": 328,
		"path": "../public/assets/shopping-bag-Czcpl6LB.js"
	},
	"/assets/SiteLayout-BTMoV2hy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1708-bJauie+r404tRASfLebI7AnuFdw\"",
		"mtime": "2026-10-12T09:15:34.801Z",
		"size": 5896,
		"path": "../public/assets/SiteLayout-BTMoV2hy.js"
	},
	"/assets/rider-CxFpmyvi.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a6e1-TzcSK9202J+eYGEGQBjAJsGuB9k\"",
		"mtime": "2026-10-12T09:15:34.918Z",
		"size": 173793,
		"path": "../public/assets/rider-CxFpmyvi.jpg"
	},
	"/assets/sliders-horizontal-Deepll7u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19c-kJ3qPmNUUdu/z0poN69CyfgZvKQ\"",
		"mtime": "2026-10-12T09:15:34.902Z",
		"size": 412,
		"path": "../public/assets/sliders-horizontal-Deepll7u.js"
	},
	"/assets/store-C_5igAOS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-TZv8C5O5t7nOFCmVV4XnYkEaU8g\"",
		"mtime": "2026-10-12T09:15:34.903Z",
		"size": 486,
		"path": "../public/assets/store-C_5igAOS.js"
	},
	"/assets/styles-1oRVCFD0.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19d70-5acPJvWA+DgtZsWPC5/iRKkpqVM\"",
		"mtime": "2026-10-12T09:15:34.921Z",
		"size": 105840,
		"path": "../public/assets/styles-1oRVCFD0.css"
	},
	"/assets/track._id-COkKvRmd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d9-exi8FA7UrZwhW97k20x13LTG5eg\"",
		"mtime": "2026-10-12T09:15:34.904Z",
		"size": 5081,
		"path": "../public/assets/track._id-COkKvRmd.js"
	},
	"/assets/truck-B7Unge7W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a-NvHsVwkJc1Pt1wibDUwo3VTSqhM\"",
		"mtime": "2026-10-12T09:15:34.905Z",
		"size": 394,
		"path": "../public/assets/truck-B7Unge7W.js"
	},
	"/assets/useNavigate-BVYSIae8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-03MNsSHUr+FYDUxEKxq5C5zls9g\"",
		"mtime": "2026-10-12T09:15:34.905Z",
		"size": 186,
		"path": "../public/assets/useNavigate-BVYSIae8.js"
	},
	"/assets/users-DpTWtfcl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-gmqOUCboNryiph1yDojvfmSWlKg\"",
		"mtime": "2026-10-12T09:15:34.906Z",
		"size": 294,
		"path": "../public/assets/users-DpTWtfcl.js"
	},
	"/assets/wallet-DvXZXuc3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-ovoq7SrPZlOZ5rFysbishSOQE4g\"",
		"mtime": "2026-10-12T09:15:34.907Z",
		"size": 274,
		"path": "../public/assets/wallet-DvXZXuc3.js"
	},
	"/assets/wrench-C0Uw8sLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-y12xBQYl8Z0ALoQFD5uPYuR71ak\"",
		"mtime": "2026-10-12T09:15:34.908Z",
		"size": 291,
		"path": "../public/assets/wrench-C0Uw8sLp.js"
	},
	"/assets/x-WMoyqAfF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-5N5HRV59Ms5musm8V1GmmmJzljg\"",
		"mtime": "2026-10-12T09:15:34.909Z",
		"size": 142,
		"path": "../public/assets/x-WMoyqAfF.js"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-12T09:11:28.034Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/assets/workshop-Dml3A2bw.jpg": {
		"type": "image/jpeg",
		"etag": "\"27d25-vJh05HWgC6L7nvrfu53MmEhdu5I\"",
		"mtime": "2026-10-12T09:15:34.922Z",
		"size": 163109,
		"path": "../public/assets/workshop-Dml3A2bw.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-12T09:11:28.039Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-12T09:11:28.042Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-12T09:11:28.028Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-12T09:11:28.036Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-12T09:11:28.045Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-12T09:11:28.043Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-12T09:11:28.040Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-12T09:11:28.026Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-12T09:11:28.048Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-12T09:11:28.021Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-12T09:11:28.031Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-12T09:11:28.032Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-12T09:11:28.050Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-12T09:11:28.037Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-12T09:11:28.023Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-12T09:11:28.020Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-12T09:11:28.025Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-12T09:11:28.047Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-12T09:11:28.067Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-12T09:11:28.078Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-12T09:11:28.052Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-12T09:11:28.097Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-12T09:11:28.113Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-12T09:11:28.100Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-12T09:11:28.104Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T09:11:28.071Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-12T09:11:28.077Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-12T09:11:28.088Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-12T09:11:28.106Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-12T09:11:28.081Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-12T09:11:28.075Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T09:11:28.093Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T09:11:28.109Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T09:11:28.063Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0350/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-12T09:11:28.121Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-12T09:11:28.085Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-12T09:11:28.089Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
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
