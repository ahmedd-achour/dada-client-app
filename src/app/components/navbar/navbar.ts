import { Component, signal } from '@angular/core';
import { BUSINESS_INFO, waLink } from '../../shared/business-info';
import { I18nService, Lang } from '../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly phone = BUSINESS_INFO.phone;
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');
  protected readonly menuOpen = signal(false);

  protected readonly languages: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  constructor(protected readonly i18n: I18nService) {}

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  protected selectLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }
}
