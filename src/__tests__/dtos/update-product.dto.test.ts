import { UpdateProductSchema } from '../../dtos/update-product.dto';

describe('UpdateProductSchema', () => {
    it('should parse a valid partial update', () => {
        const result = UpdateProductSchema.parse({ quantity: 5, price: 99.99 });
        expect(result.quantity).toBe(5);
        expect(result.price).toBe(99.99);
    });

    it('should accept a single field', () => {
        const result = UpdateProductSchema.parse({ name: 'New Name' });
        expect(result.name).toBe('New Name');
    });

    it('should fail if no fields are provided', () => {
        expect(() => UpdateProductSchema.parse({})).toThrow();
    });

    it('should fail if type is invalid', () => {
        expect(() => UpdateProductSchema.parse({ type: 'pack' })).toThrow();
    });

    it('should fail if condition is invalid', () => {
        expect(() => UpdateProductSchema.parse({ condition: 'PERFECT' })).toThrow();
    });

    it('should fail if quantity is less than 1', () => {
        expect(() => UpdateProductSchema.parse({ quantity: 0 })).toThrow();
    });

    it('should fail if price is negative', () => {
        expect(() => UpdateProductSchema.parse({ price: -10 })).toThrow();
    });

    it('should uppercase currency', () => {
        const result = UpdateProductSchema.parse({ currency: 'cop' });
        expect(result.currency).toBe('COP');
    });
});