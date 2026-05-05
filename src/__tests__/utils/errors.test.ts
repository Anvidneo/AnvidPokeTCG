import { AppError, NotFoundError, ValidationError, isAppError } from '../../utils/errors';

describe('error utils', () => {
    describe('AppError', () => {
        it('should create error with message and statusCode', () => {
            const error = new AppError('Something failed', 503);
            expect(error.message).toBe('Something failed');
            expect(error.statusCode).toBe(503);
            expect(error.name).toBe('AppError');
        });

        it('should default statusCode to 500', () => {
            const error = new AppError('Something failed');
            expect(error.statusCode).toBe(500);
        });
    });

    describe('NotFoundError', () => {
        it('should create error with correct message and 404 status', () => {
            const error = new NotFoundError('Product', 'abc-123');
            expect(error.message).toBe('Product with id "abc-123" not found');
            expect(error.statusCode).toBe(404);
            expect(error.name).toBe('NotFoundError');
        });
    });

    describe('ValidationError', () => {
        it('should create error with correct message and 400 status', () => {
            const error = new ValidationError('name is required');
            expect(error.message).toBe('name is required');
            expect(error.statusCode).toBe(400);
            expect(error.name).toBe('ValidationError');
        });
    });

    describe('isAppError', () => {
        it('should return true for AppError instances', () => {
            expect(isAppError(new AppError('test'))).toBe(true);
            expect(isAppError(new NotFoundError('Product', '1'))).toBe(true);
            expect(isAppError(new ValidationError('test'))).toBe(true);
        });

        it('should return false for non-AppError instances', () => {
            expect(isAppError(new Error('test'))).toBe(false);
            expect(isAppError('string error')).toBe(false);
            expect(isAppError(null)).toBe(false);
            expect(isAppError(undefined)).toBe(false);
        });
    });
});