const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
require('dotenv').config();

// Middleware validasi tetap sama
exports.validateLogin = [
    body('email').not().isEmpty().withMessage('Email diperlukan'),
    body('password').not().isEmpty().withMessage('Password diperlukan'),
];

// Fungsi Login disesuaikan untuk PostgreSQL
exports.login = async (req, res) => {
    // Validasi request...
    try {
        const { email, password } = req.body;
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log('User tidak ditemukan dengan email:', email);
            return res.status(401).json({ message: 'Kombinasi email dan password tidak valid' });
        }
        const user = result.rows[0];
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            console.log('Password tidak valid untuk user:', email);
            return res.status(401).json({ message: 'Kombinasi email dan password tidak valid' });
        }
        // Lanjutkan dengan pembuatan token...
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Fungsi Signup disesuaikan untuk PostgreSQL
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Cek apakah email sudah digunakan
        const existingUserResult = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role', [name, email, hashedPassword, 'user']);
        const newUser = result.rows[0];

        // Buat token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kirim response dengan token
        res.status(201).json({ message: 'Pendaftaran berhasil', user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
