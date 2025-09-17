import { Routes } from '@angular/router';
import { EnvEditorComponent } from './components/env-editor/env-editor.component';
import { ExecutionListComponent } from './components/execution-list/execution-list.component';

export const routes: Routes = [
  { path: 'home', component: ExecutionListComponent },
  { path: 'variables-entorno', component: EnvEditorComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
