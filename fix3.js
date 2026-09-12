
const fs = require("fs");
let html = fs.readFileSync("src/app/admin/attempt-detail/attempt-detail.html", "utf8");
html = html.replace(/vehicleeCondition/g, "vehicleCondition");
html = html.replace(/vehicleeDocs/g, "vehicleDocs");
html = html.replace(/vehicleeChecklist/g, "vehicleChecklist");
html = html.replace(/circlee/g, "circle");
html = html.replace(/ArrGter/g, "Arrêter");
html = html.replace(/class/g, "class");
html = html.replace(/vehicle/g, "vehicle");
html = html.replace(/click/g, "click");
html = html.replace(/vido/g, "vidéo");
html = html.replace(/vhicule/g, "véhicule");
html = html.replace(/supplmentaire/g, "supplémentaire");
html = html.replace(/sign/g, "signé");
html = html.replace(/rfrence/g, "référence");
fs.writeFileSync("src/app/admin/attempt-detail/attempt-detail.html", html, "utf8");

