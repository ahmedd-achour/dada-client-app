import { Component, Signal, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AttemptsService } from '../../shared/attempts.service';
import { ATTEMPT_RETENTION_DAYS, Attempt } from '../../shared/attempt.model';
import { AlertService } from '../../shared/alert.service';

const DAY_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-admin-archive',
  imports: [RouterLink, DatePipe],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive {
  private readonly attempts: Signal<Attempt[] | null>;
  protected readonly loading: Signal<boolean>;
  protected readonly archived: Signal<Attempt[]>;
  protected readonly busyId = signal<string | null>(null);

  private sweptOnce = false;

  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly alerts: AlertService,
  ) {
    this.attempts = toSignal(this.attemptsService.watchAttempts(), { initialValue: null });
    this.loading = computed(() => this.attempts() === null);

    this.archived = computed(() =>
      (this.attempts() ?? [])
        .filter((a) => !!a.archivedAt)
        .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)),
    );

    // Opportunistic cleanup — sweeps reservations past retention the first time this tab loads data.
    effect(() => {
      const list = this.archived();
      if (!this.sweptOnce && this.attempts() !== null) {
        this.sweptOnce = true;
        void this.attemptsService.sweepExpiredAttempts(list);
      }
    });
  }

  protected daysLeft(archivedAt: number): number {
    const remaining = ATTEMPT_RETENTION_DAYS * DAY_MS - (Date.now() - archivedAt);
    return Math.max(0, Math.ceil(remaining / DAY_MS));
  }

  protected isDeletable(archivedAt: number): boolean {
    return this.daysLeft(archivedAt) <= 0;
  }

  protected async restore(attempt: Attempt): Promise<void> {
    if (!attempt.id) return;
    this.busyId.set(attempt.id);
    try {
      await this.attemptsService.restoreAttempt(attempt.id);
      this.alerts.toast('Réservation restaurée');
    } finally {
      this.busyId.set(null);
    }
  }

  protected async deleteForever(attempt: Attempt): Promise<void> {
    if (!attempt.id) return;
    const confirmed = await this.alerts.confirmDanger(
      'Supprimer définitivement ?',
      `${attempt.customerName} sera supprimé pour toujours, avec tous ses fichiers. Cette action est irréversible.`,
      'Oui, supprimer',
    );
    if (!confirmed) return;
    this.busyId.set(attempt.id);
    try {
      await this.attemptsService.deleteAttemptPermanently(attempt.id);
      this.alerts.toast('Réservation supprimée définitivement');
    } finally {
      this.busyId.set(null);
    }
  }
}
