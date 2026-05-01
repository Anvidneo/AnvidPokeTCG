export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id: string) {
        super(`${resource} with id "${id}" not found`, 404);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}