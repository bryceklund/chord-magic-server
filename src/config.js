module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: 'https://chord-magic.bryceklund.now.sh',
    JWT_SECRET: process.env.JWT_SECRET || 'secret-code',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://bryce@localhost/chord-magic'
}