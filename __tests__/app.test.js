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

describe("GET /api/articles", () => {
    it("responds with an object containing an array of article objects that have `title`, `article_id`, `topic`, `created_at`, `votes` and `comment_count` as properties"
        , () => request(app).get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(12)
                articles.forEach(article => {
                    expect(article).toEqual(expect.objectContaining({
                        author: expect.any(String),
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

    it("should be sorted by date in descending order"
        , () => request(app).get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('created_at', {
                    descending: true
                })
            })
    )
})

describe("GET /api/articles/:article_id", () => {
    it("responds with an object containing an array of article objects that have `title`, `article_id`, `topic`, `author`, `created_at`, `votes` and `body` as properties"
        , () => request(app).get("/api/articles/2").expect(200)
            .then(({ body: { articles } }) => {
                articles.forEach(article => {
                    expect(article).toEqual(expect.objectContaining({
                        article_id: 2,
                        title: "Sony Vaio; or, The Laptop",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: 0,
                    }))
                })
            })
    )

    it("responds with an error code 404, when passed a valid but in available id"
        , () => request(app).get("/api/articles/49115776").expect(404)
            .then(({ error: { text } }) => {
                expect(text).toBe('Article Not Found');
            })
    )

    it("responds with an error code 400, when passed a malformed id"
        , () => request(app).get("/api/articles/BANANA").expect(400)
            .then(({ error: { text } }) => {
                expect(text).toBe('Bad Request');
            })
    )
})