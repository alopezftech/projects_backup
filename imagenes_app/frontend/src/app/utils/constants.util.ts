/**
 * Application-wide constants
 */

export const IMAGE_STATUS = {
  PENDING: 'Pendiente',
  VALIDATED: 'Válida', 
  REJECTED: 'Rechazada'
} as const;

export const IMAGE_STATUS_ICONS = {
  [IMAGE_STATUS.PENDING]: '⏳',
  [IMAGE_STATUS.VALIDATED]: '✅',
  [IMAGE_STATUS.REJECTED]: '❌'
} as const;

export const IMAGE_STATUS_CLASSES = {
  [IMAGE_STATUS.PENDING]: 'pending',
  [IMAGE_STATUS.VALIDATED]: 'validated',
  [IMAGE_STATUS.REJECTED]: 'rejected'
} as const;

export const PAGE_TYPES = {
  AUDIT: 'audit',
  SUCCESS: 'success',
  FAILED: 'failed'
} as const;

export type ImageStatus = typeof IMAGE_STATUS[keyof typeof IMAGE_STATUS];
export type PageType = typeof PAGE_TYPES[keyof typeof PAGE_TYPES];
