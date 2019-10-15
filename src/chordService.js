const ChordService = {
    getAllChords(knex) {
        return knex.select('*').from('notes')
    },
    getScales(knex) {
        return knex.select('*').from('scales')
    },
    getNotes(knex) {
        return knex.select('frequency').from('frequencies')
    },
    getFrequencies(knex, oct) {
        return knex.select('note', 'frequency').from('frequencies').where('octave', oct)
    },
    getChord(knex, chord, scale) {
        return knex.select('notes').from('chords').where({'name': chord, 'scale': scale})
    },
    getProgressions(knex, userid) {
        return knex.select('*').from('progressions').where('userid', userid)
    },
    getProgressionById(knex, id) {
        return knex.select('*').from('progressionchords').where('progressionid', id).orderBy('orderid')
    },
    saveProgression(knex, content) {
        knex('progressions').insert(content)
    },
    saveProgressionChords(knex, content) {
        knex('progressionchords').insert(content)
    },
    deleteProgression(knex, id) {
        return knex('progressions').where('id', id).delete()
    },
    updateProgression(knex, id, content) {
        return knex('progressionchords').where('progressionid', id).orderBy('orderid').update(content)
    }
}

module.exports = ChordService