import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
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
export class Stats implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) attempts: Attempt[] = [];

  @ViewChild('statusCanvas') statusCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryCanvas') categoryCanvasRef?: ElementRef<HTMLCanvasElement>;

  private statusChart?: Chart;
  private categoryChart?: Chart;
  private viewReady = false;

  protected get totalCount(): number {
    return this.attempts.length;
  }

  protected get totalRevenue(): number {
    // Only money actually received (via uploaded receipts) counts as confirmed revenue —
    // a contract price can be renegotiated after signing, so it's excluded here.
    return this.attempts
      .filter((a) => a.status !== 'annule' && a.pricing?.source === 'recus')
      .reduce((sum, a) => sum + (a.pricing?.total ?? 0), 0);
  }

  protected get cancelRate(): number {
    if (!this.attempts.length) return 0;
    const cancelled = this.attempts.filter((a) => a.status === 'annule').length;
    return Math.round((cancelled / this.attempts.length) * 100);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnChanges(): void {
    if (this.viewReady) {
      this.renderCharts();
    }
  }

  ngOnDestroy(): void {
    this.statusChart?.destroy();
    this.categoryChart?.destroy();
  }

  private renderCharts(): void {
    this.renderStatusChart();
    this.renderCategoryChart();
  }

  private renderStatusChart(): void {
    const canvas = this.statusCanvasRef?.nativeElement;
    if (!canvas) return;

    const counts = ATTEMPT_STATUSES.map((s) => this.attempts.filter((a) => a.status === s.value).length);
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

  private renderCategoryChart(): void {
    const canvas = this.categoryCanvasRef?.nativeElement;
    if (!canvas) return;

    const byCategory = new Map<string, number>();
    for (const attempt of this.attempts) {
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
