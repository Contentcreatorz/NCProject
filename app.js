const app = require('express')()
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  updateArticleVotes,
  postCommentToArticle,
} = require('./controllers.js')
const { errorHandler } = require('./errors/index.js')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.use(require('express').json())

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.patch('/api/articles/:article_id', updateArticleVotes)

app.use((error, request, response, next) => errorHandler(error, response))

module.exports = app
