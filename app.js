const app = require('express')()
const {
    getTopics,
    getArticles,
    getArticleById,
    getCommentsByArticle,
    updateArticleVotes,
    postCommentToArticle,
    getUsers,
    deleteCommentById,
    getEndpointJSON
} = require('./controllers.js')
const { customError, serverError, psqlError } = require('./errors/index.js')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)
app.get('/api/users', getUsers)
app.get('/api', getEndpointJSON)


app.use(require('express').json())

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.patch('/api/articles/:article_id', updateArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.use((error, request, response, next) => customError(error, response, next(error)))
app.use((error, request, response, next) => psqlError(error, response, next(error)))
app.use((error, request, response) => serverError(response))

module.exports = app
