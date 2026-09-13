import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FleetService, FleetVehicleDoc } from '../../shared/fleet.service';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { AlertService } from '../../shared/alert.service';

type Gamme = FleetVehicleDoc['gamme'];
type Fuel = FleetVehicleDoc['fuel'];

@Component({
  selector: 'app-fleet-form',
  imports: [FormsModule],
  templateUrl: './fleet-form.html',
  styleUrl: './fleet-form.css',
})
export class FleetForm {
  protected readonly bookingCategories = FLEET_CATEGORIES;
  protected readonly gammeOptions: Gamme[] = ['Standard', 'Luxe', '7 Places', 'Pickup'];
  protected readonly fuelOptions: Fuel[] = ['Essence', 'Diesel'];

  protected readonly isEdit;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  private vehicleId = '';
  private order = Date.now();

  protected readonly brand = signal('');
  protected readonly model = signal('');
  protected readonly year = signal(new Date().getFullYear());
  protected readonly bodyType = signal('');
  protected readonly gamme = signal<Gamme>('Standard');
  protected readonly seats = signal(5);
  protected readonly fuel = signal<Fuel>('Essence');
  protected readonly transmission = signal('Manuelle');
  protected readonly unitCount = signal(1);
  protected readonly image = signal('');
  protected readonly dailyFrom = signal(0);
  protected readonly bookingCategory = signal(FLEET_CATEGORIES[0]?.name ?? '');
  protected readonly isPublic = signal(true);

  protected readonly isValid = computed(
    () =>
      this.brand().trim().length > 0 &&
      this.model().trim().length > 0 &&
      this.bodyType().trim().length > 0 &&
      this.seats() > 0 &&
      this.unitCount() > 0 &&
      this.image().trim().length > 0 &&
      this.dailyFrom() > 0 &&
      !!this.bookingCategory(),
  );

  constructor(
    private readonly fleetService: FleetService,
    private readonly alerts: AlertService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.vehicleId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.vehicleId;
    if (this.isEdit) {
      void this.load();
    }
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const vehicle = await this.fleetService.getVehicle(this.vehicleId);
      if (!vehicle) {
        this.error.set("Ce véhicule n'existe plus.");
        return;
      }
      this.brand.set(vehicle.brand);
      this.model.set(vehicle.model);
      this.year.set(vehicle.year);
      this.bodyType.set(vehicle.bodyType);
      this.gamme.set(vehicle.gamme);
      this.seats.set(vehicle.seats);
      this.fuel.set(vehicle.fuel);
      this.transmission.set(vehicle.transmission);
      this.unitCount.set(vehicle.unitCount);
      this.image.set(vehicle.image);
      this.dailyFrom.set(vehicle.dailyFrom);
      this.bookingCategory.set(vehicle.bookingCategory);
      this.isPublic.set(vehicle.isPublic);
      this.order = vehicle.order;
    } catch {
      this.error.set('Impossible de charger ce véhicule.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async save(): Promise<void> {
    if (!this.isValid() || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    const input = {
      brand: this.brand().trim(),
      model: this.model().trim(),
      year: this.year(),
      bodyType: this.bodyType().trim(),
      gamme: this.gamme(),
      seats: this.seats(),
      fuel: this.fuel(),
      transmission: this.transmission().trim(),
      unitCount: this.unitCount(),
      image: this.image().trim(),
      dailyFrom: this.dailyFrom(),
      bookingCategory: this.bookingCategory(),
      isPublic: this.isPublic(),
      order: this.order,
    };
    try {
      if (this.isEdit) {
        await this.fleetService.updateVehicle(this.vehicleId, input);
        this.alerts.toast('Véhicule mis à jour');
      } else {
        await this.fleetService.createVehicle(input);
        this.alerts.toast('Véhicule ajouté');
      }
      this.router.navigateByUrl('/admin/fleet');
    } catch {
      this.error.set("Impossible d'enregistrer. Réessayez.");
    } finally {
      this.saving.set(false);
    }
  }
}
