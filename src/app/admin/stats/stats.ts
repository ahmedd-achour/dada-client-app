import { AfterViewInit, Component, ElementRef, OnDestroy, Signal, ViewChild, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { AttemptsService } from '../../shared/attempts.service';
import { ATTEMPT_STATUSES, Attempt } from '../../shared/attempt.model';

const STATUS_COLORS: Record<string, string> = {
  nouveau: 'oklch(55% 0.08 250)',
  confirme: 'oklch(43% 0.075 50)',
  en_cours: 'oklch(58% 0.11 75)',
  termine: 'oklch(50% 0.12 145)',
  annule: 'oklch(55% 0.16 25)',
};

@Component({
  selector: 'app-admin-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements AfterViewInit, OnDestroy {
  @ViewChild('statusCanvas') statusCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryCanvas') categoryCanvasRef?: ElementRef<HTMLCanvasElement>;

  private statusChart?: Chart;
  private categoryChart?: Chart;
  private viewReady = false;

  private readonly attemptsSignal: Signal<Attempt[] | null>;
  protected readonly loading: Signal<boolean>;
  // Archived reservations don't count towards live stats — they're no longer active business.
  protected readonly attempts: Signal<Attempt[]>;

  constructor(private readonly attemptsService: AttemptsService) {
    this.attemptsSignal = toSignal(this.attemptsService.watchAttempts(), { initialValue: null });
    this.loading = computed(() => this.attemptsSignal() === null);
    this.attempts = computed(() => (this.attemptsSignal() ?? []).filter((a) => !a.archivedAt));

    effect(() => {
      const data = this.attempts();
      if (this.viewReady) {
        this.renderCharts(data);
      }
    });
  }

  protected get totalCount(): number {
    return this.attempts().length;
  }

  protected get totalRevenue(): number {
    // Only money actually received (via uploaded receipts) counts as confirmed revenue —
    // a contract price can be renegotiated after signing, so it's excluded here.
    return this.attempts()
      .filter((a) => a.status !== 'annule' && a.pricing?.source === 'recus')
      .reduce((sum, a) => sum + (a.pricing?.total ?? 0), 0);
  }

  protected get cancelRate(): number {
    const all = this.attempts();
    if (!all.length) return 0;
    const cancelled = all.filter((a) => a.status === 'annule').length;
    return Math.round((cancelled / all.length) * 100);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts(this.attempts());
  }

  ngOnDestroy(): void {
    this.statusChart?.destroy();
    this.categoryChart?.destroy();
  }

  private renderCharts(attempts: Attempt[]): void {
    this.renderStatusChart(attempts);
    this.renderCategoryChart(attempts);
  }

  private renderStatusChart(attempts: Attempt[]): void {
    const canvas = this.statusCanvasRef?.nativeElement;
    if (!canvas) return;

    const counts = ATTEMPT_STATUSES.map((s) => attempts.filter((a) => a.status === s.value).length);
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ATTEMPT_STATUSES.map((s) => s.label),
        datasets: [
          {
            data: counts,
            backgroundColor: ATTEMPT_STATUSES.map((s) => STATUS_COLORS[s.value]),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
      },
    };

    this.statusChart?.destroy();
    this.statusChart = new Chart(canvas, config);
  }

  private renderCategoryChart(attempts: Attempt[]): void {
    const canvas = this.categoryCanvasRef?.nativeElement;
    if (!canvas) return;

    const byCategory = new Map<string, number>();
    for (const attempt of attempts) {
      byCategory.set(attempt.category, (byCategory.get(attempt.category) ?? 0) + 1);
    }
    const labels = Array.from(byCategory.keys());
    const data = Array.from(byCategory.values());

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: 'oklch(43% 0.075 50)',
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    };

    this.categoryChart?.destroy();
    this.categoryChart = new Chart(canvas, config);
  }
}
