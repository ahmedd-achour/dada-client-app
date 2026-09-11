import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';

@Component({
  selector: 'app-floating-chat',
  templateUrl: './floating-chat.html',
  styleUrl: './floating-chat.css',
})
export class FloatingChat {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
}
