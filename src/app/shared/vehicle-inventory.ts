/**
 * Fleet models, ported from the previous (MERN) Dada Rent Car site's
 * `dadarentcar_fleet.json` inventory export — 16 models, expanded below into one
 * entry per physical unit (37 in the source export) for the "full fleet" showcase.
 * Used only for display — booking still goes through the existing broad-category
 * flow, via `bookingCategory` mapping each model to the closest FLEET_CATEGORIES entry.
 */
export interface FleetModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  bodyType: string;
  gamme: 'Standard' | 'Luxe' | '7 Places' | 'Pickup';
  seats: number;
  fuel: 'Essence' | 'Diesel';
  image: string;
  dailyFrom: number;
  /** Preset passed to the booking modal / vehicle-picker (must match a FLEET_CATEGORIES name). */
  bookingCategory: string;
  units: { transmission: string; color: string }[];
}

export const FLEET_MODELS: FleetModel[] = [
  {
    id: 'mercedes-cla', brand: 'Mercedes', model: 'CLA', year: 2019, bodyType: 'Berline', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'assets/fleet/mercedes-cla-1.jpeg', dailyFrom: 426, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'bmw-serie-3', brand: 'BMW', model: 'Série 3', year: 2019, bodyType: 'Berline', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_G20_IMG_0167.jpg?width=800', dailyFrom: 450, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'mercedes-gla', brand: 'Mercedes', model: 'GLA', year: 2020, bodyType: 'SUV', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_H247_IMG_2600.jpg?width=800', dailyFrom: 355, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'mercedes-class-a', brand: 'Mercedes', model: 'Classe A', year: 2018, bodyType: 'Citadine', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_A_200_Monrepos_2018_IMG_0081.jpg?width=800', dailyFrom: 308, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'chevrolet-captiva', brand: 'Chevrolet', model: 'Captiva', year: 2019, bodyType: 'SUV 7 places', gamme: '7 Places', seats: 7, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Chevrolet_Captiva_Premier.jpg?width=800', dailyFrom: 213, bookingCategory: '7 Places',
    units: [
      { transmission: 'Automatique', color: 'Noir' },
      { transmission: 'Automatique', color: 'Noir' },
    ],
  },
  {
    id: 'peugeot-landtrek', brand: 'Peugeot', model: 'Landtrek', year: 2020, bodyType: 'Pickup 4x4', gamme: 'Pickup', seats: 5, fuel: 'Diesel',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Peugeot_Landtrek_01.jpg?width=800', dailyFrom: 189, bookingCategory: 'Pickup 4x4',
    units: [
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Blanc' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
    ],
  },
  {
    id: 'chery-tiggo-3', brand: 'Chery', model: 'Tiggo 3', year: 2014, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chery_Tiggo_3.jpg?width=800', dailyFrom: 114, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'chery-arrizo-vertus', brand: 'Chery', model: 'Arrizo (Vertus)', year: 2018, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chery_Arrizo_5_front.jpg?width=800', dailyFrom: 114, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'dacia-stepway', brand: 'Dacia', model: 'Stepway', year: 2021, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Dacia_Sandero_Stepway_Prestige_TCE_1.0_Front.jpg?width=800', dailyFrom: 114, bookingCategory: 'SUV',
    units: [{ transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'mahindra-xuv-300', brand: 'Mahindra', model: 'XUV 300', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_XUV300.jpg?width=800', dailyFrom: 100, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique / Manuelle', color: 'Gris' }],
  },
  {
    id: 'mahindra-kuv-k8', brand: 'Mahindra', model: 'KUV 100 / K8', year: 2016, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_KUV100_launch_(1).JPG?width=800', dailyFrom: 85, bookingCategory: 'SUV',
    units: [
      { transmission: 'Manuelle', color: 'Noir' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Blanc' },
    ],
  },
  {
    id: 'suzuki-swift', brand: 'Suzuki', model: 'Swift', year: 2023, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Suzuki_Swift_Concept.jpg?width=800', dailyFrom: 100, bookingCategory: 'Petite voiture',
    units: [
      { transmission: 'Automatique', color: 'Blanc' },
      { transmission: 'Automatique', color: 'Gris' },
    ],
  },
  {
    id: 'kia-picanto', brand: 'Kia', model: 'Picanto', year: 2017, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2017_Kia_Picanto_GT-Line_1.0.jpg?width=800', dailyFrom: 100, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'renault-clio-5', brand: 'Renault', model: 'Clio 5', year: 2019, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renault_Clio_V_Genf_2019_1Y7A5590.jpg?width=800', dailyFrom: 100, bookingCategory: 'Petite voiture',
    units: [
      { transmission: 'Manuelle', color: 'Bleu' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
    ],
  },
  {
    id: 'hyundai-i10', brand: 'Hyundai', model: 'i10', year: 2019, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_i10_(AC3;_2019).jpg?width=800', dailyFrom: 90, bookingCategory: 'Petite voiture',
    units: [
      { transmission: 'Manuelle', color: 'Vert' },
      { transmission: 'Manuelle', color: 'Vert' },
      { transmission: 'Manuelle', color: 'Vert' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Manuelle', color: 'Gris' },
      { transmission: 'Automatique', color: 'Blanc' },
      { transmission: 'Automatique', color: 'Noir' },
      { transmission: 'Automatique', color: 'Noir' },
      { transmission: 'Manuelle', color: 'Vert' },
      { transmission: 'Manuelle', color: 'Rouge' },
    ],
  },
  {
    id: 'suzuki-dzire', brand: 'Suzuki', model: 'Dzire', year: 2017, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Suzuki_Dzire.jpg?width=800', dailyFrom: 90, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Gris' }],
  },
];
