const db = require('../db/connection.js')
const app = require('../app.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('GET /api/topics', () => {
  it("responds with an object containing an array of topic objects that have 'slug' and 'description' as properties", () =>
    request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3)
        topics.forEach(topic => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          )
        })
      }))
})

describe('GET /api/articles', () => {
  it('responds with an object containing an array of article objects that have `title`, `article_id`, `topic`, `created_at`, `votes` and `comment_count` as properties', () =>
    request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12)
        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          )
        })
      }))

  it('should be sorted by date in descending order', () =>
    request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        })
      }))
})

describe('GET /api/articles/:article_id', () => {
  it('responds with an object containing an array of article objects that have `title`, `article_id`, `topic`, `author`, `created_at`, `votes` and `body` as properties', () =>
    request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 2,
              title: 'Sony Vaio; or, The Laptop',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
              created_at: expect.any(String),
              votes: 0,
            })
          )
        })
      }))

  it('responds with an error code 404, when passed a valid but unavailable id', () =>
    request(app)
      .get('/api/articles/49115776')
      .expect(404)
      .then(({ error: { text } }) => {
        expect(text).toBe('Article Not Found')
      }))

  it('responds with an error code 400, when passed a malformed id', () =>
    request(app)
      .get('/api/articles/BANANA')
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))
})

describe('GET /api/articles/:article_id/comments', () => {
  it('responds with an object containing an array of article objects that have `comment_id`, `votes`, `created_at`, `author` and `body` as properties', () =>
    request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11)
        comments.forEach(comment => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          )
        })
      }))

  it('responds with the most recent comment first', () =>
    request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy('created_at', {
          descending: true,
        })
      }))

  it('responds with an error code 404, when passed a valid but unavailable id', () =>
    request(app)
      .get('/api/articles/49115776/comments')
      .expect(404)
      .then(({ error: { text } }) => {
        expect(text).toBe('Article Not Found')
      }))

  it('responds with an error code 400, when passed a malformed id', () =>
    request(app)
      .get('/api/articles/BANANA/comments')
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))
})

describe('POST /api/articles/:article_id/comments', () => {
  it('Request body accepts an object with the `username` and `body` properties, then responds with the posted comment.', () =>
    request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'butter_bridge',
        body: 'All bow to the Sultan of Sentiment!',
      })
      .expect(201)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual(
          expect.objectContaining({
            author: 'butter_bridge',
            body: 'All bow to the Sultan of Sentiment!',
          })
        )
      }))

  it('responds with an error code 404, when passed a valid but unavailable id', () =>
    request(app)
      .post('/api/articles/14919847/comments')
      .send({
        username: 'butter_bridge',
        body: 'All bow to the Sultan of Sentiment!',
      })
      .expect(404)
      .then(({ error: { text } }) => {
        expect(text).toBe('Article Not Found')
      }))

  it('responds with an error code 400, when passed a malformed id', () =>
    request(app)
      .post('/api/articles/BANANA/comments')
      .expect(400)
      .send({
        username: 'butter_bridge',
        body: 'All bow to the Sultan of Sentiment!',
      })
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))

  it('responds with an error code 400, when passed a malformed body', () =>
    request(app)
      .post('/api/articles/1/comments')
      .expect(400)
      .send({})
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))

  it('responds with an error code 400, when passed a malformed body', () =>
    request(app)
      .post('/api/articles/1/comments')
      .expect(400)
      .send({
        username: 1,
        body: true,
      })
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))
})

describe('PATCH /api/articles/:article_id', () => {
  it('should update the votes property of the article by the specified amount and return the updated article with a 200 OK status code.', () =>
    request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 110,
          })
        )
      }))

  it('should return a 404 Not Found error if the article with the specified ID was not found', () =>
    request(app)
      .patch('/api/articles/14919847')
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ error: { text } }) => {
        expect(text).toBe('Article Not Found')
      }))

  it('responds with an error code 400, when passed a malformed body missing the required fields', () =>
    request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))

  it('responds with an error code 400, when passed a body with an incorrect type for the required fields', () =>
    request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'this is not how many votes are required' })
      .expect(400)
      .then(({ error: { text } }) => {
        expect(text).toBe('Bad Request')
      }))
})
