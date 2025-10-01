export interface AuditImage {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  Status: string;
  faculty?: string;
  studyType?: string;
}

export interface AuditFilters {
  faculty: string;
  studyType: string;
}

export interface ApiResponse {
  status: string;
  data?: any;
  message?: string;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  data?: any;
}
