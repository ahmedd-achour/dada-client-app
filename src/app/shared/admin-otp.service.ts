import { Injectable } from '@angular/core';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from './firebase';
import { EmailService } from './email.service';

const OTP_COLLECTION = 'admin_otps';
const OTP_CLAIMS_COLLECTION = 'admin_otp_claims';
const OTP_VALIDITY_MS = 60 * 60 * 1000;

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function generateCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, '0');
}

@Injectable({ providedIn: 'root' })
export class AdminOtpService {
  constructor(private readonly emailService: EmailService) {}

  private async storeCode(phone: string): Promise<string> {
    const code = generateCode();
    await setDoc(doc(db, OTP_COLLECTION, phone), {
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + OTP_VALIDITY_MS,
    });
    return code;
  }

  /** New admin: code goes to the super admin, who must relay it to approve the account. */
  async requestSignupOtp(phone: string, name: string, email: string): Promise<void> {
    const normalized = normalizePhone(phone);
    const code = await this.storeCode(normalized);
    await this.emailService.sendAdminSignupOtp({ phone: normalized, name, email, code });
  }

  /** Already-registered admin, unrecognized device: code goes to their own registered email. */
  async requestLoginOtp(phone: string, name: string, email: string): Promise<void> {
    const normalized = normalizePhone(phone);
    const code = await this.storeCode(normalized);
    await this.emailService.sendAdminLoginOtp({ phone: normalized, name, email, code });
  }

  /** Returns true if `code` matched the pending OTP for `phone` and the claim was recorded. */
  async verifyAndClaim(uid: string, phone: string, code: string): Promise<boolean> {
    const normalized = normalizePhone(phone);
    try {
      await setDoc(doc(db, OTP_CLAIMS_COLLECTION, uid), {
        phone: normalized,
        otpCode: code.trim(),
        createdAt: Date.now(),
      });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        return false;
      }
      throw error;
    }
    await deleteDoc(doc(db, OTP_COLLECTION, normalized)).catch(() => {});
    return true;
  }
}
