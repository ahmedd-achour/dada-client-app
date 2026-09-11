import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';

@Component({
  selector: 'app-airport-transfer',
  templateUrl: './airport-transfer.html',
  styleUrl: './airport-transfer.css',
})
export class AirportTransfer {
  protected readonly whatsappLink = waLink(
    "Bonjour, j'arrive à l'aéroport Tunis-Carthage et je souhaite réserver une voiture avec livraison.",
  );
}
