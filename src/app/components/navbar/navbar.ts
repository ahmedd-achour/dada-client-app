import { Component } from '@angular/core';
import { BUSINESS_INFO, waLink } from '../../shared/business-info';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly phone = BUSINESS_INFO.phone;
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
}
