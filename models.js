const database = (psql, ...replacements) => require('./db/connection.js').query(require('pg-format')(psql, ...replacements))

exports.selectTopics = () => database(`SELECT * FROM topics;`).then(({ rows: topics }) => topics)

exports.selectArticles = (author, topic, sortBy, order) => database(...['validateQuery', 'queryString', 'replacements'].reduce((Args, step) => ({
    queryString: () => Args.push(`
    SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, 
    CAST (COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ` +

        ((processedWhereClause = [
            topic ? `articles.topic = %L` : '',
            author ? `articles.author = %L` : ''
        ].reduce((whereClause, filter) => `${whereClause} ${filter ? `${whereClause.length > 6 ? 'AND' : ''} ${filter}` : ''}`,
            'WHERE').trim()) === 'WHERE' ? '' : ` ${processedWhereClause} `) +

        `
    GROUP BY articles.article_id
    ORDER BY articles.${sortBy || 'created_at'} ${order || 'DESC'}`),

    replacements: () => {
        if (topic) Args.push(topic)
        if (author) Args.push(author)
    },

    validateQuery: () => {
        if (sortBy && !['title', 'topic', 'author', 'created_at', 'votes'].includes(sortBy))
            throw { status: 400, message: 'Invalid sort query' }
        if (order && !['asc', 'desc'].includes(order))
            throw { status: 400, message: 'Invalid order query' }
    },
}[step]())
    ? Args
    : Args,
    [])).then(({ rows: articles }) => articles)


exports.selectArticleById = article_id => database(`
SELECT articles.*, CAST (COUNT(comments.comment_id) AS INT) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.article_id = %L
GROUP BY articles.article_id;`,
    [article_id]
).then(({ rows: [article] }) => article
    ? article
    : Promise.reject({ status: 404, message: 'Article Not Found' })
)

exports.selectCommentsByArticle = articleId => database(`
SELECT comment_id, votes, created_at, author, body FROM comments 
WHERE article_id = %L 
ORDER BY created_at DESC;`,
    [articleId]
).then(({ rows: comments }) => comments.length
    ? comments
    : Promise.reject({ status: 404, message: 'Article Not Found' })
)

exports.insertCommentToArticle = ({ article_id, body: { username, body } }) => database(`    
INSERT INTO comments (body, author, article_id) VALUES (%L) RETURNING *;`,
    [body, username, article_id]
).then(({ rows: [comment] }) => comment)

exports.updateArticleVote = (article_id, inc_votes) => database(`
UPDATE articles
SET votes = votes + %L
WHERE article_id = %L
RETURNING *;`,
    [inc_votes],
    [article_id]
).then(({ rows: [article] }) => (article ? article : Promise.reject(rows)))

exports.selectUsers = () => database(`SELECT * FROM users;`).then(({ rows: users }) => users)

exports.deleteComment = (commentId) => database(`
DELETE FROM comments
WHERE comment_id = %L
RETURNING *`,
    [commentId]
).then(({ rows: comment }) => comment.length
    ? comment
    : Promise.reject({ status: 404, message: 'Comment Not Found' })
)

exports.readEndpointJSON = () => require('fs/promises').readFile('./ENDpoints.json', 'utf8')