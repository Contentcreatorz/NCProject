const app = require("express")()
const { getTopics, getArticles, getArticleById, getCommentsByArticle, postCommentToArticle } = require('./controllers.js')
const { some } = require("./db/data/test-data/articles.js")

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.use(require("express").json())

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.use((error, request, response, next) => {
    console.table([error].reduce((relevantError, error) => {
        for (const key in error) {
            if (Object.hasOwnProperty.call(error, key)) {
                const element = error[key];
                if (element) relevantError[key] = element
            }
        }
        console.log(error)
        return relevantError
    }, {}))

    const { status, message, routine, code } = error

    if (['ri_ReportViolation', 'pg_strtoint32', 'ExecConstraints']
        .some(_ => routine)) response.status(400).send('Bad Request')

    if (code === '23503') response.status(404).send('Article Not Found')
    if (status && message) response.status(status).send(message)

    response.status(500).send('There appears to be an internal server error.')
})

module.exports = app