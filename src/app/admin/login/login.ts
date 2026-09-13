import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AdminsService } from '../../shared/admins.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  protected readonly mode = signal<'login' | 'signup'>('login');
  protected readonly deviceStatus = signal<'checking' | 'recognized' | 'unregistered'>('checking');

  protected readonly step = signal<'form' | 'otp'>('form');
  protected readonly phone = signal('');
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly otpCode = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly info = signal('');

  private pendingProfile: { name: string; email: string } | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly adminsService: AdminsService,
    private readonly router: Router,
  ) {
    void this.checkDevice();
  }

  private async checkDevice(): Promise<void> {
    const user = await this.authService.getCurrentUserOnce();
    if (user && (await this.adminsService.isAdmin(user.uid))) {
      this.deviceStatus.set('recognized');
      this.router.navigateByUrl('/admin');
    } else {
      this.deviceStatus.set('unregistered');
    }
  }

  protected setMode(mode: 'login' | 'signup'): void {
    this.mode.set(mode);
    this.step.set('form');
    this.otpCode.set('');
    this.error.set('');
    this.info.set('');
    this.pendingProfile = null;
  }

  protected async submit(): Promise<void> {
    if (this.step() === 'otp') {
      await this.confirmOtp();
      return;
    }
    if (this.mode() === 'login') {
      await this.submitLogin();
    } else {
      await this.submitSignup();
    }
  }

  private async submitLogin(): Promise<void> {
    if (this.phone().replace(/\D/g, '').length < 8) {
      this.error.set('Entrez un numéro de téléphone valide.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const lookup = await this.authService.requestLoginOtp(this.phone().trim());
      if (!lookup) {
        this.error.set("Ce numéro n'est pas enregistré comme admin. Utilisez « Créer un compte ».");
        return;
      }
      this.pendingProfile = lookup;
      this.step.set('otp');
      this.info.set('Un code à 6 chiffres a été envoyé à votre email enregistré. Valable 1 heure.');
    } catch (err) {
      this.error.set(this.friendlyError(err));
    } finally {
      this.loading.set(false);
    }
  }

  private async submitSignup(): Promise<void> {
    const phoneDigits = this.phone().replace(/\D/g, '');
    if (phoneDigits.length < 8 || this.name().trim().length < 2 || !this.email().includes('@')) {
      this.error.set('Entrez un téléphone, un nom et un email valides.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const existing = await this.adminsService.lookupByPhone(this.phone().trim());
      if (existing) {
        this.error.set('Ce numéro est déjà enregistré. Utilisez « Connexion ».');
        return;
      }
      await this.authService.requestSignupOtp(this.phone().trim(), this.name().trim(), this.email().trim());
      this.pendingProfile = { name: this.name().trim(), email: this.email().trim() };
      this.step.set('otp');
      this.info.set("Un code à 6 chiffres a été envoyé à l'administrateur. Valable 1 heure.");
    } catch (err) {
      this.error.set(this.friendlyError(err));
    } finally {
      this.loading.set(false);
    }
  }

  private async confirmOtp(): Promise<void> {
    if (this.otpCode().trim().length !== 6) {
      this.error.set('Entrez le code à 6 chiffres.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authService.confirmOtp(this.phone().trim(), this.otpCode().trim(), this.pendingProfile ?? undefined);
      this.router.navigateByUrl('/admin');
    } catch (err) {
      this.error.set(this.friendlyError(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected async resendOtp(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      if (this.mode() === 'login') {
        await this.authService.requestLoginOtp(this.phone().trim());
      } else {
        await this.authService.requestSignupOtp(this.phone().trim(), this.name().trim(), this.email().trim());
      }
      this.info.set('Nouveau code envoyé.');
    } catch (err) {
      this.error.set(this.friendlyError(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected backToForm(): void {
    this.step.set('form');
    this.otpCode.set('');
    this.error.set('');
    this.info.set('');
  }

  private friendlyError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    if (code === 'admin/otp-invalid') {
      return 'Code invalide ou expiré. Demandez un nouveau code.';
    }
    if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
      return "La connexion anonyme n'est pas activée sur ce projet Firebase (Authentication → Sign-in method → Anonymous, dans la console Firebase).";
    }
    return 'Une erreur est survenue. Réessayez.';
  }
}
