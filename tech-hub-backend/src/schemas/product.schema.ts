import {z} from 'zod';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued'
}

// Definimos el esquema que debe tener la nueva entidad siempre que trabajemos con productos , definimos los campos obligatorios y opcionales que dan estructura al objeto, validandolo con Zod.
export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    description: z.string().min(5).max(1000),
    price: z.number().min(0),
    status: z.enum(ProductStatus),
    createdAt: z.date(),
    updatedAt: z.date()
}) 
export const ProductCreateSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Generamos tipos automáticamente para TypeScript a partir de los esquemas definidos con Zod

export type Product = z.infer<typeof ProductSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
