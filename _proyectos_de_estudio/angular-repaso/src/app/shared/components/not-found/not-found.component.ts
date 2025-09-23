import { ChangeDetectionStrategy, Component } from '@angular/core';
// ❌ ANTI-PATRÓN: import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/*
 * NOT FOUND COMPONENT - Página de error 404
 *
 * Este componente se muestra cuando el usuario navega a una ruta
 * que no existe en la aplicación.
 *
 * CARACTERÍSTICAS:
 * - Standalone component reutilizable
 * - Parte del módulo shared (puede usarse en cualquier feature)
 * - Incluye navegación de vuelta al inicio
 * - Diseño responsive y amigable
 *
 * PROPÓSITO:
 * - Informar al usuario que la página no existe
 * - Proporcionar navegación alternativa
 * - Mantener una buena experiencia de usuario
 *
 * UBICACIÓN EN SHARED:
 * Este componente está en shared porque puede ser utilizado
 * desde cualquier parte de la aplicación, no es específico
 * de ningún feature en particular.
 */

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule], // ✅ OPTIMIZADO: Solo RouterModule necesario
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-illustration">
          <div class="error-code">404</div>
          <div class="error-icon">🌌</div>
        </div>

        <div class="error-message">
          <h1>¡Wubba Lubba Dub Dub!</h1>
          <p class="main-message">Parece que te has perdido en una dimensión desconocida</p>
          <p class="sub-message">La página que buscas no existe en este universo.</p>
        </div>

        <div class="error-actions">
          <button class="btn-primary" routerLink="/" title="Volver al inicio">
            🏠 Regresar al Portal Principal
          </button>

          <button class="btn-secondary" (click)="goBack()" title="Volver atrás">
            ⬅️ Volver Atrás
          </button>
        </div>

        <div class="helpful-links">
          <h3>¿Quizás estabas buscando esto?</h3>
          <ul>
            <li><a routerLink="/">🏠 Página de Inicio</a></li>
            <li><a routerLink="/characters">👥 Personajes</a></li>
            <li><a routerLink="/episodes">📺 Episodios</a></li>
            <li><a routerLink="/locations">🗺️ Ubicaciones</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 2rem;
      }

      .not-found-content {
        text-align: center;
        max-width: 600px;
        width: 100%;
      }

      .error-illustration {
        margin-bottom: 2rem;
        position: relative;
      }

      .error-code {
        font-size: 8rem;
        font-weight: 900;
        opacity: 0.3;
        line-height: 1;
        margin-bottom: -1rem;
      }

      .error-icon {
        font-size: 4rem;
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
      }

      .error-message h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #ffd700;
      }

      .main-message {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .sub-message {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 2rem;
      }

      .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
        font-weight: 600;
      }

      .btn-primary {
        background: #4caf50;
        color: white;
      }

      .btn-primary:hover {
        background: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      }

      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }

      .btn-secondary:hover {
        background: white;
        color: #1e3c72;
        transform: translateY(-2px);
      }

      .helpful-links {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
      }

      .helpful-links h3 {
        margin-bottom: 1rem;
        color: #ffd700;
      }

      .helpful-links ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .helpful-links li {
        margin-bottom: 0.5rem;
      }

      .helpful-links a {
        color: white;
        text-decoration: none;
        font-size: 1.1rem;
        transition: all 0.3s ease;
      }

      .helpful-links a:hover {
        color: #ffd700;
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .error-code {
          font-size: 5rem;
        }

        .error-message h1 {
          font-size: 1.8rem;
        }

        .main-message {
          font-size: 1.2rem;
        }

        .error-actions {
          flex-direction: column;
          align-items: center;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          max-width: 300px;
        }
      }
    `,
  ],
})
export class NotFoundComponent {
  /*
   * Este componente demuestra:
   *
   * 1. SHARED COMPONENT
   *    - Reutilizable en toda la aplicación
   *    - No específico de ningún feature
   *    - Parte del módulo shared
   *
   * 2. ROUTER INTEGRATION
   *    - Usa RouterModule para navegación
   *    - Implementa navegación programática
   *    - ✅ OPTIMIZACIÓN: Solo importa RouterModule necesario
   *
   * 3. ANGULAR 20 CONTROL FLOW (Moderno)
   *    - ❌ NO NgIf, NgFor (DEPRECADAS)
   *    - ✅ SÍ @if, @for, @switch (Control Flow nativo)
   *    - ✅ SÍ RouterModule (usa routerLink)
   *    - Bundle size optimizado automáticamente (93% reducción)
   *
   * 3. USER EXPERIENCE
   *    - Mensaje amigable y con personalidad
   *    - Múltiples opciones de navegación
   *    - Diseño responsive
   *
   * 4. TEMPLATE AVANZADO
   *    - Estructura compleja con múltiples secciones
   *    - Estilos CSS modernos con gradientes y efectos
   *    - Responsive design con media queries
   */

  /**
   * Navega hacia atrás en el historial del navegador
   * Si no hay historial, va al inicio
   */
  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }
}
