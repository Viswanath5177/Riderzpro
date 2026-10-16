import fs from "fs";

const file = "src/lib/auth.tsx";
let content = fs.readFileSync(file, "utf8");

const oldStr = `  try {
    const adm = localStorage.getItem("riderzpro_admin_session");
    if (adm) {
      const parsed = JSON.parse(adm);
      if (parsed?.role) return parsed.role;
    }
    const usr = localStorage.getItem("riderzpro_auth_user");
    if (usr) {
      const parsed = JSON.parse(usr);
      if (parsed?.role) return parsed.role;
    }
  } catch {}`;

const newStr = `  try {
    const usr = localStorage.getItem("riderzpro_auth_user");
    if (usr) {
      const parsed = JSON.parse(usr);
      if (parsed?.email === "admin@riderzpro.com") return "SUPER_ADMIN";
      if (parsed?.email === "admin.operations@riderzpro.com") return "ADMIN";
      if (parsed?.role) return parsed.role;
    }
    const adm = localStorage.getItem("riderzpro_admin_session");
    if (adm) {
      const parsed = JSON.parse(adm);
      if (parsed?.user?.email === "admin@riderzpro.com") return "SUPER_ADMIN";
      if (parsed?.user?.email === "admin.operations@riderzpro.com") return "ADMIN";
      if (parsed?.role) return parsed.role;
    }
  } catch {}`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content, "utf8");
  console.log("REPLACED LF");
} else {
  const oldCrlf = oldStr.replace(/\n/g, "\r\n");
  const newCrlf = newStr.replace(/\n/g, "\r\n");
  if (content.includes(oldCrlf)) {
    content = content.replace(oldCrlf, newCrlf);
    fs.writeFileSync(file, content, "utf8");
    console.log("REPLACED CRLF");
  } else {
    console.log("STRING NOT FOUND");
  }
}
