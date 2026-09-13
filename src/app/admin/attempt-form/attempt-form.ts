import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttemptsService } from '../../shared/attempts.service';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { AlertService } from '../../shared/alert.service';
import { VehiclePicker } from '../../components/vehicle-picker/vehicle-picker';

@Component({
  selector: 'app-attempt-form',
  imports: [FormsModule, VehiclePicker],
  templateUrl: './attempt-form.html',
  styleUrl: './attempt-form.css',
})
export class AttemptForm {
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected customerName = '';
  protected customerPhone = '';
  protected category = FLEET_CATEGORIES[0].name;
  protected startDate = '';
  protected endDate = '';
  protected promoCode = '';
  protected saving = false;
  protected error = '';

  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly router: Router,
    private readonly alerts: AlertService,
  ) {}

  protected get isValid(): boolean {
    return (
      this.customerName.trim().length >= 2 &&
      this.customerPhone.replace(/\D/g, '').length >= 8 &&
      !!this.category &&
      !!this.startDate &&
      !!this.endDate &&
      this.endDate >= this.startDate
    );
  }

  protected async save(): Promise<void> {
    if (!this.isValid || this.saving) {
      return;
    }
    this.saving = true;
    this.error = '';
    try {
      const id = await this.attemptsService.createAttempt({
        customerName: this.customerName.trim(),
        customerPhone: this.customerPhone.trim(),
        category: this.category,
        startDate: this.startDate,
        endDate: this.endDate,
        promoCode: this.promoCode.trim(),
        source: 'admin',
      });
      this.alerts.toast('Réservation créée');
      this.router.navigate(['/admin', id]);
    } catch {
      this.error = 'Impossible de créer la réservation. Réessayez.';
      this.alerts.error('Impossible de créer la réservation. Réessayez.');
    } finally {
      this.saving = false;
    }
  }
}
