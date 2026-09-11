import { Component } from '@angular/core';
import { BUSINESS_INFO } from '../../shared/business-info';

interface Benefit {
  title: string;
  description: string;
  icon: 'pin' | 'clock' | 'chat';
}

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.html',
  styleUrl: './why-us.css',
})
export class WhyUs {
  protected readonly address = BUSINESS_INFO.address;
  protected readonly hours = BUSINESS_INFO.hours;

  protected readonly benefits: Benefit[] = [
    {
      title: 'Agence à Aouina, Tunis',
      description: 'Retrait ou restitution directement à notre agence, ou livraison à votre hôtel et à l\'aéroport.',
      icon: 'pin',
    },
    {
      title: 'Disponible 7j/7',
      description: 'Notre équipe répond de 8h00 à 22h00, tous les jours de la semaine.',
      icon: 'clock',
    },
    {
      title: 'Réponse rapide sur WhatsApp',
      description: "Un conseiller vous répond directement pour confirmer votre réservation, pas de robot.",
      icon: 'chat',
    },
  ];
}
