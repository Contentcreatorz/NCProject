const {
    selectTopics,
    selectArticles,
    selectArticleById,
    selectCommentsByArticle,
    insertCommentToArticle
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
    selectArticleById(article_id)
        .then(articles => {
            response.status(200).send({ articles })
        })
        .catch(next)
}

exports.getCommentsByArticle = ({ params: { article_id } }, response, next) => {
    selectCommentsByArticle(article_id)
        .then(comments => {
            response.status(200).send({ comments })
        })
        .catch(next)
}

exports.postCommentToArticle = ({ body, params: { article_id } }, response, next) => {
    insertCommentToArticle({ article_id, body })
        .then(comments => {
            response.status(201).send({ comments })
        })
        .catch(next)
}