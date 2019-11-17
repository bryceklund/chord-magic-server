require('dotenv').config();

module.exports = {
    "migrationDirectory": "test-migrations",
    "driver": "pg",
    "host": process.env.MIGRATION_DB_HOST,
    "port": process.env.MIGRATION_DB_PORT,
    "database": process.env.TEST_MIGRATION_DB_NAME,
    "username": process.env.MIGRATION_DB_USER,
    "password": process.env.MIGRATION_DB_PASS
};