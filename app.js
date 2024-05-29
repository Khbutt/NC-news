const express = require('express')
const { 
  getTopics,
  getApi
 } = require('./controllers/topics.controllers')
const app = express()


app.get('/api/topics', getTopics);
app.get('/api', getApi);


app.all('*', (req, res) => {
    res.status(404).send({msg: "404 - Not Found"})
      })


module.exports = app;