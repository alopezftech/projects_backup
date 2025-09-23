/*
 * SHARED PIPES INDEX - Pipes reutilizables
 *
 * Los pipes son transformadores de datos que se pueden usar en templates
 * para formatear y modificar la presentación de información.
 *
 * TIPOS DE PIPES COMUNES:
 *
 * 1. TEXT PIPES (Transformadores de texto)
 *    - Truncate: Corta texto largo con "..."
 *    - Capitalize: Capitaliza palabras
 *    - Slug: Convierte texto a formato URL
 *    - Highlight: Resalta texto en búsquedas
 *
 * 2. NUMBER PIPES (Transformadores de números)
 *    - FileSize: Convierte bytes a KB, MB, GB
 *    - Round: Redondea a decimales específicos
 *    - Percentage: Formatea porcentajes
 *
 * 3. DATE PIPES (Transformadores de fechas)
 *    - TimeAgo: "hace 2 horas", "hace 3 días"
 *    - LocalDate: Formatea fechas según locale
 *    - Duration: Convierte duración a formato legible
 *
 * 4. ARRAY PIPES (Transformadores de arrays)
 *    - OrderBy: Ordena arrays por campo
 *    - FilterBy: Filtra arrays por criterio
 *    - GroupBy: Agrupa elementos por campo
 *
 * 5. OBJECT PIPES (Transformadores de objetos)
 *    - Keys: Obtiene las claves de un objeto
 *    - Values: Obtiene los valores de un objeto
 *    - Safe: Navegación segura en objetos
 *
 * USO EN TEMPLATES:
 * {{ text | truncate:50 }}
 * {{ size | fileSize }}
 * {{ date | timeAgo }}
 * {{ items | orderBy:'name' }}
 *
 * CARACTERÍSTICAS:
 * - Son funciones puras (sin efectos secundarios)
 * - Se pueden encadenar
 * - Mejoran la legibilidad del template
 * - Reutilizables en toda la aplicación
 */

// TODO: Aquí se exportarán los pipes cuando se creen
// export { TruncatePipe } from './truncate.pipe';
// export { FileSizePipe } from './file-size.pipe';
// export { TimeAgoPipe } from './time-ago.pipe';
// export { HighlightPipe } from './highlight.pipe';

// Por ahora, exportamos un placeholder
export const PIPES_INDEX = 'Pipes will be exported here';
