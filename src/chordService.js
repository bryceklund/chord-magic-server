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
        return knex.select('notes').from('chords').where('name', 'ilike', chord).where('scale', 'ilike', scale)
    },
    getProgressions(knex, userid) {
        return knex.select('id', 'name').from('progressions').where('userid', userid)
    },
    getProgressionById(knex, id) {
        return knex.select('*').from('progressionchords').where('progressionid', id).orderBy('orderid')
    },
    saveProgression(knex, content) {
        return knex('progressions').insert(content).returning('*')
    },
    saveProgressionChords(knex, content) {
        return knex('progressionchords').insert(content).returning('*')
    },
    deleteProgression(knex, id) {
        return knex('progressions').where('id', id).delete()
    },
    deleteProgressionChords(knex, id) {
        return knex('progressionchords').where('progressionid', id).delete()
    },
    updateProgression(knex, id, content) {
        return knex('progressionchords').where('progressionid', id).orderBy('orderid').update(content)
    }
}

module.exports = ChordService