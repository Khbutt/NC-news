const { selectTopics, selectArticleById, selectAllArticles, selectAllComments } = require('../models/topics.models')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints })   
};

exports.getArticles = (req, res) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => { 
        res.status(200).send({ article })});
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err)=> {
        next(err)
    })
}

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    selectAllComments(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
    }