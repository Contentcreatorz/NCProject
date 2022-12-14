const app = require("express")()
const { getTopics, getArticles } = require('./controllers.js')
const { GET, USE } = {
    GET: (path, Function) => app.get(path, Function),

    USE: (Function) => app.use(Function)
}

GET('/api/topics', getTopics)
GET('/api/articles', getArticles)

USE((error, request, response, next) => {
    response.status(500).send('There appears to be an internal server error.')
})


module.exports = app