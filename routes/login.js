const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Batasi percobaan login untuk mengurangi risiko serangan brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // batas setiap IP untuk membuat 5 request login setiap windowMs
    message: "Terlalu banyak percobaan login dari IP ini, silakan coba lagi setelah 15 menit"
});

// Validasi input untuk login
const validateLogin = [
    body('email').trim().not().isEmpty().withMessage('Email diperlukan'),
    body('password').not().isEmpty().withMessage('Password diperlukan'),
];

// Rute untuk login pengguna dengan validasi dan rate limiting
router.post('/login', [loginLimiter, validateLogin], UserController.login);

module.exports = router;