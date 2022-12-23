const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticle,
  updateArticleVote,
  selectUsers,
  insertCommentToArticle,
} = require('./models.js')

exports.getTopics = (request, response, next) =>
  selectTopics()
    .then(topics => {
      response.status(200).send({ topics })
    })
    .catch(next)

exports.getArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query
  selectArticles(topic, sort_by, order)
    .then(articles => {
      response.status(200).send({ articles })
    })
    .catch(next)
}
exports.getArticleById = ({ params: { article_id } }, response, next) => {
  selectArticleById(article_id)
    .then(article => {
      response.status(200).send({ article })
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

exports.postCommentToArticle = (
  { body, params: { article_id } },
  response,
  next
) => {
  insertCommentToArticle({ article_id, body })
    .then(comments => {
      response.status(201).send({ comments })
    })
    .catch(next)
}

exports.updateArticleVotes = (
  { body: { inc_votes }, params: { article_id } },
  response,
  next
) => {
  updateArticleVote(article_id, inc_votes)
    .then(updatedArticle => {
      response.status(200).send({ updatedArticle })
    })
    .catch(next)
}

exports.getUsers = (request, response, next) =>
  selectUsers()
    .then(users => {
      response.status(200).send({ users })
    })
    .catch(next)
