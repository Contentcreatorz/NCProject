const app = require("express")()
const { getTopics, getArticles } = require('./controllers.js')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)

app.use((error, request, response, next) => {
    console.table([error].reduce((relevantError, error) => {
        for (const key in error) {
            if (Object.hasOwnProperty.call(error, key)) {
                const element = error[key];
                if (element) relevantError[key] = element;
            }
        }
        return relevantError
    }, {}))
    response.status(500).send('There appears to be an internal server error.')
})


module.exports = app