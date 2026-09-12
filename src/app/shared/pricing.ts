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

function discountForDays(days: number): number {
  if (days >= 30) {
    return 12;
  }
  if (days >= 7) {
    return 8;
  }
  return 0;
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
