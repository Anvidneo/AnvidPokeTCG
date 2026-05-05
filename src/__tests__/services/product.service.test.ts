import * as productService from '../../services/product.service';
import * as productRepository from '../../repositories/product.repository';
import { Product } from '../../models/product.model';

jest.mock('../../repositories/product.repository');

const mockProduct: Product = {
    id: 'mock-uuid',
    name: 'Surging Sparks Booster Box',
    type: 'sealed',
    set: 'Surging Sparks',
    condition: 'NM',
    language: 'EN',
    quantity: 2,
    price: 149.99,
    currency: 'USD',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
};

const mockCreateDto = {
    name: 'Surging Sparks Booster Box',
    type: 'sealed' as const,
    set: 'Surging Sparks',
    condition: 'NM' as const,
    language: 'EN' as const,
    quantity: 2,
    price: 149.99,
    currency: 'USD',
};

describe('product.service', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('createProduct', () => {
        it('should create a product with id and timestamps', async () => {
            (productRepository.createProduct as jest.Mock).mockResolvedValue(mockProduct);
            const result = await productService.createProduct(mockCreateDto);
            expect(result).toEqual(mockProduct);
            expect(productRepository.createProduct).toHaveBeenCalledTimes(1);
            const calledWith = (productRepository.createProduct as jest.Mock).mock.calls[0][0];
            expect(calledWith.id).toBeDefined();
            expect(calledWith.createdAt).toBeDefined();
            expect(calledWith.updatedAt).toBeDefined();
        });
    });

    describe('getProductById', () => {
        it('should return a product by id', async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue(mockProduct);
            const result = await productService.getProductById('mock-uuid');
            expect(result).toEqual(mockProduct);
            expect(productRepository.getProductById).toHaveBeenCalledWith('mock-uuid');
        });
    });

    describe('listProducts', () => {
        it('should return all products', async () => {
            (productRepository.listProducts as jest.Mock).mockResolvedValue([mockProduct]);
            const result = await productService.listProducts();
            expect(result).toHaveLength(1);
            expect(productRepository.listProducts).toHaveBeenCalledWith(undefined);
        });

        it('should filter by type when provided', async () => {
            (productRepository.listProducts as jest.Mock).mockResolvedValue([mockProduct]);
            await productService.listProducts('sealed');
            expect(productRepository.listProducts).toHaveBeenCalledWith('sealed');
        });
    });

    describe('updateProduct', () => {
        it('should update a product and set updatedAt', async () => {
            const updated = { ...mockProduct, quantity: 5 };
            (productRepository.updateProduct as jest.Mock).mockResolvedValue(updated);
            const result = await productService.updateProduct('mock-uuid', { quantity: 5 });
            expect(result.quantity).toBe(5);
            const calledWith = (productRepository.updateProduct as jest.Mock).mock.calls[0][1];
            expect(calledWith.updatedAt).toBeDefined();
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product by id', async () => {
            (productRepository.deleteProduct as jest.Mock).mockResolvedValue(undefined);
            await productService.deleteProduct('mock-uuid');
            expect(productRepository.deleteProduct).toHaveBeenCalledWith('mock-uuid');
        });
    });
});