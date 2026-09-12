export interface FleetCategory {
  name: string;
  badge: string;
  image: string;
  seats: number;
  transmission: string;
  priceLabel: string;
  /** Base daily rate in DT, used for price calculations. Null when only available on quote. */
  dailyRate: number | null;
}

export const FLEET_CATEGORIES: FleetCategory[] = [
  {
    name: 'Petite voiture',
    badge: 'Économique',
    image: 'assets/categories/small.png',
    seats: 4,
    transmission: 'Manuelle',
    priceLabel: 'dès 79 DT',
    dailyRate: 79,
  },
  {
    name: 'Voiture standard',
    badge: 'Le plus choisi',
    image: 'assets/categories/medium.png',
    seats: 5,
    transmission: 'Manuelle',
    priceLabel: 'dès 75 DT',
    dailyRate: 75,
  },
  {
    name: 'SUV',
    badge: 'Confort',
    image: 'assets/categories/suv.png',
    seats: 5,
    transmission: 'Automatique',
    priceLabel: 'dès 75 DT',
    dailyRate: 75,
  },
  {
    name: '7 Places',
    badge: 'Familial',
    image: 'assets/nissan-patrol.png',
    seats: 7,
    transmission: 'Automatique',
    priceLabel: 'dès 220 DT',
    dailyRate: 220,
  },
  {
    name: 'Pickup 4x4',
    badge: 'Peugeot Landtrek',
    image: 'assets/categories/4x4.png',
    seats: 5,
    transmission: 'Manuelle',
    priceLabel: 'dès 220 DT',
    dailyRate: 220,
  },
  {
    name: 'Luxe',
    badge: 'Mercedes · BMW',
    image: 'assets/categories/premium.png',
    seats: 5,
    transmission: 'Automatique',
    priceLabel: 'dès 308 DT',
    dailyRate: 308,
  },
  {
    name: '2ème Parc',
    badge: 'Petit budget',
    image: 'assets/categories/second-parc.png',
    seats: 5,
    transmission: 'Manuelle',
    priceLabel: 'nous consulter',
    dailyRate: null,
  },
];

export function findCategory(name: string): FleetCategory | undefined {
  return FLEET_CATEGORIES.find((c) => c.name === name);
}
