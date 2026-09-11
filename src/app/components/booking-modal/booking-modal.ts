import { Component, HostListener, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingModalService } from '../../shared/booking-modal.service';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { waLink } from '../../shared/business-info';

@Component({
  selector: 'app-booking-modal',
  imports: [FormsModule],
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.css',
})
export class BookingModal {
  protected readonly categories = FLEET_CATEGORIES;
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected selectedCar = '';
  protected customerName = '';
  protected customerPhone = '';
  protected startDate = '';
  protected endDate = '';

  constructor(protected readonly modal: BookingModalService) {
    effect(() => {
      if (this.modal.isOpen()) {
        this.selectedCar = this.modal.presetCategory() ?? this.categories[0].name;
        this.customerName = '';
        this.customerPhone = '';
        this.startDate = '';
        this.endDate = '';
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.modal.isOpen()) {
      this.modal.close();
    }
  }

  protected get selectedCategory() {
    return this.categories.find((c) => c.name === this.selectedCar) ?? this.categories[0];
  }

  protected get isValid(): boolean {
    const hasEnoughDigits = this.customerPhone.replace(/\D/g, '').length >= 8;
    return (
      !!this.selectedCar &&
      this.customerName.trim().length >= 2 &&
      hasEnoughDigits &&
      !!this.startDate &&
      !!this.endDate &&
      this.endDate >= this.startDate
    );
  }

  protected get whatsappHref(): string {
    const formatDate = (value: string) => {
      const [year, month, day] = value.split('-');
      return `${day}/${month}/${year}`;
    };
    const message = `Bonjour, je m'appelle ${this.customerName.trim()} (${this.customerPhone.trim()}).\nJe souhaite réserver : ${this.selectedCar}\nDu ${formatDate(this.startDate)} au ${formatDate(this.endDate)}`;
    return waLink(message);
  }

  protected close(): void {
    this.modal.close();
  }

  protected confirm(): void {
    if (!this.isValid) {
      return;
    }
    // TODO: once Firebase is wired up, persist { name: customerName, phone: customerPhone,
    // category: selectedCar, startDate, endDate } as a lead document here.
    window.open(this.whatsappHref, '_blank', 'noopener');
    this.modal.close();
  }
}
