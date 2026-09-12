import { Injectable } from '@angular/core';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const ADMINS_COLLECTION = 'admins';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  async registerAdmin(uid: string, email: string): Promise<void> {
    await setDoc(doc(db, ADMINS_COLLECTION, uid), { email, createdAt: Date.now() }, { merge: true });
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
