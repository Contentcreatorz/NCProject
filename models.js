const database = (psql, ...replacements) =>
  require('./db/connection.js').query(
    require('pg-format')(psql, ...replacements)
  )

exports.selectTopics = () =>
  database(`SELECT * FROM topics;`).then(({ rows: topics }) => topics)

exports.selectArticles = (topic, sort_by, order) => {
  let query = `
  SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, 
  CAST (COUNT(comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`
  let values = []

  if (topic) {
    query += ` WHERE articles.topic = %L`
    values.push(topic)
  }

  query += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by || 'created_at'} ${order || 'DESC'}`

  return database(query, values).then(({ rows: articles }) => articles)
}

exports.selectArticleById = article_id =>
  database(
    `
SELECT articles.*, CAST (COUNT(comments.comment_id) AS INT) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.article_id = %L
GROUP BY articles.article_id;`,
    [article_id]
  ).then(({ rows: articles }) => {
    if (articles.length) {
      return articles[0]
    } else {
      return Promise.reject({ status: 404, message: 'Article Not Found' })
    }
  })

exports.selectCommentsByArticle = articleId =>
  database(
    `
SELECT comment_id, votes, created_at, author, body FROM comments 
WHERE article_id = %L 
ORDER BY created_at DESC;`,
    [articleId]
  ).then(({ rows: comments }) =>
    comments.length
      ? comments
      : Promise.reject({ status: 404, message: 'Article Not Found' })
  )

exports.insertCommentToArticle = ({ article_id, body: { username, body } }) =>
  database(
    `    
INSERT INTO comments (body, author, article_id) VALUES (%L) RETURNING *;`,
    [body, username, article_id]
  ).then(({ rows: [comment] }) => comment)

exports.updateArticleVote = (article_id, inc_votes) =>
  database(
    `
UPDATE articles
SET votes = votes + %L
WHERE article_id = %L
RETURNING *;`,
    [inc_votes],
    [article_id]
  ).then(({ rows: [article] }) => (article ? article : Promise.reject(rows)))

exports.selectUsers = () =>
  database(`SELECT * FROM users;`).then(({ rows: users }) => users)
