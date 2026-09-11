import { Component } from '@angular/core';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { BookingModalService } from '../../shared/booking-modal.service';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.html',
  styleUrl: './fleet.css',
})
export class Fleet {
  protected readonly categories = FLEET_CATEGORIES;

  constructor(private readonly bookingModal: BookingModalService) {}

  protected reserve(categoryName: string): void {
    this.bookingModal.open(categoryName);
  }
}
