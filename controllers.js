const { selectTopics, selectArticles } = require('./models.js')

exports.getTopics = (request, response, next) => selectTopics()
    .then(topics => {
        response.status(200).send({ topics })
    })
    .catch(next)

exports.getArticles = (request, response, next) => selectArticles()
    .then(articles => {
        response.status(200).send({ articles })
    })
    .catch(next)
