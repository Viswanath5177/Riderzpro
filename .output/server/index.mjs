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
		"mtime": "2026-10-12T07:07:26.365Z",
		"size": 210,
		"path": "../public/manifest.webmanifest"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-12T07:07:26.364Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/riderzpro-logo-white-bg.png": {
		"type": "image/png",
		"etag": "\"2c9b7-B1kWO/rRNzFl6gmL0ip/w/Ffmm4\"",
		"mtime": "2026-10-13T05:20:32.632Z",
		"size": 182711,
		"path": "../public/riderzpro-logo-white-bg.png"
	},
	"/assets/arrow-right-CrqdIQCf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-XaUG5ZkJX3JfEtvUKsSKddxJEM0\"",
		"mtime": "2026-10-13T06:13:40.333Z",
		"size": 153,
		"path": "../public/assets/arrow-right-CrqdIQCf.js"
	},
	"/assets/assistant-x469mXX0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155f-OnWExaWGy2ojv4bSl44P0ae8ZYc\"",
		"mtime": "2026-10-13T06:13:40.333Z",
		"size": 5471,
		"path": "../public/assets/assistant-x469mXX0.js"
	},
	"/assets/bike-F7g9In1A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-3VBd9j7riTjjOMOlBEpHd5FN0KE\"",
		"mtime": "2026-10-13T06:13:40.339Z",
		"size": 276,
		"path": "../public/assets/bike-F7g9In1A.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-12T07:07:26.366Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/riderzpro-logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"da67-7HuvLyy5MWfdZD6jT16JOGdzBBc\"",
		"mtime": "2026-10-13T05:20:32.636Z",
		"size": 55911,
		"path": "../public/riderzpro-logo.jpg"
	},
	"/assets/battery-2-CfyVlm3O.jpg": {
		"type": "image/jpeg",
		"etag": "\"15c11-cCtEvZjFC1awn9C1RKR4acI3fDo\"",
		"mtime": "2026-10-13T06:13:40.798Z",
		"size": 89105,
		"path": "../public/assets/battery-2-CfyVlm3O.jpg"
	},
	"/riderzpro-logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:20:32.636Z",
		"size": 190454,
		"path": "../public/riderzpro-logo.png"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T05:20:32.625Z",
		"size": 190454,
		"path": "../public/logo.png"
	},
	"/assets/bits-CJYomyr9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ce0e-em+r+qeWwEuKT5R/z4/sfwTkMcw\"",
		"mtime": "2026-10-13T06:13:40.348Z",
		"size": 118286,
		"path": "../public/assets/bits-CJYomyr9.js"
	},
	"/assets/Charts-Bx6rLXuu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce28-abUeMvB9qBxE7/WiWYS9qiXATgE\"",
		"mtime": "2026-10-13T06:13:40.331Z",
		"size": 380456,
		"path": "../public/assets/Charts-Bx6rLXuu.js"
	},
	"/assets/check-LRU3eXcq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70-1JWNq4MBAfhYTIZlpBYoi6Q+WvE\"",
		"mtime": "2026-10-13T06:13:40.368Z",
		"size": 112,
		"path": "../public/assets/check-LRU3eXcq.js"
	},
	"/assets/cart-C6n4OXY8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"464a-NPjy4RwmZeHFQA4dX8jV8Y1CQxA\"",
		"mtime": "2026-10-13T06:13:40.357Z",
		"size": 17994,
		"path": "../public/assets/cart-C6n4OXY8.js"
	},
	"/assets/battery-3-BCrKU8_w.jpg": {
		"type": "image/jpeg",
		"etag": "\"18bb3-XNVTfJFGrbe3Vscm6yQZo11P3eQ\"",
		"mtime": "2026-10-13T06:13:40.806Z",
		"size": 101299,
		"path": "../public/assets/battery-3-BCrKU8_w.jpg"
	},
	"/assets/chevron-right-Dambk3V-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-SJpQOWh7iBPJviMkNyr15Q5uEiU\"",
		"mtime": "2026-10-13T06:13:40.371Z",
		"size": 118,
		"path": "../public/assets/chevron-right-Dambk3V-.js"
	},
	"/assets/dashboard.rider-BNOt3_Ig.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1337-/Zhp+x575NZuGMoe87twqCllGec\"",
		"mtime": "2026-10-13T06:13:40.394Z",
		"size": 4919,
		"path": "../public/assets/dashboard.rider-BNOt3_Ig.js"
	},
	"/assets/dashboard.vendor-2dpQx8wl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aca-3AMxvWpNYgTO8H2843g4FBTw/6s\"",
		"mtime": "2026-10-13T06:13:40.415Z",
		"size": 6858,
		"path": "../public/assets/dashboard.vendor-2dpQx8wl.js"
	},
	"/assets/battery-1-_p6elVN9.jpg": {
		"type": "image/jpeg",
		"etag": "\"118c1-Q1d+4Em2mw2Xl4970sx9ChNggHw\"",
		"mtime": "2026-10-13T06:13:40.798Z",
		"size": 71873,
		"path": "../public/assets/battery-1-_p6elVN9.jpg"
	},
	"/assets/dashboard.workshop-ptw5RPxk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1568-v2Bu3jJaX4lnWO8kPPgdZV55aPs\"",
		"mtime": "2026-10-13T06:13:40.431Z",
		"size": 5480,
		"path": "../public/assets/dashboard.workshop-ptw5RPxk.js"
	},
	"/assets/DashboardShell-B54yT2Po.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1220-FBY/wiXkFipzxAH5GuFJgEapVvo\"",
		"mtime": "2026-10-13T06:13:40.331Z",
		"size": 4640,
		"path": "../public/assets/DashboardShell-B54yT2Po.js"
	},
	"/assets/charger-vP7h56_5.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5b4-Q2/IfNuks/iedGLlCfSUb5DGdXI\"",
		"mtime": "2026-10-13T06:13:40.808Z",
		"size": 112052,
		"path": "../public/assets/charger-vP7h56_5.jpg"
	},
	"/assets/dashboards-BDm8AIes.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e2-DfgBVQALMpqEbEE2HUQxR6aoQaQ\"",
		"mtime": "2026-10-13T06:13:40.435Z",
		"size": 1762,
		"path": "../public/assets/dashboards-BDm8AIes.js"
	},
	"/assets/dashboard.customer-B7XvPwwH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3a26-gjwV2RQxv6gQTYl3YSKEVduDGNI\"",
		"mtime": "2026-10-13T06:13:40.376Z",
		"size": 801318,
		"path": "../public/assets/dashboard.customer-B7XvPwwH.js"
	},
	"/assets/garage-CMeB3is_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d0-ugZ71WHrpcJT16D+v7Hn6/47C28\"",
		"mtime": "2026-10-13T06:13:40.452Z",
		"size": 4560,
		"path": "../public/assets/garage-CMeB3is_.js"
	},
	"/assets/eye-DVanRsYC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-KN2wNblVwcMMGasYlmgopd7ocoE\"",
		"mtime": "2026-10-13T06:13:40.441Z",
		"size": 244,
		"path": "../public/assets/eye-DVanRsYC.js"
	},
	"/assets/lock-lsmJr6Jd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-ZF47SXWzpuCAdBYg0h2+R2RkDV8\"",
		"mtime": "2026-10-13T06:13:40.454Z",
		"size": 194,
		"path": "../public/assets/lock-lsmJr6Jd.js"
	},
	"/assets/layout-grid-BD7wmyT-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-OwpHEoX4c+S3TtBO6MUaC5GQ9s8\"",
		"mtime": "2026-10-13T06:13:40.453Z",
		"size": 334,
		"path": "../public/assets/layout-grid-BD7wmyT-.js"
	},
	"/assets/login-CYbLlLME.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3557-yemw/Zma6uXGyzkM6I0kR7jmYjI\"",
		"mtime": "2026-10-13T06:13:40.456Z",
		"size": 13655,
		"path": "../public/assets/login-CYbLlLME.js"
	},
	"/assets/LiveMap-D9ulGu1U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7a-nI1UBpc3DzVQ23BS5TcmyA+IYE4\"",
		"mtime": "2026-10-13T06:13:40.333Z",
		"size": 2938,
		"path": "../public/assets/LiveMap-D9ulGu1U.js"
	},
	"/assets/menu-Bxi5z58D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"243-CaObZRljDmqV7AaZokAa4FSfaNI\"",
		"mtime": "2026-10-13T06:13:40.457Z",
		"size": 579,
		"path": "../public/assets/menu-Bxi5z58D.js"
	},
	"/assets/index-knXkiVxk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64c57-jwG/7UdAtbrE3iybIrkb1FGuVtQ\"",
		"mtime": "2026-10-13T06:13:40.327Z",
		"size": 412759,
		"path": "../public/assets/index-knXkiVxk.js"
	},
	"/assets/mic-CT4ULB0s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df-d7eoxcxS3mPrnOraus0nDhRCbwE\"",
		"mtime": "2026-10-13T06:13:40.501Z",
		"size": 223,
		"path": "../public/assets/mic-CT4ULB0s.js"
	},
	"/assets/preload-helper-CAwhc1od.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ef-hE6heixk+m0+Jj9rBwybVLP5ebQ\"",
		"mtime": "2026-10-13T06:13:40.560Z",
		"size": 5615,
		"path": "../public/assets/preload-helper-CAwhc1od.js"
	},
	"/assets/orders-CtrYZDwI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"727-iAL1hN/fxsyCSoObmNyOJlaC5X8\"",
		"mtime": "2026-10-13T06:13:40.515Z",
		"size": 1831,
		"path": "../public/assets/orders-CtrYZDwI.js"
	},
	"/assets/navigation-CvJBdw6h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"88-3VP2hWEkCyWur2qwwoAAMdG34Ns\"",
		"mtime": "2026-10-13T06:13:40.502Z",
		"size": 136,
		"path": "../public/assets/navigation-CvJBdw6h.js"
	},
	"/assets/product._id-7Yf-0G95.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13dc-25xfD4o3CyQxhsY+zuiFZMBwJoE\"",
		"mtime": "2026-10-13T06:13:40.574Z",
		"size": 5084,
		"path": "../public/assets/product._id-7Yf-0G95.js"
	},
	"/assets/map-pin-D4WXKqrk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-BBlCNNwT9xr6i9MiL4tRJSi2fGk\"",
		"mtime": "2026-10-13T06:13:40.457Z",
		"size": 247,
		"path": "../public/assets/map-pin-D4WXKqrk.js"
	},
	"/assets/scan-line-Ct1FbdNx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-TxE2gemlNWagIWAkVnjNQ5lxdww\"",
		"mtime": "2026-10-13T06:13:40.594Z",
		"size": 319,
		"path": "../public/assets/scan-line-Ct1FbdNx.js"
	},
	"/assets/product._id-yskeEoGh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49d-BMZtuxrfwsEf40faNDzk7iYTYxw\"",
		"mtime": "2026-10-13T06:13:40.583Z",
		"size": 1181,
		"path": "../public/assets/product._id-yskeEoGh.js"
	},
	"/assets/shield-check-C8voDQjp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-VKXYTmn4DTm8Pw0fs6Br2fNFcMs\"",
		"mtime": "2026-10-13T06:13:40.594Z",
		"size": 308,
		"path": "../public/assets/shield-check-C8voDQjp.js"
	},
	"/assets/routes-BssF8WmG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"603f-ptCvjEMnuST+rRk65Kx8ySZIJ+c\"",
		"mtime": "2026-10-13T06:13:40.591Z",
		"size": 24639,
		"path": "../public/assets/routes-BssF8WmG.js"
	},
	"/assets/hero-bike-DadL1ogz.jpg": {
		"type": "image/jpeg",
		"etag": "\"424e8-cxKP6ccSijt7kC15rI07JAmN/zc\"",
		"mtime": "2026-10-13T06:13:40.816Z",
		"size": 271592,
		"path": "../public/assets/hero-bike-DadL1ogz.jpg"
	},
	"/assets/shop-a2YUm8gm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2b-hjJfrJlMS9GhgDy/v2HiWWj0uDI\"",
		"mtime": "2026-10-13T06:13:40.596Z",
		"size": 6699,
		"path": "../public/assets/shop-a2YUm8gm.js"
	},
	"/assets/ev-login-showcase-nZh_Lq1H.jpg": {
		"type": "image/jpeg",
		"etag": "\"b272a-Y/uO9CgSJ1uAZBm3HryjPs7qswU\"",
		"mtime": "2026-10-13T06:13:40.814Z",
		"size": 730922,
		"path": "../public/assets/ev-login-showcase-nZh_Lq1H.jpg"
	},
	"/assets/scooter-BSqdqeFM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17490-TQXKQCV33iEIKpzA5quUNNznl28\"",
		"mtime": "2026-10-13T06:13:40.818Z",
		"size": 95376,
		"path": "../public/assets/scooter-BSqdqeFM.jpg"
	},
	"/assets/parts-BjTUtiQx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f977-IxTRDpWhmCWVd34ejrq2TZLbwY0\"",
		"mtime": "2026-10-13T06:13:40.816Z",
		"size": 129399,
		"path": "../public/assets/parts-BjTUtiQx.jpg"
	},
	"/assets/shopping-bag-rISakacW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-yosykZywnHj9x5sIo1atUolHf0M\"",
		"mtime": "2026-10-13T06:13:40.597Z",
		"size": 328,
		"path": "../public/assets/shopping-bag-rISakacW.js"
	},
	"/assets/riderzpro-logo-CWZDaQYu.png": {
		"type": "image/png",
		"etag": "\"2e7f6-88kWnnivM0sxTZiVpDhVuXlxuH4\"",
		"mtime": "2026-10-13T06:13:40.816Z",
		"size": 190454,
		"path": "../public/assets/riderzpro-logo-CWZDaQYu.png"
	},
	"/assets/sliders-horizontal-Cf0ibCIV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19c-IhaQT89TfR+quZ9CUSLZ13X0tks\"",
		"mtime": "2026-10-13T06:13:40.604Z",
		"size": 412,
		"path": "../public/assets/sliders-horizontal-Cf0ibCIV.js"
	},
	"/assets/SiteLayout-DBbeyikV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b98-Drm9Y1yPyO0ENOrNKRfzuk23Iv4\"",
		"mtime": "2026-10-13T06:13:40.333Z",
		"size": 15256,
		"path": "../public/assets/SiteLayout-DBbeyikV.js"
	},
	"/assets/sparkles-D2a_xiJC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2-2H23LVrLxavEKTkRaWijzG6Zs60\"",
		"mtime": "2026-10-13T06:13:40.722Z",
		"size": 482,
		"path": "../public/assets/sparkles-D2a_xiJC.js"
	},
	"/assets/store-DWDSWCeg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-4PFlgv2pb3ingbmayhQI3TFQQrg\"",
		"mtime": "2026-10-13T06:13:40.786Z",
		"size": 486,
		"path": "../public/assets/store-DWDSWCeg.js"
	},
	"/assets/track._id-D7Uem3vS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1294-G7xJwZsokrs6V92Rfrsp2GbywYk\"",
		"mtime": "2026-10-13T06:13:40.786Z",
		"size": 4756,
		"path": "../public/assets/track._id-D7Uem3vS.js"
	},
	"/assets/useNavigate-uIOQUVTz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-tt5nXDNjltscDJE1o+su/YUhQeY\"",
		"mtime": "2026-10-13T06:13:40.789Z",
		"size": 186,
		"path": "../public/assets/useNavigate-uIOQUVTz.js"
	},
	"/assets/truck-BBJV96Cd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a-aI/66T8y9eIfDOKXnqQe/RkDvEQ\"",
		"mtime": "2026-10-13T06:13:40.788Z",
		"size": 394,
		"path": "../public/assets/truck-BBJV96Cd.js"
	},
	"/assets/user-C6fRNLHA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c5-zZmHLT9YS2V98DqKrI/NWZ6MHEA\"",
		"mtime": "2026-10-13T06:13:40.790Z",
		"size": 453,
		"path": "../public/assets/user-C6fRNLHA.js"
	},
	"/assets/trash-2-BBXdda6n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-LXzWQlGtJe8IIpU2qg09gD+vEAs\"",
		"mtime": "2026-10-13T06:13:40.788Z",
		"size": 316,
		"path": "../public/assets/trash-2-BBXdda6n.js"
	},
	"/assets/wrench-B_SOkwTs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-6aNDWugmzU+PUUez3By+1ks88Nk\"",
		"mtime": "2026-10-13T06:13:40.793Z",
		"size": 291,
		"path": "../public/assets/wrench-B_SOkwTs.js"
	},
	"/assets/styles-CAnuGsQk.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"22696-PCn1xbrctjXfDxj5WPGJY96gVJI\"",
		"mtime": "2026-10-13T06:13:40.818Z",
		"size": 140950,
		"path": "../public/assets/styles-CAnuGsQk.css"
	},
	"/assets/workshop-Dml3A2bw.jpg": {
		"type": "image/jpeg",
		"etag": "\"27d25-vJh05HWgC6L7nvrfu53MmEhdu5I\"",
		"mtime": "2026-10-13T06:13:40.820Z",
		"size": 163109,
		"path": "../public/assets/workshop-Dml3A2bw.jpg"
	},
	"/catalogue/images/RZP-0302/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"43f6-5p6dpjtX7PQKIBk/ZSiOwmA9FiE\"",
		"mtime": "2026-10-13T05:20:32.488Z",
		"size": 17398,
		"path": "../public/catalogue/images/RZP-0302/01.jpg"
	},
	"/catalogue/images/RZP-0301/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4441-/tV+WUaq6UgzVk4k4crbwz+E7qE\"",
		"mtime": "2026-10-13T05:20:32.488Z",
		"size": 17473,
		"path": "../public/catalogue/images/RZP-0301/01.jpg"
	},
	"/catalogue/images/RZP-0308/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4361-GXQQMoNxPnSnAZAo+NZRjGi/tzk\"",
		"mtime": "2026-10-13T05:20:32.499Z",
		"size": 17249,
		"path": "../public/catalogue/images/RZP-0308/01.jpg"
	},
	"/catalogue/images/RZP-0304/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42ff-Co6Z4DWpybWTGwz1p3DftYJ4DBo\"",
		"mtime": "2026-10-13T05:20:32.498Z",
		"size": 17151,
		"path": "../public/catalogue/images/RZP-0304/01.jpg"
	},
	"/catalogue/images/RZP-0303/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4432-vKTyyvpmPlyi9h77CJO8q1AZMxE\"",
		"mtime": "2026-10-13T05:20:32.495Z",
		"size": 17458,
		"path": "../public/catalogue/images/RZP-0303/01.jpg"
	},
	"/catalogue/images/RZP-0309/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4257-yzCHpDha/i1VKqlz+RViXPRWMJY\"",
		"mtime": "2026-10-13T05:20:32.503Z",
		"size": 16983,
		"path": "../public/catalogue/images/RZP-0309/01.jpg"
	},
	"/catalogue/images/RZP-0305/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4295-HgQQtuo3JBKm8eFJWJQLDOUT+bM\"",
		"mtime": "2026-10-13T05:20:32.499Z",
		"size": 17045,
		"path": "../public/catalogue/images/RZP-0305/01.jpg"
	},
	"/catalogue/images/RZP-0310/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4384-eph8nqnLNjh65D4tLJBtG+Pyapg\"",
		"mtime": "2026-10-13T05:20:32.503Z",
		"size": 17284,
		"path": "../public/catalogue/images/RZP-0310/01.jpg"
	},
	"/catalogue/images/RZP-0315/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4742-rSmIllLnJC3cvg1tNzgowJLCVUU\"",
		"mtime": "2026-10-13T05:20:32.514Z",
		"size": 18242,
		"path": "../public/catalogue/images/RZP-0315/01.jpg"
	},
	"/catalogue/images/RZP-0312/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"431e-1H7rsyYhRPUAZlDTQUC/eGSENL4\"",
		"mtime": "2026-10-13T05:20:32.503Z",
		"size": 17182,
		"path": "../public/catalogue/images/RZP-0312/01.jpg"
	},
	"/catalogue/images/RZP-0314/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48f2-+A01kvmKNPDMWA2BitxYVhjPkW8\"",
		"mtime": "2026-10-13T05:20:32.514Z",
		"size": 18674,
		"path": "../public/catalogue/images/RZP-0314/01.jpg"
	},
	"/catalogue/images/RZP-0316/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-i1Z41NfJ0VzuYgNWMIRf3hXgGWQ\"",
		"mtime": "2026-10-13T05:20:32.518Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0316/01.jpg"
	},
	"/catalogue/images/RZP-0318/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4734-hqFuluPyRuRK2tiX0yYZSHb4nxA\"",
		"mtime": "2026-10-13T05:20:32.519Z",
		"size": 18228,
		"path": "../public/catalogue/images/RZP-0318/01.jpg"
	},
	"/catalogue/images/RZP-0322/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45ff-EEi6i6t1XJJXLAGQwL8QYcspgBA\"",
		"mtime": "2026-10-13T05:20:32.537Z",
		"size": 17919,
		"path": "../public/catalogue/images/RZP-0322/01.jpg"
	},
	"/catalogue/images/RZP-0313/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4522-okGfzG/XOBj4p2iVNF35j44o+jU\"",
		"mtime": "2026-10-13T05:20:32.510Z",
		"size": 17698,
		"path": "../public/catalogue/images/RZP-0313/01.jpg"
	},
	"/catalogue/images/RZP-0319/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"48a5-J5WHDLHNAixS6vyCDJTzHww3+Mk\"",
		"mtime": "2026-10-13T05:20:32.527Z",
		"size": 18597,
		"path": "../public/catalogue/images/RZP-0319/01.jpg"
	},
	"/catalogue/images/RZP-0323/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"4403-WeH5Loi72zdzi0A72u3NdtyVmR4\"",
		"mtime": "2026-10-13T05:20:32.539Z",
		"size": 17411,
		"path": "../public/catalogue/images/RZP-0323/01.jpg"
	},
	"/catalogue/images/RZP-0335/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed4d-y5y4eGtDanOW5YViA0j0ymkL0uM\"",
		"mtime": "2026-10-13T05:20:32.541Z",
		"size": 60749,
		"path": "../public/catalogue/images/RZP-0335/01.jpg"
	},
	"/catalogue/images/RZP-0321/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"42b0-Gm9lCU2VPdAzs45TOWCBFm9kIJg\"",
		"mtime": "2026-10-13T05:20:32.537Z",
		"size": 17072,
		"path": "../public/catalogue/images/RZP-0321/01.jpg"
	},
	"/catalogue/images/RZP-0337/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"118b5-uHBHSXBuvwpw5KN6kHJ7izJvKcc\"",
		"mtime": "2026-10-13T05:20:32.545Z",
		"size": 71861,
		"path": "../public/catalogue/images/RZP-0337/01.jpg"
	},
	"/catalogue/images/RZP-0340/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"a9f6-Ot/7zdxytgh4eIP7+zXp3//Ekbo\"",
		"mtime": "2026-10-13T05:20:32.551Z",
		"size": 43510,
		"path": "../public/catalogue/images/RZP-0340/01.jpg"
	},
	"/catalogue/images/RZP-0336/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"10fe6-3BzIudsBwbPW/29AXHM8Qo5FuJ8\"",
		"mtime": "2026-10-13T05:20:32.543Z",
		"size": 69606,
		"path": "../public/catalogue/images/RZP-0336/01.jpg"
	},
	"/catalogue/images/RZP-0339/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"28f7a-45HPsjWBGPbVrRELnUmkYp1pZSM\"",
		"mtime": "2026-10-13T05:20:32.551Z",
		"size": 167802,
		"path": "../public/catalogue/images/RZP-0339/01.jpg"
	},
	"/catalogue/images/RZP-0342/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"9106-xfpsUkFZBq1mUPYvUCGkLIvt0i0\"",
		"mtime": "2026-10-13T05:20:32.557Z",
		"size": 37126,
		"path": "../public/catalogue/images/RZP-0342/01.jpg"
	},
	"/catalogue/images/RZP-0338/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"16409-rfQhkdNv5K77kEoHXoFiTMrW65Q\"",
		"mtime": "2026-10-13T05:20:32.547Z",
		"size": 91145,
		"path": "../public/catalogue/images/RZP-0338/01.jpg"
	},
	"/catalogue/images/RZP-0344/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"21392-bscfhqwd1YKX/MBTCdX36jI83ko\"",
		"mtime": "2026-10-13T05:20:32.568Z",
		"size": 136082,
		"path": "../public/catalogue/images/RZP-0344/01.jpg"
	},
	"/catalogue/images/RZP-0343/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"631ef-S1H/n8il3kB7nMDkw0yDAZ5tlVw\"",
		"mtime": "2026-10-13T05:20:32.564Z",
		"size": 405999,
		"path": "../public/catalogue/images/RZP-0343/01.jpg"
	},
	"/catalogue/images/RZP-0341/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"6370-vvp+o/wBawgzGC8ChUNYOZj4kMo\"",
		"mtime": "2026-10-13T05:20:32.555Z",
		"size": 25456,
		"path": "../public/catalogue/images/RZP-0341/01.jpg"
	},
	"/catalogue/images/RZP-0345/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:20:32.570Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0345/01.jpg"
	},
	"/catalogue/images/RZP-0349/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:20:32.601Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0349/01.jpg"
	},
	"/catalogue/images/RZP-0346/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"370f5-YMY8DyUpBQFesEHosicyKFqK3vo\"",
		"mtime": "2026-10-13T05:20:32.576Z",
		"size": 225525,
		"path": "../public/catalogue/images/RZP-0346/01.jpg"
	},
	"/catalogue/images/RZP-0348/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:20:32.593Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0348/01.jpg"
	},
	"/catalogue/images/RZP-0347/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:20:32.584Z",
		"size": 971351,
		"path": "../public/catalogue/images/RZP-0347/01.jpg"
	},
	"/catalogue/images/RZP-0352/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ca5a-GrgGN22aqfsNtvsAe/tcKNrQZk0\"",
		"mtime": "2026-10-13T05:20:32.617Z",
		"size": 51802,
		"path": "../public/catalogue/images/RZP-0352/01.jpg"
	},
	"/catalogue/images/RZP-0351/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d9ee-Nfjk646Zujgbo87T/2bJf0ByXb8\"",
		"mtime": "2026-10-13T05:20:32.617Z",
		"size": 252398,
		"path": "../public/catalogue/images/RZP-0351/01.jpg"
	},
	"/catalogue/images/RZP-0320/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"45d6-Sx0s3DBgKr5CYvnHvkcqgcFGuVk\"",
		"mtime": "2026-10-13T05:20:32.527Z",
		"size": 17878,
		"path": "../public/catalogue/images/RZP-0320/01.jpg"
	},
	"/catalogue/images/RZP-0317/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"408e-h5UlSNXYPdnt8VQnHAjyQe+Byro\"",
		"mtime": "2026-10-13T05:20:32.519Z",
		"size": 16526,
		"path": "../public/catalogue/images/RZP-0317/01.jpg"
	},
	"/catalogue/images/RZP-0350/01.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed257-fQxD7n5fblx9Y4WvjH94V2b3JHM\"",
		"mtime": "2026-10-13T05:20:32.610Z",
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
var _lazy_HMy_Sz = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_HMy_Sz
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
