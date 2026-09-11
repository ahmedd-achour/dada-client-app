import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite réserver une voiture.');
}
