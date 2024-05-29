const { selectTopics, selectArticleById } = require('../models/topics.models')
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
    selectArticleById(article_id).then((article) => { res.status(200).send({ article })});
};
