const ChordService = {
    getChords(knex) {
        return knex.select('*').from('notes')
    },
    getScales(knex) {
        return knex.select('*').from('scales')
    },
    getProgressions(knex, userid) {
        return knex.select('*').from('progressions').where('userid', userid)
    },
    getProgressionById(knex, id) {
        return knex.select('*').from('progressionchords').where('progressionid', id).orderBy('orderid')
    },
    deleteProgression(knex, id) {
        return knex('progressions').where('id', id).delete()
    },
    updateProgression(knex, id, content) {
        return knex('progressionchords').where('progressionid', id).orderBy('orderid').update(content)
    }
}

module.exports = ChordService