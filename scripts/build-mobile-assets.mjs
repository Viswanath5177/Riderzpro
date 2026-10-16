import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPublicDir = path.join(rootDir, ".output", "public");
const distClientDir = path.join(rootDir, "dist", "client");

if (!fs.existsSync(outputPublicDir)) {
  console.error("Error: .output/public does not exist. Please run 'npm run build' first.");
  process.exit(1);
}

// Ensure dist/client exists
if (!fs.existsSync(distClientDir)) {
  fs.mkdirSync(distClientDir, { recursive: true });
}

// Copy all assets from .output/public into dist/client
fs.cpSync(outputPublicDir, distClientDir, { recursive: true, force: true });
console.log("Copied .output/public to dist/client successfully.");

// Locate main JS & CSS files in dist/client/assets
const assetsDir = path.join(distClientDir, "assets");
const assetFiles = fs.readdirSync(assetsDir);

const mainJsFile = assetFiles.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const mainCssFile = assetFiles.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!mainJsFile || !mainCssFile) {
  console.error("Error: Could not locate main JS or CSS chunk in dist/client/assets.");
  process.exit(1);
}

// Find commonly preloaded chunks
const preloadCandidates = [
  mainJsFile,
  ...assetFiles.filter(
    (f) =>
      f.endsWith(".js") &&
      (f.startsWith("jsx-runtime-") ||
        f.startsWith("link-") ||
        f.startsWith("useSelector-") ||
        f.startsWith("useRouter-") ||
        f.startsWith("seedData-") ||
        f.startsWith("createLucideIcon-") ||
        f.startsWith("not-found-"))
  ),
];

const preloadsHtml = preloadCandidates
  .map((file) => `  <link rel="modulepreload" href="/assets/${file}"/>`)
  .join("\n");

const preloadsJsArray = JSON.stringify(preloadCandidates.map((f) => `/assets/${f}`));

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <link rel="stylesheet" href="/assets/${mainCssFile}" data-precedence="default"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&amp;family=Bebas+Neue&amp;display=swap" data-precedence="default"/>
  <title>Riderzpro — EV batteries &amp; parts that fit your bike</title>
  <meta name="theme-color" content="#14161a"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <meta property="og:type" content="website"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@Lovable"/>
  <meta name="description" content="Enter your VIN or pick your EV, compare sellers, place one order across vendors and track your rider live."/>
  <meta property="og:title" content="Riderzpro — EV batteries &amp; parts that fit your bike"/>
  <meta property="og:description" content="Compare EV battery sellers, order once, track delivery live."/>
${preloadsHtml}
  <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
  <link rel="apple-touch-icon" href="/icon-192.png"/>
  <link rel="manifest" href="/manifest.webmanifest"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
</head>
<body class="bg-[#14161a] text-white">
  <div id="root"></div>
  <script>
    (function(a,f){let l;try{l=JSON.parse(sessionStorage.getItem(a)||"{}")}catch{return}const n=l?.[f||history.state?.__TSR_key];let c=!1;for(const t in n){const e=n[t],o=e?.scrollX,s=e?.scrollY;if(Number.isFinite(o)&&Number.isFinite(s)){if(t==="window")scrollTo(o,s),c=!0;else if(t)try{const r=document.querySelector(t);r&&(r.scrollLeft=o,r.scrollTop=s)}catch{}}}if(c)return;const i=location.hash.slice(1);if(i){const t=history.state?.__hashScrollIntoViewOptions??!0;if(t){const e=document.getElementById(i);e&&e.scrollIntoView(t)}return}scrollTo(0,0)})("tsr-scroll-restoration-v1_3");
  </script>
  <section aria-label="Notifications alt+T" tabindex="-1" aria-live="polite" aria-relevant="additions text" aria-atomic="false" data-react-aria-top-layer="true"></section>
  <script data-tsr-stream-part="">
    (self.$R=self.$R||{})["tsr"]=[];
    self.$_TSR={
      h(){this.hydrated=!0;this.c()},
      e(){this.streamEnded=!0;this.c()},
      c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},
      p(e){this.initialized?e():this.buffer.push(e)},
      buffer:[]
    };
    $_TSR.router=($R=>$R[0]={
      manifest:$R[1]={
        routes:$R[2]={
          __root__:$R[3]={
            preloads:$R[4]=${preloadsJsArray},
            scripts:$R[5]=[
              $R[6]={attrs:{type:"module",async:!0,src:"/assets/${mainJsFile}"}}
            ]
          }
        }
      },
      matches:$R[7]=[$R[8]={i:"__root__ ",u:Date.now(),s:"success",ssr:!0}]
    })($R["tsr"]);
    $_TSR.e();
  </script>
  <script type="module" async="" src="/assets/${mainJsFile}"></script>
</body>
</html>`;

const indexHtmlPath = path.join(distClientDir, "index.html");
fs.writeFileSync(indexHtmlPath, indexHtmlContent, "utf8");
console.log(`Generated ${indexHtmlPath} successfully with ${mainJsFile} and ${mainCssFile}.`);
