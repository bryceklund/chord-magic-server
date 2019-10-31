const bcrypt = require('bcryptjs')

const AuthService = {
    getUserWithUsername(knex, username) {
        return knex('users').where({ username }).first()
    },
    checkPassword(password, hash) {
        return bcrypt.compare(password, hash)
    }
}

module.exports = AuthService