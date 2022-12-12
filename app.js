const app = require("express")()
const { getTopics } = require('./controllers.js')

app.get('api/topics', getTopics)

module.exports = app