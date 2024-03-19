const supertest = require('supertest');
const app = require('../../app'); // Sesuaikan path sesuai dengan lokasi file app.js Anda
const { query } = require('../../config/database'); // Digunakan untuk setup dan teardown database

describe('User Authentication Flow', () => {
    afterAll(async () => {
        // Cleanup users table setelah semua test selesai
        await query('DELETE FROM users');
    });

    it('should sign up a new user, then login with that user', async () => {
        // Signup
        const signupData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        };

        const signupResponse = await supertest(app)
            .post('/api/signup')
            .send(signupData);

        expect(signupResponse.statusCode).toBe(201);
        expect(signupResponse.body).toHaveProperty('token');

        // Login
        const loginData = {
            email: "test@example.com",
            password: "password123"
        };

        const loginResponse = await supertest(app)
            .post('/api/login')
            .send(loginData);

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
    },30000);
});

