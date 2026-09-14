import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BUSINESS_INFO } from '../../shared/business-info';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-location-map',
  imports: [TranslatePipe],
  templateUrl: './location-map.html',
  styleUrl: './location-map.css',
})
export class LocationMap {
  protected readonly info = BUSINESS_INFO;
  protected readonly mapEmbedUrl: SafeResourceUrl;
  protected readonly directionsLink: string;

  constructor(sanitizer: DomSanitizer) {
    const query = encodeURIComponent(`${BUSINESS_INFO.name}, ${BUSINESS_INFO.address}`);
    this.mapEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&output=embed`,
    );
    this.directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
}
