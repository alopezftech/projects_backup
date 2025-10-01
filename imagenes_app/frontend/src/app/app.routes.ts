import { Routes } from '@angular/router';
import { AuditPage } from './pages/audit/audit';
import { SuccessPage } from './pages/success/success';
import { FailedPage } from './pages/failed/failed';

export const routes: Routes = [
  { path: '', redirectTo: '/audit', pathMatch: 'full' },
  { path: 'audit', component: AuditPage },
  { path: 'success', component: SuccessPage },
  { path: 'failed', component: FailedPage },
  { path: '**', redirectTo: '/audit' }
];
