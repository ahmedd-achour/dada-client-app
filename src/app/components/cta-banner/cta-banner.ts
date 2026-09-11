import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';

@Component({
  selector: 'app-cta-banner',
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.css',
})
export class CtaBanner {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite réserver une voiture.');
}
