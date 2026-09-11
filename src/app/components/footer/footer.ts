import { Component } from '@angular/core';
import { BUSINESS_INFO, waLink } from '../../shared/business-info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly info = BUSINESS_INFO;
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
}
