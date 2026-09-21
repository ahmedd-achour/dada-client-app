import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-promo-banner',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.css',
})
export class PromoBanner {}
