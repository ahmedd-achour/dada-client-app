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

  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router,
  ) {
    const navigationEnd = toSignal(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
      { initialValue: null },
    );

    this.isDetailView = computed(() => {
      const url = navigationEnd()?.urlAfterRedirects ?? this.router.url;
      const match = /^\/admin\/([^/?]+)/.exec(url);
      if (!match) return false;
      return match[1] !== 'stats' && match[1] !== 'archive';
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
