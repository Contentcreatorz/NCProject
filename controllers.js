module.exports = {
    getTopics: (request, response, next) => selectTopics()
        .then(topics => response.status(200).send({ topics }))
        .catch(next),

    getArticles: ({ query: { author, title, topic, sort_by, order } }, response, next) => selectArticles(author, title, topic, sort_by, order)
        .then(articles => response.status(200).send({ articles }))
        .catch(next),

    getArticleById: ({ params: { article_id } }, response, next) => selectArticleById(article_id)
        .then(article => response.status(200).send({ article }))
        .catch(next),

    getCommentsByArticle: ({ params: { article_id } }, response, next) => selectCommentsByArticle(article_id)
        .then(comments => response.status(200).send({ comments }))
        .catch(next),

    postCommentToArticle: ({ body, params: { article_id } }, response, next) => insertCommentToArticle({ article_id, body })
        .then(comments => response.status(201).send({ comments }))
        .catch(next),

    updateArticleVotes: ({ body: { inc_votes }, params: { article_id } }, response, next) => updateArticleVote(article_id, inc_votes)
        .then(updatedArticle => response.status(200).send({ updatedArticle }))
        .catch(next),

    getUsers: (request, response, next) => selectUsers()
        .then(users => response.status(200).send({ users }))
        .catch(next),

    deleteCommentById: ({ params: { comment_id } }, response, next) => deleteComment(comment_id)
        .then(() => response.sendStatus(204))
        .catch(next),

    getEndpointJSON: (request, response, next) => readEndpointJSON()
        .then(data => response.status(200).send(JSON.parse(data)))
        .catch(next),

    _models: {
        selectTopics,
        selectArticles,
        selectArticleById,
        selectCommentsByArticle,
        insertCommentToArticle,
        updateArticleVote,
        selectUsers,
        deleteComment,
        readEndpointJSON,
    } = require('./models.js'),
}