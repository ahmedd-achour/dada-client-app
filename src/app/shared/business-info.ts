export const BUSINESS_INFO = {
  name: 'Dada Rent Car',
  phone: '+216 55 606 106',
  phoneSecondary: '+216 52 523 236',
  whatsapp: '21655606106',
  email: 'dadacar53@gmail.com',
  address: "Avenue Khaled Ibn El Walid, Près de Wifek Bank, Aouina, Tunis",
  hours: 'Lun - Dim, 08h00 - 22h00 (7j/7)',
  facebook: 'https://www.facebook.com/p/Dada-rent-car-Tunis-aouina-location-mercedes-et-voiture4x4-100083206844887/',
} as const;

export function waLink(message?: string): string {
  const base = `https://wa.me/${BUSINESS_INFO.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
