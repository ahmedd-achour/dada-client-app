import { Injectable, signal } from '@angular/core';
import { User, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '../shared/firebase';
import { AdminsService } from '../shared/admins.service';
import { AdminOtpService } from '../shared/admin-otp.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly ready = signal(false);

  constructor(
    private readonly adminsService: AdminsService,
    private readonly adminOtpService: AdminOtpService,
  ) {
    onAuthStateChanged(auth, (user) => {
      this.user.set(user);
      this.ready.set(true);
    });
  }

  /** Resolves with the current user, waiting for the first auth-state resolution if needed. */
  getCurrentUserOnce(): Promise<User | null> {
    if (this.ready()) return Promise.resolve(this.user());
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /** New admin: emails a 6-digit code (valid 1h) to the super admin, who must relay it to approve. */
  async requestSignupOtp(phone: string, name: string, email: string): Promise<void> {
    await this.adminOtpService.requestSignupOtp(phone, name, email);
  }

  /**
   * Already-registered admin on an unrecognized device: emails the code to their OWN registered
   * inbox instead of the super admin's. Returns null if this phone isn't a registered admin.
   */
  async requestLoginOtp(phone: string): Promise<{ name: string; email: string } | null> {
    const lookup = await this.adminsService.lookupByPhone(phone);
    if (!lookup) return null;
    await this.adminOtpService.requestLoginOtp(phone, lookup.name, lookup.email);
    return lookup;
  }

  /** Confirms the OTP and, if valid, registers this device's session as an admin. */
  async confirmOtp(phone: string, otpCode: string, profile?: { name: string; email: string }): Promise<void> {
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
    const verified = await this.adminOtpService.verifyAndClaim(user.uid, phone, otpCode);
    if (!verified) {
      throw Object.assign(new Error('Code invalide ou expiré.'), { code: 'admin/otp-invalid' });
    }
    await this.adminsService.registerAdmin(user.uid, { phone: phone.trim(), ...profile });
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
