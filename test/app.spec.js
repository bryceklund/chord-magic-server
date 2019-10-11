const app = require('../src/app');

describe('App', () => {
    it('GET / responds with 200 containing "HELL WORLD"', () => {
        return supertest(app)
                .get('/')
                .set({'Authorization': 'Bearer abd484f0-7cf0-4978-bdba-841e668a5ab0'})
                .expect(200, 'HELL WORLD')
    });
});