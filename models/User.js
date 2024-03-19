const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

exports.createUser = async (name, email, password) => {
    try {
        // Pastikan email belum digunakan
        const emailCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            throw new Error('Email sudah digunakan');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
        throw new Error('Error creating user');
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error(`Error fetching user by email: ${error.message}`);
        throw new Error('Error fetching user by email');
    }
};

exports.comparePassword = async (enteredPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
        console.error(`Error comparing password: ${error.message}`);
        throw new Error('Error comparing password');
    }
};
