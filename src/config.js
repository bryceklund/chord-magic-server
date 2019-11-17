module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: 'https://chord-magic.now.sh/',
    JWT_SECRET: process.env.JWT_SECRET || 'secret-code'
}