
import { Routes } from '@angular/router';

export const characterRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./characters-page/characters-page.component').then(m => m.CharactersPageComponent),
    title: 'Characters - Rick & Morty Wiki'
  }
];
