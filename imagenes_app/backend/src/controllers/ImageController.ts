import { Request, Response } from 'express';
import { SharePointService } from '../services/sharePointService';

export class ImageController {
    private sharePointService: SharePointService;

    constructor() {
        this.sharePointService = new SharePointService();
    }

    /**
     * Buscar imágenes con filtros usando metadatos SharePoint
     * Query: $filter=Facultad eq 'Medicina' and EstadoAuditoria eq 'Pendiente'
     */
    async searchImagesWithFilters(req: Request, res: Response): Promise<void> {
        try {
            const { 
                faculty = 'todas', 
                studyType = 'todos', 
                status = 'pendiente',
                page = 1,
                pageSize = 20
            } = req.query;

            console.log('🔍 Filtros recibidos:', { faculty, studyType, status, page, pageSize });

            // Mapear status a valores SharePoint
            const statusMap: { [key: string]: string } = {
                'pendiente': 'Pendiente',
                'aprobado': 'Aprobado', 
                'rechazado': 'Rechazado',
                'en-revision': 'En Revisión'
            };

            const sharePointStatus = statusMap[status as string] || 'Pendiente';
            
            const result = await this.sharePointService.searchImagesWithFilters(
                sharePointStatus,
                faculty === 'todas' ? undefined : faculty as string,
                studyType === 'todos' ? undefined : studyType as string,
                parseInt(page as string),
                parseInt(pageSize as string)
            );

            res.status(200).json({
                success: true,
                message: 'Búsqueda completada exitosamente',
                data: result.images || [],
                pagination: result.pagination,
                filters_applied: result.filters_applied,
                source: 'sharepoint_metadata',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('❌ Error en searchImagesWithFilters:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtener facultades disponibles desde columna Facultad
     */
    async getAvailableFaculties(req: Request, res: Response): Promise<void> {
        try {
            const faculties = await this.sharePointService.getAvailableFaculties();
            
            res.status(200).json({
                success: true,
                message: 'Facultades obtenidas exitosamente',
                data: faculties,
                count: faculties.length,
                source: 'sharepoint_metadata',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('❌ Error obteniendo facultades:', error);
            res.status(500).json({
                success: false,
                error: 'Error obteniendo facultades',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtener tipos de estudio disponibles desde columna TipoEstudio
     */
    async getAvailableStudyTypes(req: Request, res: Response): Promise<void> {
        try {
            const studyTypes = await this.sharePointService.getAvailableStudyTypes();
            
            res.status(200).json({
                success: true,
                message: 'Tipos de estudio obtenidos exitosamente',
                data: studyTypes,
                count: studyTypes.length,
                source: 'sharepoint_metadata',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('❌ Error obteniendo tipos de estudio:', error);
            res.status(500).json({
                success: false,
                error: 'Error obteniendo tipos de estudio',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Validar imagen - actualizar metadatos a "Aprobado"
     */
    async validateImage(req: Request, res: Response): Promise<void> {
        try {
            const { imageId } = req.params;
            const { faculty, studyType, reviewedBy = 'sistema' } = req.body;

            if (!imageId) {
                res.status(400).json({
                    success: false,
                    error: 'ID de imagen requerido'
                });
                return;
            }

            const success = await this.sharePointService.validateImage(
                imageId, 
                faculty || 'Sin Clasificar', 
                studyType || 'Grado', 
                reviewedBy
            );

            if (success) {
                res.status(200).json({
                    success: true,
                    message: 'Imagen validada exitosamente',
                    data: { imageId, status: 'Aprobado', faculty, studyType },
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error('Error validando imagen');
            }

        } catch (error: any) {
            console.error('❌ Error validando imagen:', error);
            res.status(500).json({
                success: false,
                error: 'Error validando imagen',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Rechazar imagen - actualizar metadatos a "Rechazado"
     */
    async rejectImage(req: Request, res: Response): Promise<void> {
        try {
            const { imageId } = req.params;
            const { faculty, studyType, reviewedBy = 'sistema', reason } = req.body;

            if (!imageId) {
                res.status(400).json({
                    success: false,
                    error: 'ID de imagen requerido'
                });
                return;
            }

            if (!reason) {
                res.status(400).json({
                    success: false,
                    error: 'Motivo de rechazo requerido'
                });
                return;
            }

            const success = await this.sharePointService.rejectImage(
                imageId, 
                faculty || 'Sin Clasificar', 
                studyType || 'Grado', 
                reviewedBy,
                reason
            );

            if (success) {
                res.status(200).json({
                    success: true,
                    message: 'Imagen rechazada exitosamente',
                    data: { imageId, status: 'Rechazado', faculty, studyType, reason },
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error('Error rechazando imagen');
            }

        } catch (error: any) {
            console.error('❌ Error rechazando imagen:', error);
            res.status(500).json({
                success: false,
                error: 'Error rechazando imagen',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtener estadísticas por metadatos
     */
    async getImageStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.sharePointService.getStats();
            
            res.status(200).json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: stats,
                source: 'sharepoint_metadata',
                timestamp: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('❌ Error obteniendo estadísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Error obteniendo estadísticas',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Probar conectividad con SharePoint
     */
    async testConnection(req: Request, res: Response): Promise<void> {
        try {
            const isConnected = await this.sharePointService.testConnection();
            
            if (isConnected) {
                res.status(200).json({
                    success: true,
                    message: 'Conexión con SharePoint exitosa',
                    connected: true,
                    service: 'sharepoint_metadata',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(503).json({
                    success: false,
                    message: 'No se pudo conectar con SharePoint',
                    connected: false,
                    service: 'sharepoint_metadata',
                    timestamp: new Date().toISOString()
                });
            }

        } catch (error: any) {
            console.error('❌ Error testing connection:', error);
            res.status(500).json({
                success: false,
                error: 'Error probando conexión',
                details: error.message,
                connected: false,
                timestamp: new Date().toISOString()
            });
        }
    }
}
