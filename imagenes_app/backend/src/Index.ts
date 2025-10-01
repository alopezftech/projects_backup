import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { ImageController } from './controllers/ImageController';

// Cargar variables de entorno
dotenv.config();

class App {
    private app: Application;
    private imageController: ImageController;
    private port: number;

    constructor() {
        this.app = express();
        this.imageController = new ImageController();
        this.port = parseInt(process.env.PORT || '3000');
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        // Seguridad
        this.app.use(helmet());
        
        // CORS
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:4200',
            credentials: true
        }));
        
        // Logging
        this.app.use(morgan('combined'));
        
        // Parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    }

    private initializeRoutes(): void {
        // ===========================================
        // SISTEMA DE AUDITORÍA DE IMÁGENES SHAREPOINT
        // 8 ENDPOINTS OPTIMIZADOS CON METADATOS
        // ===========================================

        // 1. HEALTH CHECK - Estado del servidor
        this.app.get('/api/health', (req: Request, res: Response) => {
            res.status(200).json({
                status: 'OK',
                message: 'Sistema de Auditoría SharePoint funcionando',
                version: '2.0',
                features: ['metadata_filtering', 'sharepoint_integration'],
                timestamp: new Date().toISOString()
            });
        });

        // 2. SEARCH - Búsqueda con filtros por metadatos SharePoint
        this.app.get('/api/images/search', this.imageController.searchImagesWithFilters.bind(this.imageController));

        // 3. METADATA - Obtener facultades disponibles
        this.app.get('/api/metadata/faculties', this.imageController.getAvailableFaculties.bind(this.imageController));

        // 4. METADATA - Obtener tipos de estudio disponibles  
        this.app.get('/api/metadata/study-types', this.imageController.getAvailableStudyTypes.bind(this.imageController));

        // 5. TEST CONNECTION - Probar conectividad SharePoint
        this.app.get('/api/connection/test', this.imageController.testConnection.bind(this.imageController));

        // 6. STATS - Estadísticas por metadatos
        this.app.get('/api/images/stats', this.imageController.getImageStats.bind(this.imageController));

        // 7. VALIDATE - Aprobar imagen (actualizar metadatos)
        this.app.post('/api/images/:imageId/validate', this.imageController.validateImage.bind(this.imageController));

        // 8. REJECT - Rechazar imagen (actualizar metadatos)
        this.app.post('/api/images/:imageId/reject', this.imageController.rejectImage.bind(this.imageController));

        // ===========================================
        // RUTAS DE COMPATIBILIDAD (LEGACY)
        // ===========================================
        
        // Compatibilidad con frontend existente
        this.app.get('/api/imagenes/buscar', this.imageController.searchImagesWithFilters.bind(this.imageController));
        this.app.get('/health', (req: Request, res: Response) => {
            res.redirect('/api/health');
        });

        // ===========================================
        // MANEJO DE ERRORES
        // ===========================================

        // Rutas no encontradas
        this.app.use('*', (req: Request, res: Response) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint no encontrado',
                available_endpoints: [
                    'GET /api/health',
                    'GET /api/images/search',
                    'GET /api/metadata/faculties',
                    'GET /api/metadata/study-types', 
                    'GET /api/connection/test',
                    'GET /api/images/stats',
                    'POST /api/images/:id/validate',
                    'POST /api/images/:id/reject'
                ],
                timestamp: new Date().toISOString()
            });
        });

        // Manejo de errores globales
        this.app.use((error: Error, req: Request, res: Response, next: any) => {
            console.error('❌ Error del servidor:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno',
                timestamp: new Date().toISOString()
            });
        });
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log('🚀 ========================================');
            console.log('📋 SISTEMA DE AUDITORÍA SHAREPOINT v2.0');
            console.log('🚀 ========================================');
            console.log(`🌐 Servidor: http://localhost:${this.port}`);
            console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
            console.log('🏷️  Método: Metadatos SharePoint (Opción 2)');
            console.log('⚡ Endpoints: 8 optimizados');
            console.log('🔍 Filtros: Facultad, Tipo Estudio, Estado');
            console.log('🚀 ========================================');
        });
    }
}

// Inicializar la aplicación
const app = new App();
app.listen();

export default App;
