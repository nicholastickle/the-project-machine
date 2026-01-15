import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { logger } from './logger';

export function handleApiError(error: unknown) {
    // 1. Handle Known AppErrors
    if (error instanceof AppError) {
        // Only log 500s or unexpected system errors as "error", others as "warn"
        if (error.statusCode >= 500) {
            logger.error(error.message, error, { code: error.code });
        } else {
            logger.warn(error.message, { code: error.code, details: error.details });
        }

        return NextResponse.json(
            {
                error: {
                    code: error.code,
                    message: error.message,
                    details: error.details
                }
            },
            { status: error.statusCode }
        );
    }

    // 2. Handle Zod Validation Errors (Common in this codebase)
    if (error instanceof ZodError) {
        logger.warn('Validation Error', { details: error.flatten() });
        return NextResponse.json(
            {
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input data',
                    details: error.flatten()
                }
            },
            { status: 400 }
        );
    }

    // 3. Handle Unexpected Errors
    logger.error('Unexpected API Error', error);

    return NextResponse.json(
        {
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred. Please try again later.'
            }
        },
        { status: 500 }
    );
}
