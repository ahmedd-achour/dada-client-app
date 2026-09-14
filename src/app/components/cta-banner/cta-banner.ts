import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-cta-banner',
  imports: [TranslatePipe],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.css',
})
export class CtaBanner {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite réserver une voiture.');
}
