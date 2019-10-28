const express = require('express')
const AuthService = require('./authService')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter.route('/login')
    .post(bodyParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = { username, password }
        for (const [key, value] of Object.entries(loginUser)) {
            value == null 
                ? res.status(400).json({ error: `Missing ${key} in request body` })
                : res.send('ok')
        }
    })

module.exports = authRouter