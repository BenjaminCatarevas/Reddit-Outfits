const promise = require("bluebird");
const configInfo = require("./config");

// pg-promise initialization options;
const initOptions = {
  // bluebird promise library instead of default ES6 Promise;
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const config = {
  user: configInfo.login.username,
  password: configInfo.login.password,
  host: configInfo.databaseInfo.host,
  port: configInfo.databaseInfo.port,
  database: configInfo.databaseInfo.databaseName
};

const db = pgp(config);

/* Query functions */
async function getCommentsByUser(req, res, next) {
  let authorName = req.params.author_name;
  try {
    const commentData = await db.any(
      "SELECT * FROM outfit WHERE author_name = $1",
      [authorName]
    );
    // Create a JSON object to organize outfits by their comment ID.
    // We do this because outfits are stored as individual URLs, and are not inherently grouped by a comment.
    let commentsByCommentId = {};
    // Go through each comment of the user.
    for (let currentCommentRecord of commentData) {
      // Obtain the comment ID so we can make a new entry in the JSON object to be returned.
      let currentCommentId = currentCommentRecord.comment_id;
      // If we've already seen the comment ID before, we know it exists.
      if (currentCommentId in commentsByCommentId) {
        // So, we just add the outft to the already created array of outfit URLs.
        commentsByCommentId[currentCommentId].outfits.push(
          currentCommentRecord.outfit_url
        );
      } else {
        // For new entries, add the comment data to the entry so we can display it.
        const commentData = await db.any(
          "SELECT * FROM comment WHERE comment_id = $1",
          [currentCommentId]
        );
        commentsByCommentId[currentCommentId] = {
          authorName: commentData[0].author_name,
          outfits: [currentCommentRecord.outfit_url],
          commentBody: commentData[0].body,
          commentPermalink: commentData[0].comment_permalink,
          commentScore: commentData[0].comment_score,
          commentTimestamp: commentData[0].timestamp
        };
      }
    }
    return await res.status(200).json({
      success: true,
      specificUserComments: commentsByCommentId,
      message: `Retrieved all outfits of user ${authorName}`
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message || err
    });
  }
}

async function getThreadsBySubreddit(req, res, next) {
  let subreddit = req.params.subreddit;
  try {
    const data = await db.any("SELECT * FROM thread WHERE subreddit = $1", [
      subreddit
    ]);
    return await res.status(200).json({
      success: true,
      subredditThreads: data,
      message: `Retrieved all threads from ${subreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

async function getCommentsOfThreadByThreadId(req, res, next) {
  // Use the thread ID member variable from the thread component on the front-end (with React)

  // NOTE: We need to sort the data by comment ID like we did for getting comments from a user
  // Abstract function getting comments from user query to own function and call in each query function
  let subreddit = req.params.subreddit;
  let threadId = req.params.threadId;
  try {
    const data = await db.any(
      "SELECT * FROM outfit WHERE subreddit = $1 AND thread_id = $2",
      [subreddit, threadId]
    );
    return await res.status(200).json({
      success: true,
      threadOutfits: data,
      message: `Retrieved all outfits from thread ${threadId} of subreddit ${subreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.messgae || err
    });
  }
}

async function getAllUsers(req, res, next) {
  try {
    const data = await db.any("SELECT * FROM author");
    return await res.status(200).json({
      success: true,
      allUsers: data,
      message: "Retrieved all users."
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

async function getAllThreads(req, res, next) {
  try {
    const data = await db.any("SELECT * FROM thread");
    return await res.status(200).json({
      success: true,
      allThreads: data,
      message: "Retrieved all threads."
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

module.exports = {
  getCommentsByUser: getCommentsByUser,
  getThreadsBySubreddit: getThreadsBySubreddit,
  getCommentsOfThreadByThreadId: getCommentsOfThreadByThreadId,
  getAllUsers: getAllUsers,
  getAllThreads: getAllThreads
};
