const supertest = require('supertest');
const app = require('../../app');
const { query } = require('../../config/database');
const { generateTestToken } = require('./testUtils');

beforeAll(async () => {
    await query('DELETE FROM books'); // HATI-HATI: Pastikan ini hanya menjalankan pada environment tes!
});

describe('Books Routes', () => {
    let newBookId;

    beforeEach(async () => {
        await query('DELETE FROM books'); // Bersihkan tabel buku sebelum setiap tes
        // Insert buku baru dan simpan ID-nya untuk digunakan dalam tes
        const { body: newBook } = await supertest(app).post('/api/books').send({
            title: "Test Book",
            author: "Test Author",
            description: "Test Description",
            price: 9.99
        });
        newBookId = newBook.id;
    });

    afterEach(async () => {
        await query('DELETE FROM books'); // Bersihkan tabel buku setelah setiap tes
    });

    it('should create a new book', async () => {
        const newBook = {
            title: "Test Book",
            author: "Test Author",
            description: "Test Description",
            price: 9.99
        };
    
        // Misalkan endpoint ini memerlukan autentikasi admin
        const token = generateTestToken({ userId: 1, role: 'admin' });
        const response = await supertest(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(newBook);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty('id');
        newBookId = response.body.book.id;
    });

    it('should get a list of books', async () => {
        const response = await supertest(app).get('/api/books');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should allow admin to delete a book', async () => {
        const token = generateTestToken({ userId: 1, role: 'admin' });
        const response = await supertest(app)
            .delete(`/api/books/${newBookId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('successfully deleted');
    });

    it('should allow registered user to delete a book', async () => {
        const newBookForUser = await supertest(app).post('/api/books').send({
            title: "Book to Delete by User",
            author: "Author",
            description: "Description",
            price: 10.99
        });
        const userToken = generateTestToken({ userId: 2, role: 'registered' });
        const userResponse = await supertest(app)
        .delete(`/api/books/${newBookForUser.body.id}`) // Gunakan ID buku baru ini
        .set('Authorization', `Bearer ${userToken}`);

        expect(userResponse.statusCode).toBe(200);
        expect(userResponse.body.message).toContain('successfully deleted');
    });
});

afterAll(async () => {
    await query('DELETE FROM books'); // Bersihkan data tes
});
