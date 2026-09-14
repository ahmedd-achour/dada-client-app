import { Injectable, effect, signal } from '@angular/core';
import { en } from './locales/en';
import { ar } from './locales/ar';

export type Lang = 'fr' | 'en' | 'ar';

const STORAGE_KEY = 'dada-lang';
const RTL_LANGS: readonly Lang[] = ['ar'];

/**
 * French is the source language: every UI string is written in French in the
 * templates and used directly as the dictionary key, so `fr` needs no dictionary
 * of its own — t() just returns the key unchanged when the active language is `fr`.
 */
const DICTIONARIES: Record<Exclude<Lang, 'fr'>, Record<string, string>> = { en, ar };

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.readInitialLang());

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private browsing / storage disabled — language just won't persist */
    }
  }

  t(text: string): string {
    const lang = this.lang();
    if (lang === 'fr') return text;
    return DICTIONARIES[lang][text] ?? text;
  }

  private readInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'fr' || stored === 'en' || stored === 'ar') return stored;
    } catch {
      /* ignore */
    }
    return 'fr';
  }
}
