import { Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FLEET_CATEGORIES } from '../../shared/fleet-categories';
import { FleetService, FleetVehicleDoc } from '../../shared/fleet.service';
import { BookingModalService } from '../../shared/booking-modal.service';

@Component({
  selector: 'app-fleet',
  imports: [FormsModule],
  templateUrl: './fleet.html',
  styleUrl: './fleet.css',
})
export class Fleet {
  protected readonly categories = FLEET_CATEGORIES;

  private readonly liveFleet: Signal<FleetVehicleDoc[]>;
  protected readonly models: Signal<FleetVehicleDoc[]>;
  protected readonly totalUnits: Signal<number>;
  /** Each vehicle repeated once per unit, then doubled so the CSS marquee can loop seamlessly. */
  protected readonly loopUnits: Signal<FleetVehicleDoc[]>;

  protected readonly searchTerm = signal('');
  protected readonly searchResults = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return [];
    return this.models().filter((m) =>
      `${m.brand} ${m.model} ${m.bodyType} ${m.gamme}`.toLowerCase().includes(term),
    );
  });

  constructor(
    private readonly fleetService: FleetService,
    private readonly bookingModal: BookingModalService,
  ) {
    this.liveFleet = toSignal(this.fleetService.watchPublicFleet(), { initialValue: [] });
    this.models = this.liveFleet;
    this.totalUnits = computed(() => this.models().reduce((sum, v) => sum + v.unitCount, 0));
    this.loopUnits = computed(() => {
      const units = this.models().flatMap((vehicle) => Array(vehicle.unitCount).fill(vehicle) as FleetVehicleDoc[]);
      return [...units, ...units];
    });
  }

  protected reserve(bookingCategory: string): void {
    this.bookingModal.open(bookingCategory);
  }
}
