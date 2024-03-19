const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const authorizationMiddleware = require('../../middlewares/authorizationMiddleware');

require('dotenv').config({ path: '.env.test' });

// Setup express app untuk testing
const app = express();
app.use(express.json());

// Mock route untuk testing
app.get('/admin-only', authorizationMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Success' });
});

// Generate token untuk testing
const generateTestToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

const request = supertest(app);

describe('Authorization Middleware', () => {
    it('should deny access for non-admin users', async () => {
        // Memperbaiki payload token: role harusnya 'user' untuk simulasi non-admin
        const token = generateTestToken({ userId: 1, role: 'user' }); // Payload yang benar untuk non-admin
        const response = await request
            .get('/admin-only')
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toContain('Autentikasi diperlukan.');
    });

    it('should allow access for admin users', async () => {
        // Memperbaiki payload token: role harusnya 'admin', bukan 'user'
        const token = generateTestToken({ userId: 2, role: 'admin' }); // Payload yang benar untuk admin
        const response = await request
            .get('/admin-only')
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });
});
