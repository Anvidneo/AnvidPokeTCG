import { randomUUID } from 'crypto';
import { Product, ProductType } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import * as productRepository from '../repositories/product.repository';

export async function createProduct(dto: CreateProductDto): Promise<Product> {
    const now = new Date().toISOString();

    const product: Product = {
        id: randomUUID(),
        ...dto,
        createdAt: now,
        updatedAt: now,
    };

    return productRepository.createProduct(product);
}

export async function getProductById(id: string): Promise<Product> {
    return productRepository.getProductById(id);
}

export async function listProducts(type?: ProductType): Promise<Product[]> {
    return productRepository.listProducts(type);
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    return productRepository.updateProduct(id, {
        ...dto,
        updatedAt: new Date().toISOString(),
    });
}

export async function deleteProduct(id: string): Promise<void> {
    return productRepository.deleteProduct(id);
}