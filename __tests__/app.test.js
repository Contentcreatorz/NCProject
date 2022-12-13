const db = require('../db/connection.js')
const app = require('../app.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')

beforeEach(() => seed(data))

afterAll(() => db.end && db.end())

describe("GET /api/topics", () => {

    it("responds with an object containing an array of topic objects that have 'slug' and 'description' as properties", () => request(app).get("/api/topics")
        .expect(200).then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3)
            topics.forEach(topic => {
                expect(topic).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    )

})