const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./config')

const AuthService = {
    getUserWithUsername(knex, username) {
        return knex('users').where({ username }).first()
    },
    checkPassword(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    }
}

module.exports = AuthService