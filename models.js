const database = psql => require('./db/connection.js').query(psql)

exports.selectTopics = () => database(`SELECT * FROM topics;`)
    .then(({ rows: topics }) => topics)

exports.selectArticles = () => database(`
    SELECT a.article_id, a.title, a.topic, a.created_at, a.votes, COUNT(comment_id) AS comment_count
    FROM articles AS a 
    LEFT JOIN comments AS c 
    ON a.article_id = c.article_id 
    GROUP BY a.article_id
    ORDER BY a.created_at DESC
    ;`)
    .then(({ rows: articles }) => {
        articles.forEach(article => article.comment_count = Number(article.comment_count))
        return articles
    })