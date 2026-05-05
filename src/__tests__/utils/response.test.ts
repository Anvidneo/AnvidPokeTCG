import { ok, created, noContent, badRequest, notFound, internalError } from '../../utils/response';

describe('response utils', () => {
    describe('ok', () => {
        it('should return 200 with serialized body', () => {
            const result = ok({ id: '1', name: 'Pikachu' });
            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual({ id: '1', name: 'Pikachu' });
        });
    });

    describe('created', () => {
        it('should return 201 with serialized body', () => {
            const result = created({ id: '1' });
            expect(result.statusCode).toBe(201);
            expect(JSON.parse(result.body)).toEqual({ id: '1' });
        });
    });

    describe('noContent', () => {
        it('should return 204 with empty body', () => {
            const result = noContent();
            expect(result.statusCode).toBe(204);
            expect(result.body).toBe('');
        });
    });

    describe('badRequest', () => {
        it('should return 400 with error message', () => {
            const result = badRequest('name is required');
            expect(result.statusCode).toBe(400);
            expect(JSON.parse(result.body)).toEqual({ error: 'name is required' });
        });
    });

    describe('notFound', () => {
        it('should return 404 with error message', () => {
            const result = notFound('Product not found');
            expect(result.statusCode).toBe(404);
            expect(JSON.parse(result.body)).toEqual({ error: 'Product not found' });
        });
    });

    describe('internalError', () => {
        it('should return 500 with default message', () => {
            const result = internalError();
            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
        });

        it('should return 500 with custom message', () => {
            const result = internalError('Something went wrong');
            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Something went wrong' });
        });
    });

    describe('CORS headers', () => {
        it('should include Access-Control-Allow-Origin in all responses', () => {
            const responses = [ok({}), created({}), noContent(), badRequest(''), notFound(''), internalError()];
            responses.forEach((r) => {
                expect(r.headers?.['Access-Control-Allow-Origin']).toBe('*');
            });
        });
    });
});