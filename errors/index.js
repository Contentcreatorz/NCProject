exports.errorHandler = (error, response) => {
  const { code, status, message, routine, constraint } = error

  console.log(error)
  console.table(
    Object.entries(error).reduce(
      (acc, [key, value]) => (value && (acc[key] = { [message]: value }), acc),
      {}
    )
  )

  if (constraint === 'comments_article_id_fkey')
    response.status(404).send('Article Not Found')

  if (
    ['ri_ReportViolation', 'pg_strtoint32', 'ExecConstraints'].some(
      psqlRoutine => psqlRoutine === routine
    )
  )
    response.status(400).send('Bad Request')

  code &
    {
      23503: response.status(404).send('Article Not Found'),
      23502: response.status(400).send('Bad Request'),
    }[code]

  if (status && message) response.status(status).send(message)

  response.status(500).send('There appears to be an internal server error.')
}
