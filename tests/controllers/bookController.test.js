const supertest = require('supertest');
const app = require('../../app');
const { query } = require('../../config/database');

let token;

beforeAll(async () => {
    await query('DELETE FROM users');
    const signupResponse = await supertest(app)
        .post('/api/signup')
        .send({ name: "Test User", email: "test@example.com", password: "password123" });
    expect(signupResponse.statusCode).toBe(201); // Pastikan signup berhasil
    token = signupResponse.body.token; // Simpan token
});

describe('GET /api/books', () => {
    test('should respond with an array of books', async () => {
        const response = await supertest(app)
            .get('/api/books')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });
});

describe('POST /api/books', () => {
    test('should respond with the added book', async () => {
        const newBook = {
            title: "Test Book",
            author: "Test Author",
            description: "Test Description",
            price: 9.99
        };

        const response = await supertest(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`) // Pastikan token disertakan
            .send(newBook);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newBook.title);
    });
});

describe('DELETE /api/books/:id', () => {
    test('should respond with a success message', async () => {
        // Buat buku terlebih dahulu untuk mendapatkan ID yang valid
        const book = await supertest(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: "Test Book", author: "Test Author", description: "Test Description", price: 9.99 });
        expect(book.statusCode).toBe(201);
        
        // Lakukan penghapusan
        const response = await supertest(app)
            .delete(`/api/books/${book.body.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('successfully deleted');
    });
});

afterAll(async () => {
    await query('DELETE FROM books');
    await query('DELETE FROM users');
});
