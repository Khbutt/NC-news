const express = require('express')
const { 
  getTopics,
  getApi,
  getArticles,
  getAllArticles,
  getComments,
  postComments,
  patchComments,
} = require('./controllers/topics.controllers')
const app = express()

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticles);
app.get('/api/articles/', getAllArticles);
app.get('/api/articles/:article_id/comments', getComments);
app.post('/api/articles/:article_id/comments', postComments);
app.patch('/api/articles/:article_id', patchComments);

//handles when path is incorrect
app.all('*', (req, res) => {
    res.status(404).send({msg: "Not Found"})
      })

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02"){
    res.status(400).send({msg: "Bad Request"})
  } else {
    next(err)
  }
})

//custom errors
app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: "Not Found" })
  } else {
    next(err)
  }
})

//server errors
app.use((err, req, res, next) => {
console.log(err, "<<------ from our 500")
res.status(500).send({ msg: "Code is broken"})
})


module.exports = app;