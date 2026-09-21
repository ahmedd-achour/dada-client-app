import { AttemptPricing } from './attempt.model';
import { findCategory } from './fleet-categories';

export function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) {
    return 0;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

export function discountForDays(days: number): number {
  if (days >= 30) {
    return 12;
  }
  if (days >= 7) {
    return 8;
  }
  return 0;
}

/** Total + per-day price for a given daily rate and duration, degressive rate applied — same discount table as `calculatePricing`. */
export function priceForDuration(dailyRate: number, days: number): { total: number; perDay: number; discountPct: number } {
  const discountPct = dailyRate ? discountForDays(days) : 0;
  const total = Math.round(dailyRate * days * (1 - discountPct / 100));
  return { total, perDay: Math.round(total / days), discountPct };
}

export function calculatePricing(categoryName: string, startDate: string, endDate: string): AttemptPricing {
  const category = findCategory(categoryName);
  const dailyRate = category?.dailyRate ?? 0;
  const days = daysBetween(startDate, endDate) || 1;
  const subtotal = dailyRate * days;
  const discountPct = dailyRate ? discountForDays(days) : 0;
  const total = Math.round(subtotal * (1 - discountPct / 100));

  return { dailyRate, days, subtotal, discountPct, total, source: 'estimation' };
}
