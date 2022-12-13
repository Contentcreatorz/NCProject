const database = psql => require('./db/connection.js').query(psql)

exports.selectTopics = () => database(`SELECT * FROM topics;`)
    .then(({ rows: topics }) => topics)