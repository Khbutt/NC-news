const { selectTopics } = require('../models/topics.models')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints })   
};
