import { Component, inject } from '@angular/core';
import { waLink } from '../../shared/business-info';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-airport-transfer',
  imports: [TranslatePipe],
  templateUrl: './airport-transfer.html',
  styleUrl: './airport-transfer.css',
})
export class AirportTransfer {
  private readonly i18n = inject(I18nService);

  protected readonly whatsappLink = waLink(
    "Bonjour, j'arrive à l'aéroport Tunis-Carthage et je souhaite réserver une voiture avec livraison.",
  );

  protected get bannerAlt(): string {
    return this.i18n.t("Livraison à l'aéroport Tunis-Carthage");
  }
}
