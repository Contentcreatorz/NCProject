const app = require("express")()
const { getTopics, getArticles, getArticleById } = require('./controllers.js')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.use((error, request, response, next) => {
    const { status, message } = error

    if (status && message) return response.status(status).send(message)

    next(error)
})

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
    response.status(500).send('There appears to be an internal server error.')
})

module.exports = app