const {
    selectTopics,
    selectArticles,
    selectArticleById
} = require('./models.js')

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

exports.getArticleById = ({ params: { article_id } }, response, next) => {
    if (/\D/.test(article_id)) next({ status: 400, message: 'Bad Request' })

    selectArticleById(article_id)
        .then(articles => {
            response.status(200).send({ articles })
        })
        .catch(next)
}