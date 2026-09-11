import { Component } from '@angular/core';
import { waLink } from '../../shared/business-info';
import { BookingModalService } from '../../shared/booking-modal.service';

@Component({
  selector: 'app-hero',
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
