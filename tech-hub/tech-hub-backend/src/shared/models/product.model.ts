import type { Product, ProductCreate, ProductStatus } from '../../schemas/product.schema.js';
import { v4 as uuidv4 } from 'uuid';

export class ProductModel implements Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: ProductCreate): Product {
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

  

    return new ProductModel(product);
  }
}