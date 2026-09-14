import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FLEET_CATEGORIES, FleetCategory } from '../../shared/fleet-categories';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-vehicle-picker',
  imports: [TranslatePipe],
  templateUrl: './vehicle-picker.html',
  styleUrl: './vehicle-picker.css',
})
export class VehiclePicker {
  @Input() selected = '';
  @Output() selectedChange = new EventEmitter<string>();

  @ViewChild('field') fieldRef?: ElementRef<HTMLElement>;

  protected readonly categories = FLEET_CATEGORIES;
  protected open = false;

  protected get current(): FleetCategory {
    return this.categories.find((c) => c.name === this.selected) ?? this.categories[0];
  }

  protected toggle(): void {
    this.open = !this.open;
  }

  protected pick(name: string): void {
    this.selectedChange.emit(name);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open && this.fieldRef && !this.fieldRef.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open = false;
  }
}
