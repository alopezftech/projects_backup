import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * CHARACTER SEARCH COMPONENT - Componente de búsqueda de personajes
 *
 * Componente "dumb/presentational" que:
 * - Maneja entrada de usuario para búsqueda
 * - Normaliza input antes de emitir eventos
 * - Utiliza signal outputs (Angular 20)
 * - Optimizado con OnPush change detection
 *
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Signal outputs para mejor performance y type safety
 * - Normalización de input (trim, lowercase, espacios)
 * - Change detection OnPush
 * - Responsive design integrado
 * - Accesibilidad con labels y ARIA
 */
@Component({
  selector: 'app-character-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-search.component.html',
  styleUrl: './character-search.component.scss',
  changeDetection: ChangeDetectionStrategy.Default, // Cambiado a Default para consistencia
})
export class CharacterSearchComponent {
  searchTerm = '';

  // Signal output - nueva funcionalidad de Angular 20
  readonly search = output<string>();

  /**
   * Maneja el evento de búsqueda con normalización inteligente de input
   * Corrige errores comunes del usuario para mejorar los resultados de búsqueda
   */
  onSearch(): void {
    console.log(
      `🔍 CharacterSearchComponent.onSearch called with searchTerm: "${this.searchTerm}"`
    );

    const normalized = this.normalize(this.searchTerm);

    console.log(`🔍 Normalized in search component: "${normalized}"`);
    console.log(`📡 Emitting search event...`);

    this.search.emit(normalized);

    console.log(`✅ Search event emitted successfully`);
  }

  /**
   * Normaliza el término de búsqueda de forma simple y efectiva
   * - Elimina espacios internos entre el primer y último carácter
   * - Convierte todo a minúsculas
   * - Capitaliza solo la primera letra
   */
  private normalize(searchTerm: string): string {
    if (!searchTerm?.trim()) return '';

    console.log(`🔧 Starting normalization for: "${searchTerm}"`);

    // 1. Trim espacios al inicio y final
    let normalized = searchTerm.trim();

    // 2. Eliminar espacios internos (entre el primer y último carácter)
    normalized = normalized.replace(/\s+/g, '');
    console.log(`🔧 After removing internal spaces: "${normalized}"`);

    // 3. Convertir todo a minúsculas
    normalized = normalized.toLowerCase();
    console.log(`🔧 After lowercase: "${normalized}"`);

    // 4. Capitalizar solo la primera letra
    if (normalized.length > 0) {
      normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }

    console.log(`✅ Final normalized result: "${normalized}"`);
    return normalized;
  }
}
