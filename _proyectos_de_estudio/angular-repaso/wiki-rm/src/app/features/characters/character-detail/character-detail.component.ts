import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * INTERFAZ CHARACTER - Modelo de datos para personajes de Rick & Morty
 * 
 * Define la estructura completa de un personaje según la API oficial.
 * Usando readonly properties para inmutabilidad y mejor performance.
 */
export interface Character {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  readonly status: string;
  readonly species: string;
  readonly gender: string;
  readonly origin: { name: string };
  readonly location: { name: string };
}

/**
 * CHARACTER DETAIL COMPONENT - Componente de presentación para detalles de personaje
 * 
 * Componente "dumb/presentational" que:
 * - Recibe datos vía signal inputs (Angular 20)
 * - Solo presenta información, sin lógica de negocio
 * - Optimizado con OnPush change detection
 * - Standalone component siguiendo arquitectura moderna
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Signal inputs para mejor performance
 * - Change detection OnPush para optimización
 * - TypeScript strict mode compliance
 * - Responsive design integrado
 * - Accesibilidad (a11y) considerada
 */
@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent {
  // Signal input - nueva funcionalidad de Angular 20
  readonly character = input.required<Character>();
}
