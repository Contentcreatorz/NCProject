const db = require('../db/connection.js')
const app = require('../app.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("GET /api/topics", () => {
    it("responds with an object containing an array of topic objects that have 'slug' and 'description' as properties", () => request(app).get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
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

describe.only("GET /api/articles", () => {
    it("responds with an object containing an array of article objects that have `title`, `article_id`, `topic`, `created_at`, `votes` and `comment_count` as properties", () => request(app).get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12)
            articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                }))
            })
        })
    )
})