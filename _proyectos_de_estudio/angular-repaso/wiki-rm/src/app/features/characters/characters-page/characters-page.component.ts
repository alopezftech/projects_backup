import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggerService } from '../../../core/services/logger.service';
import { CharacterService } from '../../../shared/services/character.service';
import {
  Character,
  CharacterDetailComponent,
} from '../character-detail/character-detail.component';
import { CharacterSearchComponent } from '../character-search/character-search.component';

/**
 * CHARACTERS PAGE COMPONENT - Versión optimizada siguiendo mejores prácticas
 *
 * Funcionalidades:
 * - Búsqueda y paginación de personajes con Angular 20 signals
 * - Modal responsive para detalles
 * - Change detection optimizada con OnPush
 * - Manejo de errores centralizado
 * - Dependency injection moderna con inject()
 * - Logging estructurado de operaciones
 */
@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, CharacterSearchComponent, CharacterDetailComponent],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent implements OnInit, OnDestroy {
  // Dependency injection moderna (Angular 20)
  private readonly characterService = inject(CharacterService);
  private readonly logger = inject(LoggerService);
  private readonly cdr = inject(ChangeDetectorRef);

  // State usando signals (Angular 20)
  protected readonly characters = signal<Character[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  protected readonly totalPages = signal<number>(1);
  protected readonly lastSearch = signal<string>('');

  // Estado del modal
  protected readonly selectedCharacter = signal<Character | null>(null);
  protected readonly showModal = signal<boolean>(false);

  // Para cleanup de subscripciones
  private readonly destroy$ = new Subject<void>();

  /**
   * Inicialización - cargar primera página
   */
  ngOnInit(): void {
    this.logger.info('CharactersPageComponent initialized');
    this.loadCharacters(1, '');
  }

  /**
   * Cleanup de subscripciones
   */
  ngOnDestroy(): void {
    this.logger.debug('CharactersPageComponent destroyed');
    this.destroy$.next();
    this.destroy$.complete();

    // Asegurar que el scroll se reestablezca al destruir el componente (solo en el cliente)
    this.restoreBodyScroll();
  }

  /**
   * Cargar personajes desde la API
   */
  private loadCharacters(page: number, searchTerm: string = ''): void {
    this.logger.info('Loading characters', { page, searchTerm });

    // Reset estado
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    // Limpiar personajes solo si es nueva búsqueda
    if (searchTerm !== this.lastSearch()) {
      this.characters.set([]);
    }
    this.lastSearch.set(searchTerm);

    // Forzar actualización de UI para mostrar loading
    this.cdr.detectChanges();

    // Realizar petición usando el servicio
    this.characterService
      .getCharacters(page, searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.characters.set(response.results || []);
          this.totalPages.set(response.info?.pages || 1);
          this.loading.set(false);

          // Si no hay resultados y hay término de búsqueda, mostrar mensaje específico
          if ((response.results?.length || 0) === 0 && searchTerm) {
            this.error.set(`No se encontraron personajes para "${searchTerm}"`);
            this.logger.info('No characters found for search term', { searchTerm });
          } else {
            this.logger.info('Characters loaded successfully', {
              count: response.results?.length || 0,
              page,
              totalPages: response.info?.pages || 1,
              searchTerm,
            });
          }

          // Forzar actualización de UI con los nuevos datos
          this.cdr.detectChanges();
        },
        error: error => {
          this.logger.error('Error loading characters', { error, page, searchTerm });
          this.characters.set([]);

          // Mensaje de error más específico
          if (searchTerm) {
            this.error.set(`Error al buscar "${searchTerm}". Inténtalo de nuevo.`);
          } else {
            this.error.set('No se pudieron cargar los personajes. Inténtalo de nuevo.');
          }

          this.loading.set(false);
          this.totalPages.set(1);

          // Forzar actualización de UI para mostrar error
          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Manejar búsqueda desde el componente hijo
   */
  protected onSearch(searchTerm: string): void {
    this.logger.debug('Search requested', { searchTerm });
    this.loadCharacters(1, searchTerm);
  }

  /**
   * Reintentar carga de personajes
   */
  protected onRetry(): void {
    this.logger.debug('Retry requested');
    this.loadCharacters(this.currentPage(), this.lastSearch());
  }

  /**
   * Navegación entre páginas
   */
  protected goToPage(page: number): void {
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();
    const isLoading = this.loading();

    if (page !== currentPage && page >= 1 && page <= totalPages && !isLoading) {
      this.logger.debug('Navigation to page', { from: currentPage, to: page });
      this.loadCharacters(page, this.lastSearch());
    }
  }

  /**
   * Abrir modal con detalles del personaje
   */
  protected onSelectCharacter(character: Character): void {
    this.logger.debug('Character selected for modal', {
      characterId: character.id,
      name: character.name,
    });

    this.selectedCharacter.set(character);
    this.showModal.set(true);
    this.disableBodyScroll();
  }

  /**
   * Cerrar modal
   */
  protected closeModal(): void {
    this.logger.debug('Modal closed');

    this.showModal.set(false);
    this.selectedCharacter.set(null);
    this.restoreBodyScroll();
  }

  /**
   * Cerrar modal con tecla Escape
   */
  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.showModal()) {
      this.logger.debug('Modal closed via Escape key');
      this.closeModal();
    }
  }

  /**
   * Deshabilitar scroll del body para modal
   */
  private disableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Restaurar scroll del body
   */
  private restoreBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }
}
