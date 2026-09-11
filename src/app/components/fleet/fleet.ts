import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';

interface FleetCategory {
  name: string;
  badge: string;
  image: string;
  seats: number;
  transmission: string;
  priceLabel: string;
  whatsappLink: string;
}

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.html',
  styleUrl: './fleet.css',
})
export class Fleet {
  protected readonly categories: FleetCategory[] = [
    {
      name: 'Petite voiture',
      badge: 'Économique',
      image: 'assets/categories/small.png',
      seats: 4,
      transmission: 'Manuelle',
      priceLabel: 'dès 79 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer une petite voiture.'),
    },
    {
      name: 'Voiture standard',
      badge: 'Le plus choisi',
      image: 'assets/categories/medium.png',
      seats: 5,
      transmission: 'Manuelle',
      priceLabel: 'dès 75 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer une voiture standard.'),
    },
    {
      name: 'SUV',
      badge: 'Confort',
      image: 'assets/categories/suv.png',
      seats: 5,
      transmission: 'Automatique',
      priceLabel: 'dès 75 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer un SUV.'),
    },
    {
      name: '7 Places',
      badge: 'Familial',
      image: 'assets/nissan-patrol.png',
      seats: 7,
      transmission: 'Automatique',
      priceLabel: 'dès 220 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer un véhicule 7 places.'),
    },
    {
      name: 'Pickup 4x4',
      badge: 'Peugeot Landtrek',
      image: 'assets/categories/4x4.png',
      seats: 5,
      transmission: 'Manuelle',
      priceLabel: 'dès 220 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer un pickup 4x4.'),
    },
    {
      name: 'Luxe',
      badge: 'Mercedes · BMW',
      image: 'assets/categories/premium.png',
      seats: 5,
      transmission: 'Automatique',
      priceLabel: 'dès 308 DT',
      whatsappLink: waLink('Bonjour, je souhaite louer un véhicule de la catégorie Luxe.'),
    },
    {
      name: '2ème Parc',
      badge: 'Petit budget',
      image: 'assets/categories/second-parc.png',
      seats: 5,
      transmission: 'Manuelle',
      priceLabel: 'nous consulter',
      whatsappLink: waLink('Bonjour, je souhaite un devis pour un véhicule du 2ème parc.'),
    },
  ];
}
