import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class AdminShell {
  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
