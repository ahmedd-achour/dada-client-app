import { Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AttemptsService } from '../../shared/attempts.service';
import { ATTEMPT_STATUSES, Attempt, AttemptStatus } from '../../shared/attempt.model';
import { Stats } from '../stats/stats';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '');
}

function matchesSearch(attempt: Attempt, term: string): boolean {
  const needle = normalize(term);
  if (!needle) return true;

  if (normalize(attempt.customerName).includes(needle)) return true;
  if (normalize(attempt.customerPhone).includes(needle)) return true;
  if (normalize(attempt.category).includes(needle)) return true;

  const plates = [...attempt.departureVideos, ...attempt.returnVideos]
    .map((a) => a.plateInfo?.plateNumber ?? '')
    .filter(Boolean);
  return plates.some((plate) => normalize(plate).includes(needle));
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, Stats, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly statuses = ATTEMPT_STATUSES;
  protected readonly activeFilter = signal<AttemptStatus | 'tous'>('tous');
  protected readonly searchTerm = signal('');

  protected readonly attempts: Signal<Attempt[] | null>;

  protected readonly loading: Signal<boolean>;
  protected readonly filtered: Signal<Attempt[]>;
  protected readonly counts: Signal<Record<string, number>>;

  constructor(private readonly attemptsService: AttemptsService) {
    this.attempts = toSignal(this.attemptsService.watchAttempts(), { initialValue: null });

    this.loading = computed(() => this.attempts() === null);

    this.filtered = computed(() => {
      const all = this.attempts() ?? [];
      const filter = this.activeFilter();
      const term = this.searchTerm();
      const byStatus = filter === 'tous' ? all : all.filter((a) => a.status === filter);
      return term ? byStatus.filter((a) => matchesSearch(a, term)) : byStatus;
    });

    this.counts = computed(() => {
      const all = this.attempts() ?? [];
      const map: Record<string, number> = { tous: all.length };
      for (const status of this.statuses) {
        map[status.value] = all.filter((a) => a.status === status.value).length;
      }
      return map;
    });
  }

  protected setFilter(filter: AttemptStatus | 'tous'): void {
    this.activeFilter.set(filter);
  }

  protected statusLabel(status: AttemptStatus): string {
    return this.statuses.find((s) => s.value === status)?.label ?? status;
  }
}
