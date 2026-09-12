import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { AdminLogin } from './admin/login/login';
import { AdminShell } from './admin/shell/shell';
import { Dashboard } from './admin/dashboard/dashboard';
import { AttemptForm } from './admin/attempt-form/attempt-form';
import { AttemptDetail } from './admin/attempt-detail/attempt-detail';
import { authGuard } from './admin/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin',
    component: AdminShell,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'new', component: AttemptForm },
      { path: ':id', component: AttemptDetail },
    ],
  },
  { path: '**', redirectTo: '' },
];
