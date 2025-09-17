import {
  ProductModel
} from '../shared/models/product.model.js';
import {
  ProductCreate,
  Product
} from '../schemas/product.schema.js';
// import { logger } from '../utils/logger.js';

// Almacenamiento temporal en memoria de productos
// En un entorno real, esto sería una base de datos
const products = new Map<string, Product>();

export class ProductService {
  // Se usa Omit<ProductCreateInput, 'id' | 'createdAt' | 'updatedAt'> para indicar que el método createProduct no espera que el usuario proporcione los campos id, createdAt ni updatedAt en los datos de entrada.

  static async createProduct(data: ProductCreate): Promise<Product> {
    const product: Product = ProductModel.create({
      ...data
    });

    products.set(product.id, product);
    return product;
  }

  // static async updateProduct(
  //   id: string,
  //   data: ProductUpdateRequest
  // ): Promise<Product | null> {
  //   const existingProduct = products.get(id);
  //   if (!existingProduct) {
  //     return null;
  //   }

  //   // Construye el objeto actualizado
  //   const updatedProduct = {
  //     ...existingProduct,
  //     ...data,
  //     id: existingProduct.id,
  //     createdAt: existingProduct.createdAt,
  //     updatedAt: new Date(),
  //   };

  //   // Valida con Zod
  //   const validatedProduct = ProductUpdateSchema.parse(updatedProduct);

  //   products.set(id, validatedProduct as Product);

  //   return validatedProduct as Product;
  // }

  // static async getProductById(id: string): Promise<Product | null> {
  //   // Valida el id con ProductParamsSchema
  //   try {
  //     ProductParamsSchema.parse({ id });
  //   } catch {
  //     return null;
  //   }
  //   return products.get(id) || null;
  // }

  // static async getAllProducts(
  //   params: ProductQueryParams
  // ): Promise<{ products: Product[]; total: number }> {
  //   let result = Array.from(products.values());

  //   // Filtrar por estado
  //   if (params.status) {
  //     result = result.filter((p) => p.status === params.status);
  //   }

  //   // Filtrar por búsqueda en nombre o descripción
  //   if (params.search) {
  //     const searchLower = params.search.toLowerCase();
  //     result = result.filter(
  //       (p) =>
  //         p.name.toLowerCase().includes(searchLower) ||
  //         p.description.toLowerCase().includes(searchLower)
  //     );
  //   }

  //   // Filtrar por rango de precio, si no hay productos con precio definido y se solicita un filtro por precio, retorna vacío
  //   if (
  //     typeof params.minPrice === 'number' ||
  //     typeof params.maxPrice === 'number'
  //   ) {
  //     const hasPrice = result.some((p) => typeof p.price === 'number');
  //     if (!hasPrice) {
  //       // No hay productos con precio definido, retorna vacío
  //       return { products: [], total: 0 };
  //     }
  //     if (typeof params.minPrice === 'number') {
  //       result = result.filter((p) => p.price >= params.minPrice!);
  //     }
  //     if (typeof params.maxPrice === 'number') {
  //       result = result.filter((p) => p.price <= params.maxPrice!);
  //     }
  //   }
  //   const total = result.length;

  //   // Paginación
  //   const offset = params.offset ?? 0;
  //   const limit = params.limit ?? 10;
  //   result = result.slice(offset, offset + limit);

  //   return { products: result, total };
  // }

  // static async deleteProduct(id: string): Promise<boolean> {
  //   // Valida el id con Zod
  //   try {
  //     ProductParamsSchema.parse({ id });
  //   } catch {
  //     return false;
  //   }
  //   const deleted = products.delete(id);
  //   if (deleted) {
  //     logger.info('Product deleted', { id });
  //   }
  //   return deleted;
  // }
}
