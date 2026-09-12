
const fs = require("fs");
let html = fs.readFileSync("src/app/admin/attempt-detail/attempt-detail.html", "utf8");
html = html.replace(/vhicule/g, "véhicule");
html = html.replace(/cl/g, "clé");
html = html.replace(/arrive/g, "arrivée");
html = html.replace(/supplmentaire/g, "supplémentaire");
html = html.replace(/dpart/g, "départ");
html = html.replace(/Dpart/g, "Départ");
html = html.replace(/donnes/g, "données");
html = html.replace(/Donnes/g, "Données");
html = html.replace(/`\$event/g, "$$event");
fs.writeFileSync("src/app/admin/attempt-detail/attempt-detail.html", html, "utf8");

