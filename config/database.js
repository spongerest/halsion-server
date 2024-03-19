const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT
});

const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to PostgreSQL database:', err);
        process.exit(1); // Exit aplikasi jika gagal terhubung ke database
    }
}

const query = async (text, params) => {
    const { rows } = await pool.query(text, params);
    return { rows }; // Pastikan untuk mengembalikan objek dengan properti rows
};

module.exports = { query, pool, connectToDatabase };
