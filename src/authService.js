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
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] })
    },
    makeAuthHeader(user, secret=process.env.JWT_SECRET) {
        const token = jwt.sign({ userid: user.id }, secret, { subject: user.username, algorithm: 'HS256' })
        return `Bearer ${token}`
    }
}

module.exports = AuthService