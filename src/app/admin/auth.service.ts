import { Injectable, signal } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../shared/firebase';
import { AdminsService } from '../shared/admins.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly ready = signal(false);

  constructor(private readonly adminsService: AdminsService) {
    onAuthStateChanged(auth, (user) => {
      this.user.set(user);
      this.ready.set(true);
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async signup(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await this.adminsService.registerAdmin(credential.user.uid, email);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
