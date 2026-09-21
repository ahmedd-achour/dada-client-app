import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class AdminShell {
  protected readonly isDetailView;
  protected readonly isNewForm;

  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router,
  ) {
    const navigationEnd = toSignal(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
      { initialValue: null },
    );

    const currentUrl = computed(() => navigationEnd()?.urlAfterRedirects ?? this.router.url);
    this.isNewForm = computed(() => /^\/admin\/new(?:[/?#]|$)/.test(currentUrl()));

    this.isDetailView = computed(() => {
      const url = currentUrl();
      const match = /^\/admin\/([^/?]+)(?:\/([^/?]+))?/.exec(url);
      if (!match) return false;
      const [, firstSegment, secondSegment] = match;
      // A second segment (e.g. fleet/new, fleet/abc123) is always a sub-page — back button.
      if (secondSegment) return true;
      // A single segment is a sub-page unless it's one of the shell's own top-level tabs.
      return !['stats', 'archive', 'fleet'].includes(firstSegment);
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
