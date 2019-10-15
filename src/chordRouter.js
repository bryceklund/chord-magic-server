const express = require('express')
const uuid = require('uuid/v4')
const PORT = process.env.PORT
const { AudioStore, ProgStore } = require('./AudioStore')
const ChordService = require('./chordService')

const scales = AudioStore.chords
const chordRouter = express.Router()
const bodyParser = express.json()

chordRouter.route('/scales')
    .get((req, res) => {
        res.json(scales)
    })

chordRouter.route('/chords')
    .get(bodyParser, (req, res) => {
        res.json(scales[req.body.scale])
    })

chordRouter.route('/progressions')
    .get((req, res) => {
        res.json(ProgStore)
    })
    .post(bodyParser, (req, res) => {
        const { name, chords } = req.body
        const id = uuid()
        const progression = { id, name, chords }
        //post to db
        logger.info(`Progression with id ${id} stored.`)
        res.status(201).location(`/progressions/`).json(result)
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