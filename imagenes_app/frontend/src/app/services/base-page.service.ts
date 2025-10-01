import { Injectable, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { FiltersService } from './filters.service';
import {
  AuditImage,
  ApiResponse,
  AuditFilters,
} from '../interfaces/image.interface';
import { PageType } from '../utils/constants.util';

@Injectable({
  providedIn: 'root',
})
export class BasePageService {
  private appService = inject(AppService);
  private filtersService = inject(FiltersService);

  // Common page state
  images: AuditImage[] = [];
  loading = false;
  error = '';
  enlargedImage: AuditImage | null = null;
  activeFilters: AuditFilters = { faculty: '', studyType: '' };
  searchPerformed = false;
  evaluationLoading = false;

  // Subscriptions
  private filtersSubscription: Subscription | null = null;
  private manualSearchSubscription: Subscription | null = null;

  /**
   * Initialize base page functionality
   * @param pageType - Type of page (audit, success, failed)
   * @param statusForPage - Status to filter by for this page type
   */
  initializePage(pageType: PageType, statusForPage: string): void {
    console.log(`📄 Initializing ${pageType} page`);

    // Subscribe to filter changes
    this.filtersSubscription = this.filtersService.filters$.subscribe(
      (filters) => {
        console.log(`📄 Filters updated in ${pageType}:`, filters);
        this.activeFilters = filters;
      }
    );

    // Subscribe to manual searches
    this.manualSearchSubscription = this.filtersService.manualSearch$.subscribe(
      (filters) => {
        console.log(`📄 Manual search received in ${pageType}:`, filters);
        this.searchFromButton(filters, statusForPage);
      }
    );
  }

  /**
   * Clean up subscriptions
   */
  cleanup(): void {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
    if (this.manualSearchSubscription) {
      this.manualSearchSubscription.unsubscribe();
    }
  }

  /**
   * Search images from button click with confirmation for empty filters
   */
  searchFromButton(filters: AuditFilters, statusForPage: string): void {
    console.log('📄 Search initiated from button with filters:', filters);
    this.activeFilters = filters;

    // Show confirmation if no filters are selected
    if (!filters.faculty && !filters.studyType) {
      const statusText = this.getStatusText(statusForPage);
      const confirm = window.confirm(
        `⚠️ Vas a cargar TODAS las imágenes ${statusText} disponibles sin filtros.\n\n` +
          'Esto puede tardar varios segundos y consumir recursos.\n\n' +
          '¿Deseas continuar?'
      );

      if (confirm) {
        this.searchImages(statusForPage);
      }
    } else {
      this.searchImages(statusForPage);
    }
  }

  /**
   * Search images with filters
   */
  searchImages(statusForPage: string): void {
    this.loading = true;
    this.error = '';
    this.searchPerformed = true;

    const searchFilters = {
      faculty: this.activeFilters.faculty || undefined,
      studyType: this.activeFilters.studyType || undefined,
      status: statusForPage,
    };

    console.log('📄 Sending search with filters:', searchFilters);

    this.appService.searchImagesWithFilters(searchFilters).subscribe({
      next: (response: ApiResponse) => {
        console.log('📸 Images obtained with filters:', response);
        this.images = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error searching images:', error);
        this.error = `Error al buscar las imágenes ${this.getStatusText(
          statusForPage
        )}`;
        this.loading = false;
      },
    });
  }

  /**
   * Reload all images for the page type
   */
  reloadImages(
    pageType: PageType,
    reloadMethod: () => Observable<ApiResponse>
  ): void {
    this.loading = true;
    this.error = '';
    this.searchPerformed = false;

    console.log(`🔄 Reloading all images for ${pageType} page`);

    reloadMethod().subscribe({
      next: (response: ApiResponse) => {
        console.log(`📸 Images reloaded for ${pageType}:`, response);
        this.images = response.data || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error(`❌ Error reloading ${pageType} images:`, error);
        this.error = `Error al recargar las imágenes desde el blob storage`;
        this.loading = false;
      },
    });
  }

  /**
   * Enlarge image (open modal)
   */
  enlargeImage(image: AuditImage): void {
    this.enlargedImage = image;
  }

  /**
   * Close enlarged image (close modal)
   */
  closeEnlargedImage(): void {
    this.enlargedImage = null;
  }

  /**
   * Update image status (for audit page)
   */
  updateImageStatus(
    imageId: string,
    newStatus: 'Pendiente' | 'Válida' | 'Rechazada'
  ): void {
    this.evaluationLoading = true;

    console.log('🔍 Updating image status:', imageId, 'to', newStatus);

    this.appService.updateImageStatus(imageId, newStatus).subscribe({
      next: (response: ApiResponse) => {
        console.log('✅ Status updated:', response);

        // If status changed and is no longer "Pendiente", remove from audit list
        if (newStatus !== 'Pendiente') {
          this.images = this.images.filter((img) => img.id !== imageId);
        } else {
          // If kept pending, update status in list
          const imageIndex = this.images.findIndex((img) => img.id === imageId);
          if (imageIndex > -1) {
            this.images[imageIndex].Status = newStatus;
          }
        }

        this.evaluationLoading = false;
        this.closeEnlargedImage();
      },
      error: (error: any) => {
        console.error('❌ Error updating image status:', error);
        this.evaluationLoading = false;
      },
    });
  }

  /**
   * Handle evaluate image click (prevent modal opening)
   */
  evaluateImage(image: AuditImage, event: Event): void {
    event.stopPropagation();
    this.enlargeImage(image);
  }

  /**
   * Get user-friendly status text
   */
  private getStatusText(status: string): string {
    switch (status) {
      case 'Pendiente':
        return 'pendientes';
      case 'Válida':
        return 'válidas';
      case 'Rechazada':
        return 'rechazadas';
      default:
        return '';
    }
  }
}
