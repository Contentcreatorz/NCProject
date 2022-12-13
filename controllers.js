const { selectTopics } = require('./models.js')

exports.getTopics = (request, response, next) => selectTopics()
    .then(topics => response.status(200).send({ topics }))
    .catch(next)
