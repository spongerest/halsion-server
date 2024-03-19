const winston = require('winston');
require('dotenv').config();

// Konfigurasi logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        // Tulis log errors ke file dengan level 'error'
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const errorHandlingMiddleware = (err, req, res, next) => {
    // Log error menggunakan winston
    logger.error(`Error: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan dalam server';

    const response = {
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandlingMiddleware;
