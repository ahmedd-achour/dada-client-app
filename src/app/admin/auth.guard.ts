import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../shared/firebase';
import { AdminsService } from '../shared/admins.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const adminsService = inject(AdminsService);
  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        router.navigate(['/admin/login']);
        resolve(false);
        return;
      }
      const isAdmin = await adminsService.isAdmin(user.uid);
      if (!isAdmin) {
        await signOut(auth);
        router.navigate(['/admin/login']);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
};
