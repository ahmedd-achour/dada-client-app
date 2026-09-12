import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  protected mode: 'login' | 'signup' = 'login';
  protected email = '';
  protected password = '';
  protected loading = false;
  protected error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  protected setMode(mode: 'login' | 'signup'): void {
    this.mode = mode;
    this.error = '';
  }

  protected async submit(): Promise<void> {
    if (!this.email || this.password.length < 6) {
      this.error = 'Entrez un email valide et un mot de passe d\'au moins 6 caractères.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      if (this.mode === 'login') {
        await this.authService.login(this.email.trim(), this.password);
      } else {
        await this.authService.signup(this.email.trim(), this.password);
      }
      this.router.navigateByUrl('/admin');
    } catch (err) {
      this.error = this.friendlyError(err);
    } finally {
      this.loading = false;
    }
  }

  private friendlyError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    if (code.includes('wrong-password') || code.includes('invalid-credential')) {
      return 'Email ou mot de passe incorrect.';
    }
    if (code.includes('user-not-found')) {
      return 'Aucun compte avec cet email.';
    }
    if (code.includes('email-already-in-use')) {
      return 'Un compte existe déjà avec cet email.';
    }
    if (code.includes('weak-password')) {
      return 'Mot de passe trop court (6 caractères minimum).';
    }
    if (code.includes('invalid-email')) {
      return 'Email invalide.';
    }
    return 'Une erreur est survenue. Réessayez.';
  }
}
