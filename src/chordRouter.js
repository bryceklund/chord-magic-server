const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const PORT = process.env.PORT
const { AudioStore, ProgStore } = require('./AudioStore')
const ChordService = require('./chordService')
const AuthService = require('./authService')
const xss = require('xss')
const bcrypt = require('bcryptjs')

const chordRouter = express.Router()
const bodyParser = express.json()

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''
    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' })
    } else {
        bearerToken = authToken.split(' ')[2]
    }

    try {
        AuthService.verifyJwt(bearerToken)
        next()
    } catch(error) {
        res.status(401).json({ error: 'Unauthorized request' })
    }
}

chordRouter.route('/api/scales')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const result = []
        ChordService.getScales(knexInstance)
            .then(scales => scales.forEach((scale, i) => result[i] = scale.name))
            .then(data => res.json(result))
            .catch(next)
    })

chordRouter.route('/api/chords')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const result = []
        ChordService.getAllChords(knexInstance)
            .then(chords => chords.forEach((chord, i) => result[i] = chord.name))
            .then(data => res.json(result))
            .catch(next)
    })

chordRouter.route('/api/frequencies/:oct')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const { oct } = req.params
        const result = {}
        ChordService.getFrequencies(knexInstance, oct)
            .then(freqs => {
                freqs.forEach(note => result[note.note] = parseFloat(note.frequency))
            })
            .then(data => res.json(result))
            .catch(next)
    })

chordRouter.route('/api/chord/:scale/:chord')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const { chord, scale } = req.params
        const result = []
        ChordService.getChord(knexInstance, chord, scale)
            .then(obj => obj.forEach((note, i) => result[i] = note.notes))
            .then(chords => res.json(result))
            .catch(next)
    })

chordRouter.route('/api/progressions/saved') 
    .all(requireAuth) 
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const userid = AuthService.verifyJwt(req.get('Authorization').split(' ')[2]).userid
        ChordService.getProgressions(knexInstance, userid)
            .then(result => res.json(result))
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { bodyName, bodyChords } = req.body
        const name = xss(bodyName)
        const chords = xss(bodyChords)
        const userid = AuthService.verifyJwt(req.get('Authorization').split(' ')[2]).userid
        const id = uuid()
        const progression = { id, name, userid }
        const progressionChords = []
        chords.forEach((entry, i) => { 
            progressionChords[i] = {...entry}
            progressionChords[i].chord = entry.name
            progressionChords[i].orderid = entry.id
            progressionChords[i].progressionid = id
            progressionChords[i].active = false
            delete progressionChords[i].name
            delete progressionChords[i].id
        }) 
                              
        ChordService.saveProgression(knexInstance, progression) //save meta info to progressions table
            .then(chords => {
                progressionChords.forEach(chord => { //save individual chords to progressionchords table
                    ChordService.saveProgressionChords(knexInstance, chord)
                        .then(result => {
                            return logger.info(`Storing chord ${chord.orderid} for progression '${name}' with id ${id}...` )
                        })
                        .catch(next)
                })
            })
            .then(result => {
                return res.status(201).send(id)
            })
            .catch(next)

            
        logger.info(`Progression with id ${id} stored.`)
        
    })

chordRouter.route('/api/progressionchords/:progressionId')
    .all(requireAuth) //token validation
    .get((req, res, next) => { //need format data for `timeline.state.activeChords` and we should be golden. sidenote: need patch/edit logic in the frontend
        const { progressionId } = req.params
        const knexInstance = req.app.get('db')
        const progression = []
        ChordService.getProgressionById(knexInstance, progressionId)
            .then(result => {
                if (result.length) {
                    result.forEach((chord, i) => {
                        progression[i] = {...chord}
                        progression[i].id = chord.orderid
                        progression[i].name = chord.chord
                        delete progression[i].orderid
                        delete progression[i].chord
                    })
                    res.json(progression)
                } else {
                    logger.error(`Progression with id ${progressionId} not found.`)
                    return res.status(404).send('Progression not found.')
                }})
            .catch(next)
    })
    .delete((req, res) => {
        const { progressionId } = req.params
        const knexInstance = req.app.get('db')
        ChordService.getProgressionById(knexInstance, progressionId)
            .then(result =>  {
                if (result.length) {
                    ChordService.deleteProgression(knexInstance, progressionId)
                    .then(result => res.status(200).send('Progression deleted successfully'))
                    logger.info(`Progression with id ${progressionId} deleted.`)
                } else {
                    res.status(404).sendStatus('Progression not found.')
                    logger.info(`Unable to find progression with id ${progressionId}.`)
                }
            })

    })
    .patch(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { progressionId } = req.params
        const { chords } = req.body
        const progressionChords = []
        chords.forEach((entry, i) => { 
            progressionChords[i] = {...entry}
            progressionChords[i].chord = entry.name
            progressionChords[i].orderid = entry.id
            progressionChords[i].progressionid = progressionId
            progressoinChords[i].active = false
            delete progressionChords[i].name
            delete progressionChords[i].id
        })
        ChordService.getProgressionById(knexInstance, progressionId) //check if prog exists
            .then(result =>  {
                if (result.length) {
                    ChordService.deleteProgressionChords(knexInstance, progressionId) //delete existing chords
                        .then(result => {
                            progressionChords.forEach(chord => {
                                ChordService.saveProgressionChords(knexInstance, chord) //save new chords
                                    .then(result => logger.info(`Overwriting chord ${chord.orderid} for progression '${chord.chord}' with id ${chord.progressionid}...` ))
                                    .catch(next)
                            })
                        })
                        .catch(next)
                } else {
                    res.status(404).sendStatus('Progression not found.')
                    logger.info(`Unable to find progression with id ${progressionId}.`)
                }
            })
            .then(result => res.status(200).send(`Progression ${progressionId} overwritten.`))
    })

chordRouter.route('/api/users')
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { username, password } = req.body
        const cleanUser = xss(username)
        AuthService.getUserWithUsername(knexInstance, username)
            .then(user => {
                if (user) {
                    return res.status(400).json({ error: `User '${user.username}' already exists` })
                }
            })
            .then(hashPass => {
                return bcrypt.hash(password, 12)
                    .then(cleanPass => {
                        return AuthService.addUser(knexInstance, cleanUser, cleanPass)
                            .then(user => {
                                return AuthService.getUserWithUsername(knexInstance, username)
                                        .then(user => {
                                            return user.username
                                        })
                            })
                    })
            })
            .then(username => {
                if (!username) {
                    return res.status(400).json({ error: 'Something went wrong' })
                }
                return res.status(201).send(`User '${username}' created`)
            })
            .catch(next)


    }) 

    module.exports = chordRouter