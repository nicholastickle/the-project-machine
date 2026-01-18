const isProduction = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
    level: LogLevel;
    message: string;
    [key: string]: any;
}

export const logger = {
    info: (message: string, data?: object) => log('info', message, data),
    warn: (message: string, data?: object) => log('warn', message, data),
    error: (message: string, error?: unknown, data?: object) => {
        // If error is an Error object, serialize it properly
        const errorDetails = error instanceof Error
            ? { ...error, name: error.name, message: error.message, stack: error.stack }
            : error;

        log('error', message, { ...data, error: errorDetails });
    },
    debug: (message: string, data?: object) => {
        // Optional: Only log debug in non-production or if specific env var is set
        // if (isProduction && !process.env.DEBUG) return; 
        log('debug', message, data);
    }
};

function log(level: LogLevel, message: string, data?: object) {
    const payload: LogPayload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...data,
    };

    if (isProduction) {
        // JSON logging for production (standard for cloudwatch/datadog etc)
        console.log(JSON.stringify(payload));
    } else {
        // Pretty printing for local development
        const colorMap = {
            info: '\x1b[36m', // Cyan
            warn: '\x1b[33m', // Yellow
            error: '\x1b[31m', // Red
            debug: '\x1b[90m', // Gray
        };
        const reset = '\x1b[0m';

        const color = colorMap[level] || reset;
        const dataString = data && Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : '';

        console.log(`${color}[${level.toUpperCase()}]${reset} ${message} ${dataString ? `\n${dataString}` : ''}`);
    }
}
