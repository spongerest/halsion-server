require('dotenv').config({ path: '.env.test' });
const express = require('express');
const request = require('supertest');
const { body, validationResult } = require('express-validator');

// Setup express app untuk testing
const app = express();
app.use(express.json());



// Middleware validasi
const validationMiddleware = [
    body('email').isEmail().withMessage('Email harus valid'),
    body('password').isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter'),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
    }
];

// Mock route untuk testing
app.post('/signup', validationMiddleware, (req, res) => {
    res.status(200).json({ message: 'Signup sukses' });
});

describe('Validation Middleware', () => {
    it('should reject invalid email', async () => {
    const response = await request(app)
        .post('/signup')
        .send({ email: 'not-an-email', password: '123456' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'Email harus valid' })
    ]));
    });

    it('should reject short password', async () => {
    const response = await request(app)
        .post('/signup')
        .send({ email: 'test@example.com', password: '123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'Password harus minimal 6 karakter' })
    ]));
    });

    it('should accept valid email and password', async () => {
    const response = await request(app)
        .post('/signup')
        .send({ email: 'test@example.com', password: '123456' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Signup sukses');
    });
});
