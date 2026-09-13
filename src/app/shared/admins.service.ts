import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const ADMINS_COLLECTION = 'admins';
const LOOKUP_COLLECTION = 'admin_lookup';

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export interface AdminLookup {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AdminsService {
  async registerAdmin(uid: string, profile: { phone: string; name?: string; email?: string }): Promise<void> {
    const phone = normalizePhone(profile.phone);
    await setDoc(doc(db, ADMINS_COLLECTION, uid), { ...profile, phone, createdAt: Date.now() }, { merge: true });
    if (profile.name && profile.email) {
      await setDoc(doc(db, LOOKUP_COLLECTION, phone), { name: profile.name, email: profile.email }, { merge: true });
    }
  }

  /** Looks up the name/email an admin registered with, by phone — used for the "already registered,
   *  new device" self-service login (send the OTP to their own inbox instead of the super admin's). */
  async lookupByPhone(phone: string): Promise<AdminLookup | null> {
    try {
      const snapshot = await getDoc(doc(db, LOOKUP_COLLECTION, normalizePhone(phone)));
      return snapshot.exists() ? (snapshot.data() as AdminLookup) : null;
    } catch (error) {
      console.error('Impossible de vérifier ce numéro', error);
      return null;
    }
  }

  async isAdmin(uid: string): Promise<boolean> {
    try {
      const snapshot = await getDoc(doc(db, ADMINS_COLLECTION, uid));
      return snapshot.exists();
    } catch (error) {
      console.error('Impossible de vérifier le statut admin', error);
      return false;
    }
  }

  async listAdminEmails(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, ADMINS_COLLECTION));
      return snapshot.docs.map((d) => d.data()['email'] as string).filter(Boolean);
    } catch (error) {
      console.error('Impossible de lister les emails admin', error);
      return [];
    }
  }
}
