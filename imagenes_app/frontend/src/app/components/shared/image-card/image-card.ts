import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditImage } from '../../../interfaces/image.interface';
import { formatFileSize, formatDate } from '../../../utils/formatters.util';
import { IMAGE_STATUS_ICONS, IMAGE_STATUS_CLASSES, ImageStatus } from '../../../utils/constants.util';

@Component({
  selector: 'app-image-card',
  imports: [CommonModule],
  templateUrl: './image-card.html',
  styleUrl: './image-card.scss'
})
export class ImageCardComponent {
  @Input() image!: AuditImage;
  @Input() cardType: 'pending' | 'validated' | 'rejected' = 'pending';
  @Input() showEvaluateButton = false;
  
  @Output() cardClick = new EventEmitter<AuditImage>();
  @Output() evaluateClick = new EventEmitter<{ image: AuditImage, event: Event }>();

  // Expose utility functions to template
  formatFileSize = formatFileSize;
  formatDate = formatDate;

  getStatusIcon(): string {
    return IMAGE_STATUS_ICONS[this.image.Status as ImageStatus] || '❓';
  }

  getStatusClass(): string {
    return IMAGE_STATUS_CLASSES[this.image.Status as ImageStatus] || 'unknown';
  }

  onCardClick(): void {
    this.cardClick.emit(this.image);
  }

  onEvaluateClick(event: Event): void {
    event.stopPropagation();
    this.evaluateClick.emit({ image: this.image, event });
  }
}
