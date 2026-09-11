import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingModalService {
  readonly isOpen = signal(false);
  readonly presetCategory = signal<string | null>(null);

  open(category?: string): void {
    this.presetCategory.set(category ?? null);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
