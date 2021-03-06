require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const chordRouter = require('./chordRouter')
const authRouter = require('./authRouter')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev'

app.use(morgan(morganOption))
app.use(cors({ 
    'origin': CLIENT_ORIGIN,
    'optionsSuccessStatus': 200
}))
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        console.error(`Unauthorized request to path ${req.path}.`)
        res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.use(chordRouter)
app.use(authRouter)

module.exports = app
