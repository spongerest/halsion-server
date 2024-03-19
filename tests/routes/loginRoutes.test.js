const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { addUserToDatabase, deleteUserFromDatabase } = require('./setupTestUser');

// Misalkan Anda memiliki fungsi setup untuk menambahkan user test ke database
async function setupTestUser() {
    const password = await bcrypt.hash('testpassword', 10);
    // Tambahkan nama user dalam pemanggilan fungsi
    const userId = await addUserToDatabase({ name: 'Test User', email: 'test@example.com', password, });
    return userId;
}

describe('POST /login', () => {
    let userId;

    beforeEach(async () => {
        // Hapus semua user dari database untuk memastikan environment yang bersih
        await deleteUserFromDatabase();
        // Tambahkan user test ke dalam database
        const password = await bcrypt.hash('testpassword', 10);
        userId = await addUserToDatabase({ name: 'Test User', email: 'test@example.com', password });
    });

    afterEach(async () => {
        // Hapus user test dari database setelah setiap test
        await deleteUserFromDatabase(userId);
    });

    it('should authenticate user and return JWT token', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                email: 'test@example.com',
                password: 'testpassword'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        
        const payload = jwt.verify(response.body.token, process.env.JWT_SECRET);
        expect(payload).toHaveProperty('userId', userId);
    }, 10000);

    it('should reject login with incorrect password', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Kombinasi email dan password tidak valid');
    });

    // Cleanup setelah tes selesai
    afterAll(async () => {
        await deleteUserFromDatabase(userId);
    });
});
