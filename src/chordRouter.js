const expresas = require('express')
const uuid = require('uuid/v4')
const PORT = process.env.PORT
const { AudioStore, ProgStore } = require('./AudioStore')

const scales = AudioStore.chords
const chordRouter = express.Router()
const bodyParser = express.json()

chordRouter.route('/scales')
    .get((req, res) => {
        res.json(scales)
    })

chordRouter.route('/chords')
    .get((req, res) => {
        res.json(scales[req.body.scale])
    })

chordRouter.route('/progressions')
    .get((req, res) => {
        res.json(ProgStore)
    })
    .post((req, res) => {
        const 
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