module.exports = {
    PORT: process.env.PORT || 3000,
    DB_PORT : process.env.DB_PORT || '5432',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'kehidupanbaru15',
    DB_NAME: process.env.DB_NAME || 'halsionbooks',
    JWT_SECRET: process.env.JWT_SECRET || 'mysecretkey'
};
