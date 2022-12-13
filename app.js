const app = require("express")()
const { getTopics } = require('./controllers.js')

app.get('/api/topics', getTopics)

app.use((error, request, response, next) => {
    response.status(500).send('There was an internal server error.')
})


module.exports = app