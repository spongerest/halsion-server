const authorizationMiddleware = roles => (req, res, next) => {
    // Pastikan pengguna terautentikasi
    if (!req.user) {
        return res.status(401).json({ message: 'Autentikasi diperlukan.' });
    }

    // Pastikan peran pengguna sesuai
    // Asumsikan req.user.role adalah string yang mewakili peran pengguna
    if (roles && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Anda tidak memiliki izin yang cukup untuk mengakses sumber daya ini.' });
    }

    next();
};

module.exports = authorizationMiddleware;