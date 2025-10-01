/**
 * Utility functions for formatting data across the application
 */

/**
 * Formats file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats date string to localized Spanish format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "15 Sep 2024, 14:30")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Track by function for image arrays in *ngFor loops
 * @param index - Array index
 * @param image - Image object
 * @returns Unique identifier for tracking
 */
export function trackByImageId(index: number, image: { id: string }): string {
  return image.id;
}
