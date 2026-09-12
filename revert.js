
const fs = require("fs");
let html = fs.readFileSync("src/app/admin/attempt-detail/attempt-detail.html", "utf8");
html = html.replace(/cléass/g, "class");
html = html.replace(/cléick/g, "click");
html = html.replace(/cléient/g, "client");
html = html.replace(/circlé/g, "circle");
html = html.replace(/véhiclé/g, "vehicle");
html = html.replace(/vehiclé/g, "vehicle");
html = html.replace(/incléudes/g, "includes");
html = html.replace(/cléose/g, "close");
html = html.replace(/artclé/g, "article");
html = html.replace(/décléaration/g, "declaration");
fs.writeFileSync("src/app/admin/attempt-detail/attempt-detail.html", html, "utf8");

