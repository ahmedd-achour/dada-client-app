import { Component, signal } from '@angular/core';
import { BUSINESS_INFO, waLink } from '../../shared/business-info';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly phone = BUSINESS_INFO.phone;
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }
}
