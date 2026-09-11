import { Component } from '@angular/core';

interface PricingTier {
  name: string;
  tagline: string;
  badge?: string;
  features: string[];
  featured: boolean;
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  protected readonly tiers: PricingTier[] = [
    {
      name: '1 à 6 jours',
      tagline: 'Idéal pour un court séjour ou un besoin ponctuel.',
      features: ['Tarif journalier standard', "Retrait à l'agence ou à l'aéroport", 'Annulation gratuite'],
      featured: false,
    },
    {
      name: '7 jours',
      tagline: 'Le palier le plus réservé par nos clients.',
      badge: 'Tarif réduit',
      features: [
        'Tarif dégressif appliqué automatiquement',
        'Option chauffeur disponible',
        'Caution remboursable en fin de location',
        'Acompte de 30 % à la réservation',
      ],
      featured: true,
    },
    {
      name: '30 jours',
      tagline: 'Idéal pour un long séjour ou un besoin professionnel.',
      badge: '-12 %',
      features: ['-12 % par rapport au tarif standard', 'Le meilleur tarif journalier', 'Acompte de 30 % à la réservation'],
      featured: false,
    },
  ];
}
