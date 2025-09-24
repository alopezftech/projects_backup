import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MobileMenuComponent } from '../../shared/components/mobile-menu/mobile-menu.component';

/**
 * HEADER DE NAVEGACIÓN - Rick & Morty Wiki
 *
 * Componente de layout que proporciona navegación principal entre las secciones de la wiki.
 * Implementa las mejores prácticas de Angular 20:
 * - Standalone component
 * - RouterLink para navegación SPA
 * - Responsive design
 * - Accesibilidad integrada
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MobileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMenuOpen = false;
  protected readonly navigationLinks = [
    {
      path: '/home',
      label: 'Inicio',
      description: 'Página principal de la wiki',
    },
    {
      path: '/personajes',
      label: 'Personajes',
      description: 'Explorar todos los personajes de Rick & Morty',
    },
    {
      path: '/episodios',
      label: 'Episodios',
      description: 'Ver todos los episodios de la serie',
    },
    {
      path: '/curiosidades',
      label: 'Curiosidades',
      description: 'Datos curiosos y estadísticas',
    },
  ];

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
