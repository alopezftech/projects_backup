import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * INTERFAZ NAVIGATION LINK - Estructura para enlaces de navegación
 */
interface NavigationLink {
  readonly path: string;
  readonly label: string;
  readonly description: string;
}

/**
 * MOBILE MENU COMPONENT - Componente de menú móvil responsive
 * 
 * Componente "dumb/presentational" que:
 * - Muestra/oculta menú de navegación en mobile
 * - Utiliza signal inputs/outputs (Angular 20)
 * - Optimizado con OnPush change detection
 * - Responsive design con breakpoints
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Signal inputs/outputs para mejor performance
 * - Type safety con interfaces
 * - Change detection OnPush
 * - Accesibilidad con ARIA attributes
 * - Touch-friendly interactions
 */
@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  // Signal inputs - nueva funcionalidad de Angular 20
  readonly links = input<NavigationLink[]>([]);
  readonly open = input<boolean>(false);
  
  // Signal output - nueva funcionalidad de Angular 20  
  readonly closeMenu = output<void>();

  /**
   * Emite evento para cerrar el menú
   */
  onCloseMenu(): void {
    this.closeMenu.emit();
  }
}
