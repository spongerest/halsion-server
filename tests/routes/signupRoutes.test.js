const supertest = require('supertest');
const app = require('../../app'); // Ganti '../app' dengan path sebenarnya ke file app Anda
const { query } = require('../../config/database'); // Digunakan untuk setup dan teardown database

describe('POST /signup', () => {
    // Opsi untuk setup awal, seperti menghapus semua user dari database tes.
    beforeAll(async () => {
        await query('DELETE FROM users'); // HATI-HATI: Pastikan ini dijalankan pada database tes!
    });

    it('should create a new user and return a JWT token', async () => {
        const userData = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123"
        };

        const response = await supertest(app)
            .post('/api/signup')
            .send(userData);

        expect(response.statusCode).toBe(201); // Mengasumsikan signup berhasil mengembalikan status 201
        expect(response.body).toHaveProperty('token'); // Pastikan respons memiliki token
    });

    it('should reject signup with existing email', async () => {
        const userData = {
            name: "Jane Doe",
            email: "john@example.com", // Email yang sama dengan tes sebelumnya
            password: "password456"
        };

        const response = await supertest(app)
            .post('/api/signup')
            .send(userData);

        expect(response.statusCode).toBe(400); // Mengasumsikan email yang sudah ada mengembalikan status 400
        expect(response.body.message).toContain('Email sudah digunakan');
    });

    it('should reject signup with invalid data', async () => {
        const userData = {
            email: "notanemail", // Missing 'name' and invalid 'email'
            password: "123" // Password too short
        };

        const response = await supertest(app)
            .post('/api/signup')
            .send(userData);

        expect(response.statusCode).toBe(400);
        // Menyesuaikan dengan pesan error yang spesifik dari validasi Anda
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: expect.any(String), // Contoh, bisa lebih spesifik tergantung pada pesan error Anda
                }),
            ])
        );
    });

    // Cleanup setelah semua tes selesai
    afterAll(async () => {
        await query('DELETE FROM users'); // HATI-HATI: Pastikan ini dijalankan pada database tes!
    });
});
