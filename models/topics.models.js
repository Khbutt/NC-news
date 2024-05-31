const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then((res) => {
        return res.rows;
    })
    };

exports.selectArticleById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
        return rows[0]
    })
    };

exports.selectAllArticles = () => {
    return db
    .query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;")
    .then((data) => {
        return data.rows
    })
}

exports.selectAllComments = (article_id) => {
    return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id] )
    .then(({rows}) => {
        return rows
        })
    }

exports.insertComment = (article_id, newComment) => {
    const { username, body } = newComment 
    console.log(article_id, username, body)
    return db
    .query("INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;", [body, username, article_id])
    .then(({ rows }) => {
        return rows[0]
    });
}