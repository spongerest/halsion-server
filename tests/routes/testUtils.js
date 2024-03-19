const jwt = require('jsonwebtoken');

function generateTestToken(payload) {
    const secret = process.env.JWT_SECRET || 'your_default_test_secret';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

module.exports = { generateTestToken };
