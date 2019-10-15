const express = require('express')
const uuid = require('uuid/v4')
const PORT = process.env.PORT
const { AudioStore, ProgStore } = require('./AudioStore')
const ChordService = require('./chordService')
const xss = require('xss')

const chordRouter = express.Router()
const bodyParser = express.json()

chordRouter.route('/scales')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ChordService.getScales(knexInstance)
            .then(scales => res.json(scales))
            .catch(next)
    })

chordRouter.route('/chords')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ChordService.getAllChords(knexInstance)
            .then(chords => res.json(chords))
            .catch(next)
    })

chordRouter.route('/frequencies')
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { oct } = req.body
        const newArr = {}
        ChordService.getFrequencies(knexInstance, oct)
            .then(freqs => {
                freqs.forEach(note => newArr[note.note] = parseInt(note.frequency))
            })
            .then(result => res.json(newArr))
            .catch(next)
    })

chordRouter.route('/chord')
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { chord, scale } = req.body
        const newArr = []
        ChordService.getChord(knexInstance, chord, scale)
            .then(obj => obj.map((note, i) => newArr[i] = note.notes))
            .then(chords => res.json(newArr))
            .catch(next)
    })

chordRouter.route('/progressions')
    .get((req, res) => {
        res.json(ProgStore)
    })
    .post(bodyParser, (req, res) => {
        const knexInstance = req.app.get('db')
        const { name, chords, userid } = req.body
        const id = uuid()
        const progression = { id, name, userid }
        const progressionChords = chords.map(chord => { //rename keys to match db columns
            chord.id = id
            chord.userid = userid
        })

        //post to db
        ChordService.saveProgression(knexInstance, progression) //save the progression name
            .then(success => res.status(201).json(result))
            .catch(next)

        progressionChords.forEach(chord => { //save the individual chords
            ChordService.saveProgressionChords(knexInstance, chord)
                .then(success => res.status(201).json(result))
        })
        logger.info(`Progression with id ${id} stored.`)
        
    })

chordRouter.route('/progressions/:progressionId')
    .get((req, res) => {
        const { id } = req.params
        const progression = ProgStore.find(p => p.id == id)

        if (!progression) {
            logger.error(`Progression with id ${id} not found.`)
            return res.status(404).send('Progression not found.')
        }

        res.json(progression)
    })
    .delete((req, res) => {
        const { id } = req.params
        //delete from db
    })

    module.exports = chordRouter