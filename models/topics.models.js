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
    return db
    .query("INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;", [body, username, article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
        return rows[0]
    })
}

exports.updateComment = (article_id, inc_votes) => {
    return db
      .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "This comment id has not returned any updates"})
        }
        console.log(rows[0])
        return rows[0]
      });
  };

  exports.removeComment = (comment_id) => {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
      .then((data) => {
        console.log(data.rows[0], '<----- DELETED COMMENT')
        const deletedComment = data.rows[0];
        return deletedComment;
      });
  };