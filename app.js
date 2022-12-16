const app = require("express")()
const { getTopics, getArticles, getArticleById, getCommentsByArticle } = require('./controllers.js')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.use((error, request, response, next) => {
    console.table([error].reduce((relevantError, error) => {
        for (const key in error) {
            if (Object.hasOwnProperty.call(error, key)) {
                const element = error[key];
                if (element) relevantError[key] = element
            }
        }
        return relevantError
    }, {}))

    const { status, message, code } = error

    if (code === '22P02') return response.status(400).send('Bad Request')
    if (status && message) return response.status(status).send(message)

    response.status(500).send('There appears to be an internal server error.')
})

module.exports = app