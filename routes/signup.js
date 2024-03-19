const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const UserController = require('../controllers/UserController');

const validateSignup = [
    body('name').trim().not().isEmpty().withMessage('Nama diperlukan'),
    body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter').trim(),
    // Anda bisa menambahkan lebih banyak validasi sesuai kebutuhan
];

// Middleware untuk menangani hasil validasi
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rute untuk pendaftaran pengguna baru dengan validasi
router.post('/signup', [validateSignup, handleValidationErrors], UserController.signup);

module.exports = router;
