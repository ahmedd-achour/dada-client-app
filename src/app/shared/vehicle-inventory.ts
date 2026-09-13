/**
 * Fleet models. The first 16 were ported from the previous (MERN) Dada Rent Car site's
 * `dadarentcar_fleet.json` inventory export; the rest were added to grow the public catalog
 * past 50 vehicles. Booking can now target one exact model (via `FleetService.seedMissingModels`
 * syncing new entries into Firestore, and the booking modal's `presetVehicle`) as well as just
 * a `bookingCategory` (must match a FLEET_CATEGORIES name). Models added after the initial 16
 * reuse a shared placeholder image per category instead of a per-model photo.
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

  // --- Petite voiture ---
  {
    id: 'renault-symbol', brand: 'Renault', model: 'Symbol', year: 2018, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 90, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Gris' }, { transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'renault-sandero', brand: 'Renault', model: 'Sandero', year: 2020, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 85, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Rouge' }],
  },
  {
    id: 'peugeot-208', brand: 'Peugeot', model: '208', year: 2021, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 95, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Automatique', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'volkswagen-polo', brand: 'Volkswagen', model: 'Polo', year: 2019, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 100, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'seat-ibiza', brand: 'Seat', model: 'Ibiza', year: 2018, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 90, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Rouge' }],
  },
  {
    id: 'citroen-c3', brand: 'Citroën', model: 'C3', year: 2020, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 95, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'skoda-fabia', brand: 'Skoda', model: 'Fabia', year: 2018, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 90, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'nissan-micra', brand: 'Nissan', model: 'Micra', year: 2019, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/small.png', dailyFrom: 85, bookingCategory: 'Petite voiture',
    units: [{ transmission: 'Automatique', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Noir' }],
  },

  // --- Voiture standard ---
  {
    id: 'peugeot-301', brand: 'Peugeot', model: '301', year: 2019, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 100, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'toyota-yaris', brand: 'Toyota', model: 'Yaris', year: 2020, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 110, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'kia-rio', brand: 'Kia', model: 'Rio', year: 2019, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 95, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'hyundai-accent', brand: 'Hyundai', model: 'Accent', year: 2018, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 100, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Manuelle', color: 'Gris' }, { transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'citroen-c-elysee', brand: 'Citroën', model: 'C-Elysée', year: 2019, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 95, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'volkswagen-golf', brand: 'Volkswagen', model: 'Golf', year: 2018, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 120, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'renault-megane', brand: 'Renault', model: 'Mégane', year: 2019, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/medium.png', dailyFrom: 115, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'skoda-octavia', brand: 'Skoda', model: 'Octavia', year: 2019, bodyType: 'Berline', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/medium.png', dailyFrom: 120, bookingCategory: 'Voiture standard',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },

  // --- SUV ---
  {
    id: 'renault-duster', brand: 'Renault', model: 'Duster', year: 2020, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 120, bookingCategory: 'SUV',
    units: [{ transmission: 'Manuelle', color: 'Gris' }, { transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'peugeot-2008', brand: 'Peugeot', model: '2008', year: 2020, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/suv.png', dailyFrom: 115, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'hyundai-tucson', brand: 'Hyundai', model: 'Tucson', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 140, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'kia-sportage', brand: 'Kia', model: 'Sportage', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 140, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'nissan-qashqai', brand: 'Nissan', model: 'Qashqai', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/suv.png', dailyFrom: 135, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'jeep-renegade', brand: 'Jeep', model: 'Renegade', year: 2020, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/suv.png', dailyFrom: 130, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Rouge' }],
  },
  {
    id: 'jeep-compass', brand: 'Jeep', model: 'Compass', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 145, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'toyota-rav4', brand: 'Toyota', model: 'RAV4', year: 2020, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/suv.png', dailyFrom: 150, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'volkswagen-tiguan', brand: 'Volkswagen', model: 'Tiguan', year: 2019, bodyType: 'SUV', gamme: 'Standard', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 145, bookingCategory: 'SUV',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'mahindra-xuv500', brand: 'Mahindra', model: 'XUV 500', year: 2018, bodyType: 'SUV', gamme: 'Standard', seats: 7, fuel: 'Diesel',
    image: 'assets/categories/suv.png', dailyFrom: 130, bookingCategory: 'SUV',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },

  // --- 7 Places ---
  {
    id: 'peugeot-5008', brand: 'Peugeot', model: '5008', year: 2020, bodyType: 'SUV 7 places', gamme: '7 Places', seats: 7, fuel: 'Diesel',
    image: 'assets/nissan-patrol.png', dailyFrom: 230, bookingCategory: '7 Places',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'nissan-patrol', brand: 'Nissan', model: 'Patrol', year: 2019, bodyType: 'SUV 7 places', gamme: '7 Places', seats: 7, fuel: 'Essence',
    image: 'assets/nissan-patrol.png', dailyFrom: 260, bookingCategory: '7 Places',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'toyota-land-cruiser-prado', brand: 'Toyota', model: 'Land Cruiser Prado', year: 2019, bodyType: 'SUV 7 places', gamme: '7 Places', seats: 7, fuel: 'Diesel',
    image: 'assets/nissan-patrol.png', dailyFrom: 250, bookingCategory: '7 Places',
    units: [{ transmission: 'Automatique', color: 'Gris' }],
  },
  {
    id: 'hyundai-santa-fe', brand: 'Hyundai', model: 'Santa Fe', year: 2019, bodyType: 'SUV 7 places', gamme: '7 Places', seats: 7, fuel: 'Diesel',
    image: 'assets/nissan-patrol.png', dailyFrom: 220, bookingCategory: '7 Places',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },

  // --- Pickup 4x4 ---
  {
    id: 'toyota-hilux', brand: 'Toyota', model: 'Hilux', year: 2020, bodyType: 'Pickup 4x4', gamme: 'Pickup', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/4x4.png', dailyFrom: 230, bookingCategory: 'Pickup 4x4',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }, { transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'isuzu-d-max', brand: 'Isuzu', model: 'D-Max', year: 2019, bodyType: 'Pickup 4x4', gamme: 'Pickup', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/4x4.png', dailyFrom: 210, bookingCategory: 'Pickup 4x4',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'ford-ranger', brand: 'Ford', model: 'Ranger', year: 2019, bodyType: 'Pickup 4x4', gamme: 'Pickup', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/4x4.png', dailyFrom: 220, bookingCategory: 'Pickup 4x4',
    units: [{ transmission: 'Manuelle', color: 'Gris' }],
  },
  {
    id: 'mitsubishi-l200', brand: 'Mitsubishi', model: 'L200', year: 2018, bodyType: 'Pickup 4x4', gamme: 'Pickup', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/4x4.png', dailyFrom: 200, bookingCategory: 'Pickup 4x4',
    units: [{ transmission: 'Manuelle', color: 'Blanc' }],
  },

  // --- Luxe ---
  {
    id: 'mercedes-classe-c', brand: 'Mercedes', model: 'Classe C', year: 2019, bodyType: 'Berline', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'assets/categories/premium.png', dailyFrom: 350, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'bmw-serie-5', brand: 'BMW', model: 'Série 5', year: 2019, bodyType: 'Berline', gamme: 'Luxe', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/premium.png', dailyFrom: 420, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'audi-a3', brand: 'Audi', model: 'A3', year: 2019, bodyType: 'Berline', gamme: 'Luxe', seats: 5, fuel: 'Essence',
    image: 'assets/categories/premium.png', dailyFrom: 330, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },
  {
    id: 'mercedes-glc', brand: 'Mercedes', model: 'GLC', year: 2019, bodyType: 'SUV', gamme: 'Luxe', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/premium.png', dailyFrom: 450, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Noir' }],
  },
  {
    id: 'bmw-x3', brand: 'BMW', model: 'X3', year: 2019, bodyType: 'SUV', gamme: 'Luxe', seats: 5, fuel: 'Diesel',
    image: 'assets/categories/premium.png', dailyFrom: 440, bookingCategory: 'Luxe',
    units: [{ transmission: 'Automatique', color: 'Blanc' }],
  },

  // --- 2ème Parc ---
  {
    id: 'renault-clio-3', brand: 'Renault', model: 'Clio 3', year: 2010, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/second-parc.png', dailyFrom: 60, bookingCategory: '2ème Parc',
    units: [{ transmission: 'Manuelle', color: 'Gris' }, { transmission: 'Manuelle', color: 'Blanc' }],
  },
  {
    id: 'peugeot-206', brand: 'Peugeot', model: '206', year: 2008, bodyType: 'Citadine', gamme: 'Standard', seats: 5, fuel: 'Essence',
    image: 'assets/categories/second-parc.png', dailyFrom: 55, bookingCategory: '2ème Parc',
    units: [{ transmission: 'Manuelle', color: 'Bleu' }],
  },
];
