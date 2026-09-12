
const fs = require("fs");
let html = fs.readFileSync("src/app/admin/attempt-detail/attempt-detail.html", "utf8");
html = html.replace(/canclé/g, "cancel");
html = html.replace(/checkléist/g, "checklist");
html = html.replace(/cléear/g, "clear");
html = html.replace(/exclé/g, "excl");
html = html.replace(/déclé/g, "decl");
html = html.replace(/cléientDocs/g, "clientDocs");
fs.writeFileSync("src/app/admin/attempt-detail/attempt-detail.html", html, "utf8");

