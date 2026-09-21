import { Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FleetService, FleetVehicleDoc } from '../../shared/fleet.service';
import { discountForDays, priceForDuration } from '../../shared/pricing';
import { waLink } from '../../shared/business-info';
import { BookingModalService } from '../../shared/booking-modal.service';
import { BookingModal } from '../../components/booking-modal/booking-modal';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { FloatingChat } from '../../components/floating-chat/floating-chat';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

interface Duration {
  days: number;
  label: string;
}

const DURATIONS: Duration[] = [
  { days: 3, label: '3 jours' },
  { days: 7, label: '7 jours' },
  { days: 10, label: '10 jours' },
  { days: 15, label: '15 jours' },
  { days: 30, label: '30 jours' },
];

type Group = 'luxe' | 'standard';

@Component({
  selector: 'app-tarifs-du-jour',
  imports: [RouterLink, TranslatePipe, BookingModal, Navbar, Footer, FloatingChat],
  templateUrl: './tarifs-du-jour.html',
  styleUrl: './tarifs-du-jour.css',
})
export class TarifsDuJour {
  protected readonly durations = DURATIONS;
  protected readonly activeGroup = signal<Group>('luxe');
  protected readonly whatsappLink = waLink('Bonjour, je souhaite avoir des informations sur les tarifs de vos voitures de location.');

  private readonly fleet: Signal<FleetVehicleDoc[]>;
  protected readonly rows: Signal<FleetVehicleDoc[]>;

  constructor(
    private readonly fleetService: FleetService,
    private readonly bookingModal: BookingModalService,
  ) {
    this.fleet = toSignal(this.fleetService.watchPublicFleet(), { initialValue: [] });
    this.rows = computed(() => {
      const all = this.fleet();
      const group = this.activeGroup();
      return all
        .filter((v) => (group === 'luxe' ? this.isLuxeGroup(v) : this.isStandardGroup(v)))
        .sort((a, b) => a.dailyFrom - b.dailyFrom);
    });
  }

  protected setGroup(group: Group): void {
    this.activeGroup.set(group);
  }

  protected priceFor(vehicle: FleetVehicleDoc, days: number): { total: number; perDay: number; discountPct: number } {
    return priceForDuration(vehicle.dailyFrom, days);
  }

  protected discountLabel(days: number): number {
    return discountForDays(days);
  }

  protected reserve(vehicle: FleetVehicleDoc): void {
    this.bookingModal.open(vehicle.bookingCategory, { id: vehicle.id, label: `${vehicle.brand} ${vehicle.model}` });
  }

  private isLuxeGroup(v: FleetVehicleDoc): boolean {
    return v.gamme === 'Luxe' || v.gamme === 'Pickup' || v.gamme === '7 Places';
  }

  private isStandardGroup(v: FleetVehicleDoc): boolean {
    return v.gamme !== 'Luxe';
  }
}
