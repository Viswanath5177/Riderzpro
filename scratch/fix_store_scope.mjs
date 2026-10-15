import fs from "fs";

let content = fs.readFileSync("src/lib/store.tsx", "utf-8");

content = content.replace(
  `    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);`,
  `    try {
      const raw = localStorage.getItem(KEY);
      let storedUserEmail = "";
      let storedIsLoggedIn = false;
      if (raw) {
        const s = JSON.parse(raw);
        storedUserEmail = s?.userProfile?.email || "";
        storedIsLoggedIn = Boolean(s?.isLoggedIn);`
);

content = content.replace(
  `    try {\r\n      const raw = localStorage.getItem(KEY);\r\n      if (raw) {\r\n        const s = JSON.parse(raw);`,
  `    try {\r\n      const raw = localStorage.getItem(KEY);\r\n      let storedUserEmail = "";\r\n      let storedIsLoggedIn = false;\r\n      if (raw) {\r\n        const s = JSON.parse(raw);\r\n        storedUserEmail = s?.userProfile?.email || "";\r\n        storedIsLoggedIn = Boolean(s?.isLoggedIn);`
);

content = content.replace(
  `const emailQuery = s?.userProfile?.email ? \`?email=\${encodeURIComponent(s.userProfile.email)}\` : "";`,
  `const emailQuery = storedUserEmail ? \`?email=\${encodeURIComponent(storedUserEmail)}\` : "";`
);

content = content.replace(
  `if (d.items.length > 0 || Boolean(s?.isLoggedIn)) {`,
  `if (d.items.length > 0 || storedIsLoggedIn) {`
);

fs.writeFileSync("src/lib/store.tsx", content);
console.log("Fixed store.tsx scoping!");
