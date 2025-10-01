import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { BasePageService } from '../../services/base-page.service';
import { ImagesGridComponent } from '../../components/shared/images-grid/images-grid';
import { ImageModalComponent } from '../../components/shared/image-modal/image-modal';
import { AuditImage } from '../../interfaces/image.interface';

@Component({
  selector: 'app-audit',
  imports: [CommonModule, ImagesGridComponent, ImageModalComponent],
  templateUrl: './audit.html',
  styleUrl: './audit.scss'
})
export class AuditPage implements OnInit, OnDestroy {
  private appService = inject(AppService);
  protected basePageService = inject(BasePageService);
  private router = inject(Router);
  private navigationSubscription: any;

  get filteredImages(): AuditImage[] {
    return this.basePageService.images.filter(img => img.Status === 'Pendiente');
  }
  ngOnInit() {
    this.basePageService.initializePage('audit', 'Pendiente');
    this.onReload(); // Recarga automáticamente al entrar
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.onReload();
      }
    });
  }

  ngOnDestroy() {
    this.basePageService.cleanup();
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onReload() {
    this.basePageService.reloadImages('audit', () => this.appService.getUnreviewedImages());
  }

  onImageClick(image: AuditImage) {
    this.basePageService.enlargeImage(image);
  }

  onImageEvaluate(data: { image: AuditImage, event: Event }) {
    this.basePageService.evaluateImage(data.image, data.event);
  }

  onModalClose() {
    this.basePageService.closeEnlargedImage();
  }

  onStatusUpdate(data: { imageId: string, status: 'Pendiente' | 'Válida' | 'Rechazada' }) {
    this.basePageService.updateImageStatus(data.imageId, data.status);
  }
}
