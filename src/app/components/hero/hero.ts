import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';
import { BookingModalService } from '../../shared/booking-modal.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur vos voitures de location.');

  constructor(private readonly bookingModal: BookingModalService) {}

  protected openBooking(): void {
    this.bookingModal.open();
  }
}
