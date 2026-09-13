import { Injectable, signal } from '@angular/core';

export interface PresetVehicle {
  id: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class BookingModalService {
  readonly isOpen = signal(false);
  readonly presetCategory = signal<string | null>(null);
  /** Set when the client reserved one exact car from the fleet (not just a category). */
  readonly presetVehicle = signal<PresetVehicle | null>(null);

  open(category?: string, vehicle?: PresetVehicle): void {
    this.presetCategory.set(category ?? null);
    this.presetVehicle.set(vehicle ?? null);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
