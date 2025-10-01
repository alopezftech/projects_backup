import { execSync } from 'child_process';
import path from 'path';

export interface ImageFilters {
    faculty?: string;
    studyType?: string;
    status?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    prioridad?: number;
    pageSize?: number;
    page?: number;
}

export interface SharePointFile {
    id: string;
    name: string;
    path: string;
    size: number;
    created: string;
    modified: string;
    // Metadatos de la Opción 2
    facultad?: string;
    tipoEstudio?: string;
    estadoAuditoria?: string;
    prioridadAuditoria?: number;
    revisadoPor?: string;
    motivoRechazo?: string;
}

/**
 * SharePoint Service para Opción 2: Metadatos SharePoint
 * Usa columnas de metadatos para consultas optimizadas
 */
export class SharePointService {
    private readonly pythonScriptPath: string;

    constructor() {
        this.pythonScriptPath = path.join(__dirname, '../../sharepoint/sharepoint_audit.py');
    }

    /**
     * Ejecuta script Python con manejo de errores
     */
    private async executePythonScript(action: string, ...args: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const env = {
                    ...process.env,
                    TENANT_ID: process.env.SHAREPOINT_TENANT_ID,
                    CLIENT_ID: process.env.SHAREPOINT_CLIENT_ID,
                    CLIENT_SECRET: process.env.SHAREPOINT_CLIENT_SECRET,
                    SITE_URL: process.env.SHAREPOINT_SITE_URL,
                };

                const command = `python "${this.pythonScriptPath}" ${action} ${args.join(' ')}`;
                console.log(`🐍 Ejecutando: ${action} con argumentos: ${args.join(' ')}`);

                const stdout = execSync(command, {
                    cwd: path.dirname(this.pythonScriptPath),
                    env: env,
                    encoding: 'utf8',
                    timeout: 30000,
                    maxBuffer: 1024 * 1024
                });

                const result = JSON.parse(stdout);
                resolve(result);

            } catch (error: any) {
                console.error(`❌ Error ejecutando Python: ${error.message}`);
                reject(new Error(`Python script failed: ${error.message}`));
            }
        });
    }

    /**
     * OPCIÓN 2: Búsqueda con filtros por metadatos SharePoint
     * Query: $filter=Facultad eq 'Medicina' and EstadoAuditoria eq 'Pendiente'
     */
    async searchImagesWithFilters(status: string, faculty?: string, studyType?: string, page: number = 1, pageSize: number = 20): Promise<any> {
        try {
            const facultyArg = faculty || 'null';
            const studyTypeArg = studyType || 'null';
            
            const result = await this.executePythonScript('search_metadata', status, facultyArg, studyTypeArg, page.toString(), pageSize.toString());
            
            if (result.status === 'success') {
                return {
                    images: result.data || [],
                    pagination: result.pagination || {
                        page: 1,
                        page_size: pageSize,
                        count: result.data?.length || 0,
                        has_more: false,
                        total_estimated: result.data?.length || 0
                    },
                    filters_applied: {
                        status,
                        faculty: faculty || 'todas',
                        studyType: studyType || 'todos'
                    },
                    source: 'metadata_columns'
                };
            } else {
                throw new Error(result.error || 'Error en búsqueda por metadatos');
            }
        } catch (error) {
            console.error('❌ Error en searchImagesWithFilters:', error);
            throw new Error('Error en búsqueda con filtros de metadatos');
        }
    }

    /**
     * Obtener facultades disponibles desde columna Facultad
     */
    async getAvailableFaculties(): Promise<string[]> {
        try {
            const result = await this.executePythonScript('get_metadata_faculties');
            
            if (result.status === 'success') {
                return result.faculties || [
                    'Medicina', 'Ingeniería', 'Derecho', 'Ciencias', 
                    'Humanidades', 'Economía', 'Educación', 'Psicología',
                    'Arquitectura', 'Comunicación'
                ];
            } else {
                throw new Error(result.error || 'Error obteniendo facultades');
            }
        } catch (error) {
            console.error('❌ Error en getAvailableFaculties:', error);
            // Fallback con valores predefinidos
            return [
                'Medicina', 'Ingeniería', 'Derecho', 'Ciencias', 
                'Humanidades', 'Economía', 'Educación', 'Psicología',
                'Arquitectura', 'Comunicación'
            ];
        }
    }

    /**
     * Obtener tipos de estudio disponibles desde columna TipoEstudio
     */
    async getAvailableStudyTypes(): Promise<string[]> {
        try {
            const result = await this.executePythonScript('get_metadata_study_types');
            
            if (result.status === 'success') {
                return result.study_types || ['Grado', 'Master', 'Doctorado', 'Formación Continua'];
            } else {
                throw new Error(result.error || 'Error obteniendo tipos de estudio');
            }
        } catch (error) {
            console.error('❌ Error en getAvailableStudyTypes:', error);
            // Fallback con valores predefinidos
            return ['Grado', 'Master', 'Doctorado', 'Formación Continua'];
        }
    }

    /**
     * Validar imagen - actualizar metadatos
     */
    async validateImage(imageId: string, faculty: string, studyType: string, reviewedBy: string): Promise<boolean> {
        try {
            const result = await this.executePythonScript('update_metadata', imageId, 'EstadoAuditoria', 'Aprobado', 'Facultad', faculty, 'TipoEstudio', studyType, 'RevisadoPor', reviewedBy);
            
            if (result.success) {
                console.log(`✅ Imagen ${imageId} validada con metadatos actualizados`);
                return true;
            } else {
                throw new Error(result.error || 'Error validando imagen');
            }
        } catch (error) {
            console.error('❌ Error validando imagen:', error);
            throw error;
        }
    }

    /**
     * Rechazar imagen - actualizar metadatos con motivo
     */
    async rejectImage(imageId: string, faculty: string, studyType: string, reviewedBy: string, reason: string): Promise<boolean> {
        try {
            const result = await this.executePythonScript('update_metadata', imageId, 'EstadoAuditoria', 'Rechazado', 'Facultad', faculty, 'TipoEstudio', studyType, 'RevisadoPor', reviewedBy, 'MotivoRechazo', reason);
            
            if (result.success) {
                console.log(`✅ Imagen ${imageId} rechazada con metadatos actualizados`);
                return true;
            } else {
                throw new Error(result.error || 'Error rechazando imagen');
            }
        } catch (error) {
            console.error('❌ Error rechazando imagen:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas por metadatos
     */
    async getStats(): Promise<any> {
        try {
            const result = await this.executePythonScript('get_metadata_stats');
            
            if (result.status === 'success') {
                return result.stats || {
                    by_faculty: {},
                    by_status: {
                        'Pendiente': 0,
                        'Aprobado': 0,
                        'Rechazado': 0
                    },
                    by_study_type: {},
                    total_images: 0
                };
            } else {
                throw new Error(result.error || 'Error obteniendo estadísticas');
            }
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    /**
     * Probar conectividad con SharePoint y metadatos
     */
    async testConnection(): Promise<boolean> {
        try {
            const result = await this.executePythonScript('test_metadata_connection');
            return result.success === true;
        } catch (error) {
            console.error('❌ Error testing connection:', error);
            return false;
        }
    }
}



