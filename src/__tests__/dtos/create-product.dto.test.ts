import { CreateProductSchema } from '../../dtos/create-product.dto';

const validDto = {
    name: 'Surging Sparks Booster Box',
    type: 'sealed',
    set: 'Surging Sparks',
    condition: 'NM',
    language: 'EN',
    quantity: 2,
    price: 149.99,
    currency: 'USD',
};

describe('CreateProductSchema', () => {
    it('should parse a valid product', () => {
        const result = CreateProductSchema.parse(validDto);
        expect(result.name).toBe('Surging Sparks Booster Box');
        expect(result.currency).toBe('USD');
    });

    it('should accept optional notes', () => {
        const result = CreateProductSchema.parse({ ...validDto, notes: 'Sealed box' });
        expect(result.notes).toBe('Sealed box');
    });

    it('should fail if name is empty', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, name: '' })).toThrow();
    });

    it('should fail if type is invalid', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, type: 'booster' })).toThrow();
    });

    it('should fail if condition is invalid', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, condition: 'MINT' })).toThrow();
    });

    it('should fail if language is invalid', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, language: 'RU' })).toThrow();
    });

    it('should fail if quantity is less than 1', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, quantity: 0 })).toThrow();
    });

    it('should fail if price is negative', () => {
        expect(() => CreateProductSchema.parse({ ...validDto, price: -1 })).toThrow();
    });

    it('should fail if required fields are missing', () => {
        expect(() => CreateProductSchema.parse({})).toThrow();
    });

    it('should uppercase currency', () => {
        const result = CreateProductSchema.parse({ ...validDto, currency: 'usd' });
        expect(result.currency).toBe('USD');
    });
});