const express = require('express')
const AuthService = require('./authService')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter.route('/api/login')
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { username, password } = req.body
        const loginUser = { username: username.toLowerCase(), password }
        Object.keys(loginUser).forEach(k => {
            if (loginUser[k] == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` }) 
            }
        })

        AuthService.getUserWithUsername(knexInstance, loginUser.username)  //verify username
            .then(dbUser => {
                if (!dbUser) {
                    res.status(400).json({ error: 'Invalid username or password!' })
                }
                
                return AuthService.checkPassword(loginUser.password, dbUser.password) //verify password
                        .then(compareMatch => {
                            if (!compareMatch) {
                                return res.status(400).json({ error: 'Invalid username or password!' })
                            }
                            
                            const sub = dbUser.username
                            const payload = { userid: dbUser.id }
                            res.send({
                                authToken: AuthService.createJwt(sub, payload),
                            })
                        })
            })
            .catch(next)
    })

module.exports = authRouter