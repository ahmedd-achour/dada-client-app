const fs = require('fs');
let html = fs.readFileSync('src/app/admin/attempt-detail/attempt-detail.html', 'utf8');

// Fix broken words caused by "cl" -> "clé" replacement
const fixes = [
  // class, click, circle, checklist, clé (keep actual clé for ai-hint text)
  ['cléass', 'class'],
  ['cléick', 'click'],
  ['circléee', 'circle'],
  ['circlee', 'circle'],
  ['checkléist', 'checklist'],
  ['cléient', 'client'],
  ['cléear', 'clear'],
  ['incléudes', 'includes'],
  ['cléose', 'close'],
  ['cancéle', 'cancel'],
  // vehicle* fixes
  ['vehicléee-picker', 'vehicle-picker'],
  ['vehicleé-picker', 'vehicle-picker'],
  ['vehiclee-picker', 'vehicle-picker'],
  ['app-vehiclee-picker', 'app-vehicle-picker'],
  ['app-vehicléee-picker', 'app-vehicle-picker'],
  ['vehicleeCondition', 'vehicleCondition'],
  ['vehicleeDocs', 'vehicleDocs'],
  ['vehicleeChecklist', 'vehicleChecklist'],
  ['savingVehiclee', 'savingVehicle'],
  ['savingVehicle\u00e9e', 'savingVehicle'],
  ['saveVehiclee', 'saveVehicle'],
  ['saveVehicle\u00e9e', 'saveVehicle'],
  ['vehiclee', 'vehicle'],
  // circle fixes from history section  
  ['circlée', 'circle'],
  // ArrêterFix
  ['Arr\u00e9\u0638ter', 'Arr\u00eater'],
];

for (const [bad, good] of fixes) {
  html = html.split(bad).join(good);
}

// Also fix any remaining broken é inserted in wrong places
// by checking for patterns like "vehicl\uFFFDe" or multi-byte garbage
html = html.replace(/vehicl\uFFFDe/g, 'vehicle');
html = html.replace(/savingVehicl\uFFFDe/g, 'savingVehicle');
html = html.replace(/saveVehicl\uFFFDe/g, 'saveVehicle');
html = html.replace(/app-vehicl\uFFFDe-picker/g, 'app-vehicle-picker');
html = html.replace(/vehicl\uFFFDe-picker/g, 'vehicle-picker');

fs.writeFileSync('src/app/admin/attempt-detail/attempt-detail.html', html, 'utf8');
console.log('Done!');
