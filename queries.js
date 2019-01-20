const promise = require('bluebird');
const configInfo = require('./config');
const moment = require('moment');

// pg-promise initialization options;
const initOptions = {
    // bluebird promise library instead of default ES6 Promise;
    promiseLib: promise
}

const pgp = require('pg-promise')(initOptions);

const config = {
    user: configInfo.login.username,
    password: configInfo.login.password,
    host: configInfo.databaseInfo.host,
    port: configInfo.databaseInfo.port,
    database: configInfo.databaseInfo.databaseName
};

const db = pgp(config);

/* Query functions */
function getOutfitsByUser(req, res, next) {
    let author_name = req.params.author_name;
    db.any('SELECT * FROM outfit WHERE author_name = $1', author_name)
        .then(data => {
            // Create a JSON object to organize outfits by their comment ID.
            // We do this because outfits are stored as individual URLs, and are not inherently grouped by a comment.
            let outfitsByCommentId = {};
            for (let comment of data) {
                let commentId = comment.comment_id;
                if (commentId in outfitsByCommentId) {
                    outfitsByCommentId[commentId].outfits.push(comment.outfit_url);
                } else {
                    outfitsByCommentId[commentId] = {
                        outfits: [comment.outfit_url],
                        commentInfo: comment,
                    };
                };
            };
            res.status(200)
                .json({
                    success: true,
                    data: outfitsByCommentId,
                    message: `Retrieved outfits of user ${author_name}`
                });
        })
        .catch(err => {
            res.json({
                success: false,
                error: err.message || err
            });
        });
}

function getThreadsBySubreddit(req, res, next) {
    let subreddit = req.params.subreddit;
    db.any('SELECT * FROM thread WHERE subreddit = $1', subreddit)
        .then(data => {
            res.status(200)
                .json({
                    success: true,
                    data: data,
                    message: `Retrieved all threads from ${subreddit}`
                });
        })
        .catch(err => {
            res.json({
                success: false,
                error: err.message || err
            });
        });
}

function getOutfitsOfThreadByThreadId(req, res, next) {
    // Use the thread ID member variable from the thread component on the front-end (with React)
    let subreddit = req.params.subreddit;
    let threadId = req.params.threadId;
    db.any('SELECT * FROM outfit WHERE subreddit = $1 AND thread_id = $2', [subreddit, threadId])
        .then(data => {
            res.status(200)
                .json({
                    success: true,
                    data: data,
                    message: `Retrieved all outfits from thread ${threadId} of subreddit ${subreddit}`
                });
        })
        .catch(err => {
            res.json({
                success: false,
                error: err.messgae || err
            });
        });
}

module.exports = {
    getOutfitsByUser: getOutfitsByUser,
    getThreadsBySubreddit: getThreadsBySubreddit,
    getOutfitsOfThreadByThreadId: getOutfitsOfThreadByThreadId,
}