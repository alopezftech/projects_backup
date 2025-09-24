import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/*
 * HOME PAGE COMPONENT - Página principal de Rick & Morty Wiki
 *
 * Esta página sirve como punto de entrada a la wiki y presenta:
 * - Introducción atractiva a la serie Rick & Morty
 * - Navegación a las secciones principales (Personajes, Episodios, Curiosidades)
 * - Información sobre la wiki y sus características
 * - Diseño responsive con tema inspirado en la serie
 *
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Angular 20 Control Flow para navegación
 * - RouterLink para navegación SPA
 * - Semantic HTML5 para accesibilidad
 * - Responsive design mobile-first
 * - Tema visual de Rick & Morty
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  /*
   * Componente puramente presentacional que actúa como landing page
   * de la wiki de Rick & Morty.
   *
   * En el futuro se podría extender con:
   * - Estadísticas dinámicas de la API
   * - Contenido destacado o últimas actualizaciones
   * - Búsqueda rápida desde la home
   * - Personajes o episodios aleatorios
   */

  constructor() {
    // Constructor vacío - componente presentacional
  }
}
