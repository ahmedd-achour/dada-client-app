
const fs = require("fs");
let html = fs.readFileSync("src/app/admin/attempt-detail/attempt-detail.html", "utf8");
html = html.replace(/savingVehicle/g, "savingVehicle");
html = html.replace(/saveVehicle/g, "saveVehicle");
html = html.replace(/vehicle/g, "vehicle");
html = html.replace(/class/g, "class");
html = html.replace(/click/g, "click");
html = html.replace(/vehiclee-picker/g, "vehicle-picker");
html = html.replace(//g, "é");
fs.writeFileSync("src/app/admin/attempt-detail/attempt-detail.html", html, "utf8");

