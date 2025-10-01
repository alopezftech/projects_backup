import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditImage, AuditFilters } from '../../../interfaces/image.interface';
import { ImageCardComponent } from '../image-card/image-card';
import { trackByImageId } from '../../../utils/formatters.util';
import { PageType } from '../../../utils/constants.util';

@Component({
  selector: 'app-images-grid',
  imports: [CommonModule, ImageCardComponent],
  templateUrl: './images-grid.html',
  styleUrl: './images-grid.scss'
})
export class ImagesGridComponent {
  @Input() images: AuditImage[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() searchPerformed = false;
  @Input() activeFilters: AuditFilters = { faculty: '', studyType: '' };
  @Input() pageType: PageType = 'audit';
  
  // Page-specific configurations
  @Input() emptyStateTitle = 'No se encontraron imágenes';
  @Input() emptyStateMessage = 'Utiliza los filtros para buscar imágenes específicas';
  @Input() loadingMessage = 'Cargando imágenes...';
  @Input() reloadButtonText = 'Recargar';
  @Input() showEvaluateButton = false;
  
  @Output() imageClick = new EventEmitter<AuditImage>();
  @Output() imageEvaluate = new EventEmitter<{ image: AuditImage, event: Event }>();
  @Output() reload = new EventEmitter<void>();

  // Expose utility functions to template
  trackByImageId = trackByImageId;

  getCardType(): 'pending' | 'validated' | 'rejected' {
    switch (this.pageType) {
      case 'audit': return 'pending';
      case 'success': return 'validated';
      case 'failed': return 'rejected';
      default: return 'pending';
    }
  }

  onImageClick(image: AuditImage): void {
    this.imageClick.emit(image);
  }

  onImageEvaluate(data: { image: AuditImage, event: Event }): void {
    this.imageEvaluate.emit(data);
  }

  onReload(): void {
    this.reload.emit();
  }

  hasActiveFilters(): boolean {
    return !!(this.activeFilters.faculty || this.activeFilters.studyType);
  }
}
