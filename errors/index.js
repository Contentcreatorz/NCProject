module.exports = {
  customError: (error, response, next) => {
    const { message, status } = error

    console.log(error)
    console.table(Object.entries(error).reduce((acc, [key, value]) => (value && (acc[key] = { [message]: value }), acc), {}))

    if (status && message) return response.status(status).send(message)
  },

  psqlError: (error, response) => {
    const { code, routine, constraint } = error

    if (constraint === 'comments_article_id_fkey') return response.status(404).send('Article Not Found')

    if (['ri_ReportViolation', 'pg_strtoint32', 'ExecConstraints'].includes(routine)) return response.status(400).send('Bad Request')

    if (code) return ({
      23503: response.status(404).send('Article Not Found'),
      23502: response.status(400).send('Bad Request'),
    }[code])
  },

  serverError: response => {
    response.status(500).send('There appears to be an internal server error.')
  },
}