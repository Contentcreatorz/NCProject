const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
// seed(data).then(() => (db.end()))
beforeEach(() => seed(data));

describe("GET /api/topics", () => {
    it("responds with an array of topic objects containing the 'slug' and 'description' property", () => {
        request(app).get('/api/topics')
            .expect(200)
            .then(({ body: { message: msg } }) => {
                expect(msg).toBe('something');
            })
    })


})