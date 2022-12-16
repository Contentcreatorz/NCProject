const database = (psql, ...replacements) => require('./db/connection.js').query(psql, ...replacements)

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
SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({ rows: articles }) => articles.length
        ? articles
        : Promise.reject({ status: 404, message: 'Article Not Found' }))