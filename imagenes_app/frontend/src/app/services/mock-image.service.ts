import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuditImage, ApiResponse } from '../interfaces/image.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MockImageService {
  private mockImages: AuditImage[] = [];

  constructor(private configService: ConfigService) {
    this.generateMockImages();
  }

  private generateMockImages() {
    const faculties = [
      'Medicina', 'Escuela de negocios', 'Enfermeria', 'Educacion', 
      'Ingenieria', 'Informatica', 'Psicologia', 'Derecho',
      'Veterinaria', 'Humanidades', 'Periodismo y Comunicacion'
    ];

    const studyTypes = [
      'Curso', 'Experto', 'Master', 'Capacitacion Practica',
      'Master Semipresencial', 'Grand master', 'Master-universitario',
      'Grado', 'Doctorado'
    ];

    const statuses = ['Pendiente', 'Revisado', 'Rechazado'];
    const config = this.configService.mockConfig;

    // Generate exactly 10 images for each combination of faculty and studyType
    const imagesPerCombination = 10;
    let imageId = 1;
    
    for (const faculty of faculties) {
      for (const studyType of studyTypes) {
        for (let i = 1; i <= imagesPerCombination; i++) {
          // Use deterministic status distribution based on index
          const status = this.getDeterministicStatus(statuses, imageId);
          
          const image: AuditImage = {
            id: `mock-img-${imageId}`,
            name: `${faculty.toLowerCase().replace(/\s+/g, '-')}-${studyType.toLowerCase().replace(/\s+/g, '-')}-${i}.jpg`,
            url: this.generateImageBlob(300, 200, `${faculty} - ${studyType}`),
            size: this.getDeterministicSize(imageId), // Deterministic size based on ID
            uploadDate: this.generateDeterministicDate(imageId),
            Status: status,
            faculty: faculty,
            studyType: studyType
          };

          this.mockImages.push(image);
          imageId++;
        }
      }
    }

    console.log('🎭 Mock generated:', this.mockImages.length, 'images');
    console.log('📊 Distribution:', faculties.length, 'faculties ×', studyTypes.length, 'study types × 10 images each');
  }

  private getRandomStatus(statuses: string[]): string {
    const config = this.configService.mockConfig;
    const random = Math.random();
    
    if (config.statusDistribution) {
      let accumulated = 0;
      if (random < (accumulated += config.statusDistribution['Pendiente'])) return 'Pendiente';
      return 'Rechazado';
    }
    
    // Fallback to uniform random distribution
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getDeterministicStatus(statuses: string[], imageId: number): string {
    const config = this.configService.mockConfig;
    
    if (config.statusDistribution) {
      // Use imageId to create deterministic distribution
      const normalizedId = (imageId - 1) % 100; // Normalize to 0-99 range
      
      if (normalizedId < config.statusDistribution['Pendiente'] * 100) return 'Pendiente';
      if (normalizedId < (config.statusDistribution['Pendiente'] + config.statusDistribution['Revisado']) * 100) return 'Revisado';
      return 'Rechazado';
    }
    
    // Fallback to deterministic cycling through statuses
    return statuses[imageId % statuses.length];
  }

  private getDeterministicSize(imageId: number): number {
    // Generate deterministic file size between 100KB and 600KB based on imageId
    const minSize = 100000;
    const maxSize = 600000;
    const range = maxSize - minSize;
    
    // Use sine function for variety but deterministic results
    const normalized = (Math.sin(imageId * 0.1) + 1) / 2; // Normalize to 0-1
    return Math.floor(minSize + (normalized * range));
  }

  private generateDeterministicDate(imageId: number): string {
    // Generate deterministic dates spanning the last year
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 year ago
    const range = endDate.getTime() - startDate.getTime();
    
    // Use imageId to determine position in time range
    const timeOffset = (imageId * 123456789) % range; // Use large prime for distribution
    const randomDate = new Date(startDate.getTime() + timeOffset);
    
    return randomDate.toISOString();
  }

  private generateImageBlob(width: number, height: number, text: string): string {
    // Create canvas to generate image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Background with deterministic color based on text
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    // Use text hash for consistent color selection
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const backgroundColor = colors[Math.abs(hash) % colors.length];
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Add main text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2 - 10);
    
    // Add mock indicator
    ctx.font = '10px Arial';
    ctx.fillText(`MOCK IMAGE`, width / 2, height / 2 + 10);

    // Convert to blob URL
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  private generateRandomDate(): string {
    // This method is kept for backward compatibility but now uses deterministic generation
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString();
  }

  // Simulate API calls
  getImages(): Observable<ApiResponse> {
    console.log('🎭 Mock: Getting all images');
    return of({
      status: 'success',
      data: this.mockImages,
      message: 'Images obtained successfully (MOCK)'
    }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
  }

  getUnreviewedImages(): Observable<ApiResponse> {
    console.log('🎭 Mock: Getting unreviewed images');
    const unreviewedImages = this.mockImages.filter(img => img.Status === 'Pendiente');
    
    return of({
      status: 'success',
      data: unreviewedImages,
      message: 'Unreviewed images obtained successfully (MOCK)'
    }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
  }

  searchImagesWithFilters(filters: { 
    faculty?: string; 
    studyType?: string; 
    status?: string 
  }): Observable<ApiResponse> {
    console.log('🎭 Mock: Searching images with filters:', filters);
    
    let filteredImages = [...this.mockImages];

    if (filters.faculty) {
      filteredImages = filteredImages.filter(img => 
        img.faculty?.toLowerCase().includes(filters.faculty!.toLowerCase())
      );
    }

    if (filters.studyType) {
      filteredImages = filteredImages.filter(img => 
        img.studyType?.toLowerCase().includes(filters.studyType!.toLowerCase())
      );
    }

    if (filters.status) {
      filteredImages = filteredImages.filter(img => 
        img.Status === filters.status
      );
    }

    console.log('🎭 Mock: Found', filteredImages.length, 'images matching filters');

    return of({
      status: 'success',
      data: filteredImages,
      message: `${filteredImages.length} images found (MOCK)`
    }).pipe(delay(this.configService.mockConfig.networkDelay + 300 || 800)); // A bit more delay for searches
  }

  checkHealth(): Observable<ApiResponse> {
    console.log('🎭 Mock: Health check');
    return of({
      status: 'success',
      message: 'Mock service working correctly'
    }).pipe(delay(200));
  }

  processImages(processType: string): Observable<ApiResponse> {
    console.log('🎭 Mock: Processing images, type:', processType);
    return of({
      status: 'success',
      message: `Processing ${processType} completed (MOCK)`
    }).pipe(delay(1500));
  }

  uploadImage(name: string, data: string): Observable<ApiResponse> {
    console.log('🎭 Mock: Uploading image:', name);
    
    // Simulate new uploaded image
    const newImage: AuditImage = {
      id: `mock-img-new-${Date.now()}`,
      name: name,
      url: data,
      size: Math.floor(Math.random() * 500000) + 100000,
      uploadDate: new Date().toISOString(),
      Status: 'Pendiente',
      faculty: 'Mock',
      studyType: 'Test'
    };

    this.mockImages.push(newImage);

    return of({
      status: 'success',
      data: newImage,
      message: 'Image uploaded successfully (MOCK)'
    }).pipe(delay(1000));
  }

  deleteImage(id: string): Observable<ApiResponse> {
    console.log('🎭 Mock: Deleting image:', id);
    
    const index = this.mockImages.findIndex(img => img.id === id);
    if (index > -1) {
      this.mockImages.splice(index, 1);
      return of({
        status: 'success',
        message: 'Image deleted successfully (MOCK)'
      }).pipe(delay(500));
    }

    return of({
      status: 'error',
      message: 'Image not found (MOCK)'
    }).pipe(delay(500));
  }

  normalizeNames(): Observable<ApiResponse> {
    console.log('🎭 Mock: Normalizing image names');
    return of({
      status: 'success',
      message: 'Names normalized successfully (MOCK)'
    }).pipe(delay(1200));
  }

  verifyImages(): Observable<ApiResponse> {
    console.log('🎭 Mock: Verifying images');
    return of({
      status: 'success',
      data: {
        total: this.mockImages.length,
        pending: this.mockImages.filter(img => img.Status === 'Pendiente').length,
        reviewed: this.mockImages.filter(img => img.Status === 'Revisado').length
      },
      message: 'Verification completed (MOCK)'
    }).pipe(delay(800));
  }

  getValidatedImages(): Observable<ApiResponse> {
    console.log('🎭 Mock: Getting validated images');
    // Solo Status === 'Válida'
    const validatedImages = this.mockImages.filter(img => img.Status === 'Válida');
    return of({
      status: 'success',
      data: validatedImages,
      message: 'Validated images obtained successfully (MOCK)'
    }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
  }

  getRejectedImages(): Observable<ApiResponse> {
    console.log('🎭 Mock: Getting rejected images');
    // Solo Status === 'Rechazada'
    const rejectedImages = this.mockImages.filter(img => img.Status === 'Rechazada');
    return of({
      status: 'success',
      data: rejectedImages,
      message: 'Rejected images obtained successfully (MOCK)'
    }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
  }

  updateImageStatus(imageId: string, newStatus: 'Pendiente' | 'Válida' | 'Rechazada'): Observable<ApiResponse> {
    console.log('🎭 Mock: Updating image status:', imageId, 'to', newStatus);
    
    const image = this.mockImages.find(img => img.id === imageId);
    if (image) {
      image.Status = newStatus;
      return of({
        status: 'success',
        data: image,
        message: 'Image status updated successfully (MOCK)'
      }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
    }

    return of({
      status: 'error',
      message: 'Image not found (MOCK)'
    }).pipe(delay(this.configService.mockConfig.networkDelay || 500));
  }
}
