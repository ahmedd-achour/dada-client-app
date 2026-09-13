import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FleetService, FleetVehicleDoc } from '../../shared/fleet.service';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-fleet-admin',
  imports: [RouterLink],
  templateUrl: './fleet-admin.html',
  styleUrl: './fleet-admin.css',
})
export class FleetAdmin {
  protected readonly vehicles: Signal<FleetVehicleDoc[] | null>;

  constructor(
    private readonly fleetService: FleetService,
    private readonly alerts: AlertService,
  ) {
    void this.fleetService.seedIfEmpty();
    this.vehicles = toSignal(this.fleetService.watchFleet(), { initialValue: null });
  }

  protected async toggleVisibility(vehicle: FleetVehicleDoc): Promise<void> {
    try {
      await this.fleetService.setVisibility(vehicle.id, !vehicle.isPublic);
    } catch {
      this.alerts.error('Impossible de changer la visibilité. Réessayez.');
    }
  }
}
