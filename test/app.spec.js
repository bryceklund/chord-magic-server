const app = require('../src/app.js')
const knex = require('knex')
const AuthService = require('../src/authService')

describe('chordRouter', () => {
    const jwt = AuthService.createJwt('bryce', { userid: 001 })
    const scales = [ "maj", "min", "maj7", "min7", "dim", "dom7", "sus2", "sus4", "aug" ]
    const notes = [ "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab" ]
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })
    after('disconnect from the db', () => db.destroy())

    function makeChordTest(url) {
        return it(`GET ${url} responds with 200 and an array of notes`, (done) => {
            supertest(app)
                    .get(url)
                    .set({'Authorization': 'Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445'})
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.be.an('array')
                        expect(res.body.length).to.be.gte(3)
                    })
                    .end(done)
        })
    }
    scales.forEach(scale => {
        notes.forEach(note => {
            makeChordTest(`/api/chord/${scale}/${note}`)
        })
    })


    it('GET /api/scales responds with 200 and a list of scales', () => {
        return supertest(app)
                .get('/api/scales')
                .set({'Authorization': 'Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445'})
                .expect(200, scales)
    })
    it('GET /api/chords responds with 200 and a list of nodes', () => {
        return supertest(app)
                .get('/api/chords')
                .set({'Authorization': 'Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445'})
                .expect(200, notes)
    })

    it('GET /api/progressions/saved responds with 200 and a list of progressions', () => {
        return supertest(app)
                .get('/api/progressions/saved')
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445 ${jwt}` })
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.key
                })
    })

    it('POST /api/progressions/saved responds with 201 and a uuid', () => {
        const progression = { 
                                name: 'new progression', 
                                chords: [
                                    {
                                        "scale": "maj",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 0,
                                        "name": "G"
                                    },
                                    {
                                        "scale": "maj",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 1,
                                        "name": "B"
                                    },
                                    {
                                        "scale": "min",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 2,
                                        "name": "E"
                                    },
                                    {
                                        "scale": "maj",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 3,
                                        "name": "C"
                                    },
                                    {
                                        "scale": "maj",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 4,
                                        "name": "G"
                                    },
                                    {
                                        "scale": "min",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 5,
                                        "name": "B"
                                    },
                                    {
                                        "scale": "maj",
                                        "voice": "sawtooth",
                                        "oct": "minusTwo",
                                        "active": false,
                                        "id": 6,
                                        "name": "C"
                                    }
                                ]
                            }
        return supertest(app)
                .post('/api/progressions/saved')
                .send(progression)
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445 ${jwt}` })
                .expect(201)
                
        //this one passes but has a bunch of errors? help?
    })

    it('GET /api/progressionchords/:progressionId responds with 201 and an array of objects', () => {
        const expected = [ 
                            { scale: 'min',
                                progressionid: '21469cb0-87fc-449a-af59-8e2bb3f36147',
                                voice: 'sawtooth',
                                oct: 'minusTwo',
                                active: false,
                                id: 1,
                                name: 'A' },
                            { scale: 'maj',
                                progressionid: '21469cb0-87fc-449a-af59-8e2bb3f36147',
                                voice: 'sawtooth',
                                oct: 'minusTwo',
                                active: false,
                                id: 2,
                                name: 'B' },
                            { scale: 'min',
                                progressionid: '21469cb0-87fc-449a-af59-8e2bb3f36147',
                                voice: 'sawtooth',
                                oct: 'minusTwo',
                                active: false,
                                id: 3,
                                name: 'C' } 
                        ]
        return supertest(app)
                .get('/api/progressionchords/21469cb0-87fc-449a-af59-8e2bb3f36147')
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445 ${jwt}` })
                .expect(200, expected)
    })

    it('PATCH /api/progressionchords/:progressionId responds with 200 and a success message', () => {
        const newChords = [
                                {
                                    "scale": "maj",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 0,
                                    "name": "G"
                                },
                                {
                                    "scale": "maj",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 1,
                                    "name": "B"
                                },
                                {
                                    "scale": "min",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 2,
                                    "name": "E"
                                },
                                {
                                    "scale": "maj",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 3,
                                    "name": "C"
                                },
                                {
                                    "scale": "maj",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 4,
                                    "name": "G"
                                },
                                {
                                    "scale": "min",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 5,
                                    "name": "B"
                                },
                                {
                                    "scale": "maj",
                                    "voice": "sawtooth",
                                    "oct": "minusTwo",
                                    "active": false,
                                    "id": 6,
                                    "name": "C"
                                }
                            ]
        return supertest(app)
                .patch('/api/progressionchords/21469cb0-87fc-449a-af59-8e2bb3f36147')
                .send({ chords: newChords })
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445 ${jwt}` })
                .expect(200, 'Progression 21469cb0-87fc-449a-af59-8e2bb3f36147 overwritten.')
    })

    it('DELETE /api/progressionchords/:progressionId responds with 200 and \'Progression deleted successfully\'', () => {
        return supertest(app)
                .delete('/api/progressionchords/8dfd17e9-1219-44a0-b4d1-a64c14d55e4f')
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445 ${jwt}` })
                .expect(200, 'Progression deleted successfully')
    })

    it('POST /api/login responds with a jwt', () => {
        const user = { username: 'bryce', password: 'swag420' }
        return supertest(app)
                .post('/api/login')
                .send(user)
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445` })
                .expect(200)
                .expect(res => {
                    expect(AuthService.verifyJwt(res.body.authToken).userid).to.equal(1)
                    expect(AuthService.verifyJwt(res.body.authToken).sub).to.equal('bryce') 
                })

    })

    it('POST /api/users responds with 201 and a success message', () => {
        const user = { username: 'testuser', password: 'password' }
        return supertest(app)
                .post('/api/users')
                .send(user)
                .set({ 'Authorization': `Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445` })
                .expect(201, 'User \'testuser\' created')
    })
})