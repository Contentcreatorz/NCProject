const database = (psql, ...replacements) => require('./db/connection.js')
    .query(require('pg-format')(psql, ...replacements))

exports.selectTopics = () => database(`SELECT * FROM topics;`)
    .then(({ rows: topics }) => topics)

exports.selectArticles = () => database(`
SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, 
CAST (COUNT(comment_id) AS INT) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`)
    .then(({ rows: articles }) => articles)

exports.selectArticleById = (articleId) => database(`
SELECT * FROM articles WHERE article_id = %L;`, [articleId]).then(({ rows: articles }) => articles.length
    ? articles
    : Promise.reject({ status: 404, message: 'Article Not Found' }))

exports.selectCommentsByArticle = (articleId) => database(`
SELECT comment_id, votes, created_at, author, body FROM comments 
WHERE article_id = %L 
ORDER BY created_at DESC;`, [articleId]).then(({ rows: comments }) => comments.length
    ? comments
    : Promise.reject({ status: 404, message: 'Article Not Found' }))

exports.insertCommentToArticle = ({ article_id, body: { username, body } }) => database(`    
INSERT INTO comments (body, author, article_id) VALUES (%L) RETURNING *;`,
    [body, username, article_id])
    .then(({ rows: [comment] }) => comment)
    