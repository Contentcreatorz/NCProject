const app = require("express")();
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentToArticle,
} = require("./controllers.js");
const { some } = require("./db/data/test-data/articles.js");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.use(require("express").json());

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.use((error, request, response, next) => {
  const { code, status, message, routine, constraint } = error;

  console.table(
    Object.keys(error)
      .filter((key) => error[key])
      .reduce((acc, key) => {
        acc[key] = { [message]: error[key] };
        return acc;
      }, {})
  );

  if (constraint === "comments_article_id_fkey")
    response.status(404).send("Article Not Found");

  if (
    ["ri_ReportViolation", "pg_strtoint32", "ExecConstraints"].some(
      (r) => r === routine
    )
  )
    response.status(400).send("Bad Request");

  if (code === "23503") response.status(404).send("Article Not Found");
  if (code === "23502") response.status(400).send("Bad Request");

  if (status && message) response.status(status).send(message);

  response.status(500).send("There appears to be an internal server error.");
});

module.exports = app;
