import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditImage } from '../../../interfaces/image.interface';
import { formatFileSize, formatDate } from '../../../utils/formatters.util';
import { IMAGE_STATUS_ICONS, IMAGE_STATUS_CLASSES, ImageStatus } from '../../../utils/constants.util';

@Component({
  selector: 'app-image-modal',
  imports: [CommonModule],
  templateUrl: './image-modal.html',
  styleUrl: './image-modal.scss'
})
export class ImageModalComponent {
  @Input() image: AuditImage | null = null;
  @Input() showEvaluationActions = false;
  @Input() evaluationLoading = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdate = new EventEmitter<{ imageId: string, status: 'Pendiente' | 'Válida' | 'Rechazada' }>();

  // Expose utility functions to template
  formatFileSize = formatFileSize;
  formatDate = formatDate;

  getStatusIcon(): string {
    if (!this.image) return '❓';
    return IMAGE_STATUS_ICONS[this.image.Status as ImageStatus] || '❓';
  }

  getStatusClass(): string {
    if (!this.image) return 'unknown';
    return IMAGE_STATUS_CLASSES[this.image.Status as ImageStatus] || 'unknown';
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onStatusUpdate(status: 'Pendiente' | 'Válida' | 'Rechazada'): void {
    if (this.image) {
      this.statusUpdate.emit({ imageId: this.image.id, status });
    }
  }
}
