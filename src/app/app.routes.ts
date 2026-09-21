import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { TarifsDuJour } from './pages/tarifs-du-jour/tarifs-du-jour';
import { AdminLogin } from './admin/login/login';
import { AdminShell } from './admin/shell/shell';
import { Dashboard } from './admin/dashboard/dashboard';
import { Stats } from './admin/stats/stats';
import { Archive } from './admin/archive/archive';
import { AttemptForm } from './admin/attempt-form/attempt-form';
import { AttemptDetail } from './admin/attempt-detail/attempt-detail';
import { FleetAdmin } from './admin/fleet-admin/fleet-admin';
import { FleetForm } from './admin/fleet-form/fleet-form';
import { authGuard } from './admin/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'tarifs-du-jour', component: TarifsDuJour },
  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin',
    component: AdminShell,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'stats', component: Stats },
      { path: 'archive', component: Archive },
      { path: 'fleet', component: FleetAdmin },
      { path: 'fleet/new', component: FleetForm },
      { path: 'fleet/:id', component: FleetForm },
      { path: 'new', component: AttemptForm },
      { path: ':id', component: AttemptDetail },
    ],
  },
  { path: '**', redirectTo: '' },
];
