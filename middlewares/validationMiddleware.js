const { validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailedErrors = errors.array().map(({ param, msg, value, location }) => ({
            field: param,
            message: msg,
            value,
            location
        }));
        return res.status(400).json({ 
            errors: detailedErrors,
            message: "Terdapat kesalahan pada input Anda. Silakan periksa dan coba lagi." 
        });
    }
    next();
};

module.exports = validationMiddleware;
