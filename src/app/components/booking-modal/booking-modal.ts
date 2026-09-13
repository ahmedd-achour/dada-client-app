import { Component, HostListener, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingModalService } from '../../shared/booking-modal.service';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { waLink } from '../../shared/business-info';
import { AttemptsService } from '../../shared/attempts.service';
import { AlertService } from '../../shared/alert.service';
import { VehiclePicker } from '../vehicle-picker/vehicle-picker';

@Component({
  selector: 'app-booking-modal',
  imports: [FormsModule, VehiclePicker],
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.css',
})
export class BookingModal {
  protected readonly categories = FLEET_CATEGORIES;
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected selectedCar = '';
  /** Set when the client reserved one exact car from the fleet — locks the vehicle field instead of the category picker. */
  protected fixedVehicle: { id: string; label: string } | null = null;
  protected customerName = '';
  protected customerPhone = '';
  protected promoCode = '';
  protected startDate = '';
  protected endDate = '';
  protected submitting = false;

  constructor(
    protected readonly modal: BookingModalService,
    private readonly attempts: AttemptsService,
    private readonly alerts: AlertService,
  ) {
    effect(() => {
      if (this.modal.isOpen()) {
        this.selectedCar = this.modal.presetCategory() ?? this.categories[0].name;
        this.fixedVehicle = this.modal.presetVehicle();
        this.customerName = '';
        this.customerPhone = '';
        this.promoCode = '';
        this.startDate = '';
        this.endDate = '';
        this.submitting = false;
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

  /** Lets the client abandon the exact car they clicked and fall back to picking just a category. */
  protected changeVehicle(): void {
    this.fixedVehicle = null;
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
    const vehicleText = this.fixedVehicle ? `${this.fixedVehicle.label} (${this.selectedCar})` : this.selectedCar;
    let message = `Bonjour, je m'appelle ${this.customerName.trim()} (${this.customerPhone.trim()}).\nJe souhaite réserver : ${vehicleText}\nDu ${formatDate(this.startDate)} au ${formatDate(this.endDate)}`;
    if (this.promoCode.trim()) {
      message += `\nCode promo : ${this.promoCode.trim()}`;
    }
    return waLink(message);
  }

  protected close(): void {
    this.modal.close();
  }

  protected async confirm(): Promise<void> {
    if (!this.isValid || this.submitting) {
      return;
    }
    this.submitting = true;
    try {
      await this.attempts.createAttempt({
        customerName: this.customerName.trim(),
        customerPhone: this.customerPhone.trim(),
        category: this.selectedCar,
        ...(this.fixedVehicle ? { vehicleLabel: this.fixedVehicle.label, vehicleId: this.fixedVehicle.id } : {}),
        startDate: this.startDate,
        endDate: this.endDate,
        promoCode: this.promoCode.trim(),
        source: 'site',
      });
    } catch (error) {
      console.error("Impossible d'enregistrer la réservation", error);
      this.alerts.error('Un souci est survenu, mais vous pouvez continuer sur WhatsApp.');
    }
    window.open(this.whatsappHref, '_blank', 'noopener');
    this.submitting = false;
    this.modal.close();
  }
}
