import { Component } from '@angular/core';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: 'fleet' | 'chat' | 'key';
}

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorks {
  protected readonly steps: Step[] = [
    {
      number: '01',
      title: 'Choisissez votre véhicule',
      description: 'Parcourez la flotte et filtrez par catégorie, transmission ou budget.',
      icon: 'fleet',
    },
    {
      number: '02',
      title: 'Confirmez sur WhatsApp',
      description: 'Échangez avec notre équipe, indiquez vos dates, confirmation immédiate.',
      icon: 'chat',
    },
    {
      number: '03',
      title: 'Récupérez les clés',
      description: "Retrait à l'agence d'Aouina ou livraison à l'aéroport Tunis-Carthage.",
      icon: 'key',
    },
  ];
}
