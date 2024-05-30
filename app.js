const express = require('express')
const { 
  getTopics,
  getApi,
  getArticles,
  getAllArticles,
} = require('./controllers/topics.controllers')
const app = express()


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticles);
app.get('/api/articles/', getAllArticles);


app.all('*', (req, res) => {
    res.status(404).send({msg: "404 - Not Found"})
      })


module.exports = app;