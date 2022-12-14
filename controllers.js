module.exports = {
    _imported: { selectTopics, selectArticles } = require('./models.js'),

    getTopics: (request, response, next) => selectTopics()
        .then(topics => {
            response.status(200).send({ topics })
        })
        .catch(next),

    getArticles: (request, response, next) => selectArticles()
        .then(articles => {
            response.status(200).send({ articles })
        })
        .catch(next),

}