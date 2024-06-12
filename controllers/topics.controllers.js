const { selectTopics, selectArticleById, selectAllArticles, selectAllComments, insertComment, updateComment, removeComment } = require('../models/topics.models')
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
return Promise.all([selectArticleById(article_id),
    selectAllComments(article_id)])
    .then((mystery) => {
        res.status(200).send({ comments: mystery[1] })
    })
    .catch((err) => {
        next(err)
    })
    }

    exports.postComments = (req, res, next) => {
        const { article_id } = req.params
        const newComment = req.body
        insertComment(article_id, newComment)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch((err) => {
            next(err)
        })
    };
    
    exports.patchComments = (req, res, next) => {
        const { article_id } = req.params
        const { inc_votes } = req.body
        updateComment(article_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment })
        })
    }

    exports.deleteComment = (req, res) => {
        const comment_id = req.params.comment_id;
        removeComment(comment_id).then((comment) => {
          res.status(204).send();
        });
      };