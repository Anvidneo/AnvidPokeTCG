import * as productController from '../../controllers/product.controller';
import * as productService from '../../services/product.service';
import { NotFoundError } from '../../utils/errors';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '../../models/product.model';

jest.mock('../../services/product.service');

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

const mockEvent = (overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent => ({
    body: null,
    pathParameters: null,
    queryStringParameters: null,
    ...overrides,
} as unknown as APIGatewayProxyEvent);

describe('product.controller', () => {
    beforeEach(() => jest.clearAllMocks());

    // CREATE
    describe('create', () => {
        const validBody = JSON.stringify({
            name: 'Surging Sparks Booster Box',
            type: 'sealed',
            set: 'Surging Sparks',
            condition: 'NM',
            language: 'EN',
            quantity: 2,
            price: 149.99,
            currency: 'USD',
        });

        it('should return 201 with created product', async () => {
            (productService.createProduct as jest.Mock).mockResolvedValue(mockProduct);
            const result = await productController.create(mockEvent({ body: validBody }));
            expect(result.statusCode).toBe(201);
            expect(JSON.parse(result.body)).toEqual(mockProduct);
        });

        it('should return 400 on Zod validation error', async () => {
            const result = await productController.create(mockEvent({ body: JSON.stringify({ name: '' }) }));
            expect(result.statusCode).toBe(400);
        });

        it('should return 500 on unexpected error', async () => {
            (productService.createProduct as jest.Mock).mockRejectedValue(new Error('DB error'));
            const result = await productController.create(mockEvent({ body: validBody }));
            expect(result.statusCode).toBe(500);
        });
    });

    // GET ONE
    describe('getOne', () => {
        it('should return 200 with product', async () => {
            (productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);
            const result = await productController.getOne(mockEvent({ pathParameters: { id: 'mock-uuid' } }));
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockProduct);
        });

        it('should return 400 if id is missing', async () => {
            const result = await productController.getOne(mockEvent());
            expect(result.statusCode).toBe(400);
        });

        it('should return 404 if product not found', async () => {
            (productService.getProductById as jest.Mock).mockRejectedValue(new NotFoundError('Product', 'bad-id'));
            const result = await productController.getOne(mockEvent({ pathParameters: { id: 'bad-id' } }));
            expect(result.statusCode).toBe(404);
        });

        it('should return 500 on unexpected error', async () => {
            (productService.getProductById as jest.Mock).mockRejectedValue(new Error('DB error'));
            const result = await productController.getOne(mockEvent({ pathParameters: { id: 'mock-uuid' } }));
            expect(result.statusCode).toBe(500);
        });
    });

    // LIST
    describe('list', () => {
        it('should return 200 with all products', async () => {
            (productService.listProducts as jest.Mock).mockResolvedValue([mockProduct]);
            const result = await productController.list(mockEvent());
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toHaveLength(1);
        });

        it('should return 200 filtered by type=sealed', async () => {
            (productService.listProducts as jest.Mock).mockResolvedValue([mockProduct]);
            const result = await productController.list(mockEvent({ queryStringParameters: { type: 'sealed' } }));
            expect(result.statusCode).toBe(200);
            expect(productService.listProducts).toHaveBeenCalledWith('sealed');
        });

        it('should return 400 if type is invalid', async () => {
            const result = await productController.list(mockEvent({ queryStringParameters: { type: 'booster' } }));
            expect(result.statusCode).toBe(400);
        });

        it('should return 500 on unexpected error', async () => {
            (productService.listProducts as jest.Mock).mockRejectedValue(new Error('DB error'));
            const result = await productController.list(mockEvent());
            expect(result.statusCode).toBe(500);
        });
    });

    // UPDATE
    describe('update', () => {
        it('should return 200 with updated product', async () => {
            const updated = { ...mockProduct, quantity: 5 };
            (productService.updateProduct as jest.Mock).mockResolvedValue(updated);
            const result = await productController.update(
                mockEvent({ pathParameters: { id: 'mock-uuid' }, body: JSON.stringify({ quantity: 5 }) }),
            );
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body).quantity).toBe(5);
        });

        it('should return 400 if id is missing', async () => {
            const result = await productController.update(mockEvent({ body: JSON.stringify({ quantity: 5 }) }));
            expect(result.statusCode).toBe(400);
        });

        it('should return 400 on Zod validation error', async () => {
            const result = await productController.update(
                mockEvent({ pathParameters: { id: 'mock-uuid' }, body: JSON.stringify({}) }),
            );
            expect(result.statusCode).toBe(400);
        });

        it('should return 404 if product not found', async () => {
            (productService.updateProduct as jest.Mock).mockRejectedValue(new NotFoundError('Product', 'bad-id'));
            const result = await productController.update(
                mockEvent({ pathParameters: { id: 'bad-id' }, body: JSON.stringify({ quantity: 5 }) }),
            );
            expect(result.statusCode).toBe(404);
        });

        it('should return 500 on unexpected error', async () => {
            (productService.updateProduct as jest.Mock).mockRejectedValue(new Error('DB error'));
            const result = await productController.update(
                mockEvent({ pathParameters: { id: 'mock-uuid' }, body: JSON.stringify({ quantity: 5 }) }),
            );
            expect(result.statusCode).toBe(500);
        });
    });

    // DELETE
    describe('remove', () => {
        it('should return 204 on successful delete', async () => {
            (productService.deleteProduct as jest.Mock).mockResolvedValue(undefined);
            const result = await productController.remove(mockEvent({ pathParameters: { id: 'mock-uuid' } }));
            expect(result.statusCode).toBe(204);
        });

        it('should return 400 if id is missing', async () => {
            const result = await productController.remove(mockEvent());
            expect(result.statusCode).toBe(400);
        });

        it('should return 404 if product not found', async () => {
            (productService.deleteProduct as jest.Mock).mockRejectedValue(new NotFoundError('Product', 'bad-id'));
            const result = await productController.remove(mockEvent({ pathParameters: { id: 'bad-id' } }));
            expect(result.statusCode).toBe(404);
        });

        it('should return 500 on unexpected error', async () => {
            (productService.deleteProduct as jest.Mock).mockRejectedValue(new Error('DB error'));
            const result = await productController.remove(mockEvent({ pathParameters: { id: 'mock-uuid' } }));
            expect(result.statusCode).toBe(500);
        });
    });
});