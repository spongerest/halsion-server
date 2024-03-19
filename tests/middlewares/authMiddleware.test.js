const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');

// Setup express app untuk testing
const app = express();
require('dotenv').config({ path: '.env.test' });

// Contoh route dilindungi yang menggunakan authMiddleware
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Jika Anda melihat ini, Anda terautentikasi' });
});

// Generate token untuk testing
const generateTestToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Auth Middleware', () => {
    it('should deny access without token', async () => {
    const response = await supertest(app).get('/protected');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toContain('Token tidak ditemukan');
    });

    it('should deny access with invalid token', async () => {
    const response = await supertest(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalidtoken');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toContain('Token tidak valid');
    });

    it('should allow access with valid token', async () => {
    const token = generateTestToken({ userId: 1 }); // Ganti dengan payload yang sesuai
    const response = await supertest(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Anda terautentikasi');
    });
});
