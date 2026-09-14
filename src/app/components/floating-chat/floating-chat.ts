import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-floating-chat',
  imports: [TranslatePipe],
  templateUrl: './floating-chat.html',
  styleUrl: './floating-chat.css',
})
export class FloatingChat {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
}
