export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(message: string, statusCode: number, code: string, details?: any) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        // Maintain prototype chain for instanceof checks
        Object.setPrototypeOf(this, new.target.prototype);
    }

    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message,
                details: this.details,
            },
        };
    }
}

export class AuthError extends AppError {
    constructor(message: string = 'Unauthorized', statusCode: number = 401) {
        super(message, statusCode, 'AUTH_ERROR');
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

export class ServerError extends AppError {
    constructor(message: string = 'Internal Server Error', details?: any) {
        super(message, 500, 'SERVER_ERROR', details);
    }
}
