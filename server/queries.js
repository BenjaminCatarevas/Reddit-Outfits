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

const mapIntToSubreddit = {
  0: "malefashionadvice",
  1: "femalefashionadvice",
  2: "streetwear",
  3: "goodyearwelt",
  4: "rawdenim"
};

const db = pgp(config);

/* Heler functions */
async function sortCommentsByCommentId(data, res) {
  try {
    // Create a JSON object to organize outfits by their comment ID.
    // We do this because outfits are stored as individual URLs, and are not inherently grouped by a comment.
    let commentsByCommentId = {};
    // Go through each comment of the user.
    for (let currentOutfitRecord of data) {
      // Obtain the comment ID so we can make a new entry in the JSON object to be returned.
      let currentCommentId = currentOutfitRecord.comment_id;
      // If we've already seen the comment ID before, we know it exists.
      if (currentCommentId in commentsByCommentId) {
        // So, we just add the outft from the record to the already created array of outfit URLs.
        commentsByCommentId[currentCommentId].outfits.push(
          currentOutfitRecord.outfit_url
        );
      } else {
        // Otherwise, the current outfit is from a comment we haven't processed yet.
        // So we find the comment that has the outfit, and construct a new entry in the object based on the comment.
        const commentData = await db.any(
          "SELECT * FROM comment WHERE comment_id = $1",
          [currentCommentId]
        );
        commentsByCommentId[currentCommentId] = {
          authorName: commentData[0].author_name,
          outfits: [currentOutfitRecord.outfit_url],
          commentBody: commentData[0].body,
          commentPermalink: commentData[0].comment_permalink,
          commentScore: commentData[0].comment_score,
          commentTimestamp: commentData[0].comment_timestamp
        };
      }
    }
    return commentsByCommentId;
  } catch (err) {
    res.json({
      success: false,
      error: err.message || err
    });
  }
}

/* Query functions */
async function getCommentsFromSpecificUser(req, res, next) {
  let authorName = req.params.author_name;
  try {
    // Extract all outfit data.
    const outfitData = await db.any(
      "SELECT * FROM outfit WHERE author_name = $1",
      [authorName]
    );

    const commentsFromSpecificUser = await sortCommentsByCommentId(
      outfitData,
      res
    );
    return await res.status(200).json({
      success: true,
      commentsFromSpecificUser: commentsFromSpecificUser,
      message: `Retrieved all outfits of user ${authorName}`
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message || err
    });
  }
}

async function getCommentsOfThreadByThreadId(req, res, next) {
  // The subreddit comes in as an int from the React frontend, so convert it from an int to a subreddit.
  let { subredditAsInt } = req.params;
  let intToSubreddit = mapIntToSubreddit[Number(subredditAsInt)];
  let threadId = req.params.threadId;
  try {
    const threadData = await db.any(
      "SELECT * FROM outfit WHERE subreddit = $1 AND thread_id = $2",
      [intToSubreddit, threadId]
    );

    const commentsOfThreadByCommentId = await sortCommentsByCommentId(
      threadData,
      res
    );
    return await res.status(200).json({
      success: true,
      commentsOfThreadByCommentId: commentsOfThreadByCommentId,
      message: `Retrieved all outfits from thread ${threadId} of subreddit ${intToSubreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.messgae || err
    });
  }
}

async function getThreadsBySubreddit(req, res, next) {
  // The subreddit comes in as an int from the React frontend, so convert it from an int to a subreddit.
  let { subredditAsInt } = req.params;
  let intToSubreddit = mapIntToSubreddit[Number(subredditAsInt)];
  try {
    const data = await db.any("SELECT * FROM thread WHERE subreddit = $1", [
      intToSubreddit
    ]);
    return await res.status(200).json({
      success: true,
      subredditThreads: data,
      message: `Retrieved all threads from ${intToSubreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
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

async function getThreadByTimestamp(req, res, next) {
  let { year, month, day, subredditAsInt } = req.params;
  // Convert the year, month, and day into a formatted date.
  let formattedDate = year + "-" + month + "-" + day;
  // Then extract the timestamp from the formatted date.
  let specifiedTimestamp = new Date(formattedDate).getTime() / 1000;
  // The subreddit comes in as an int from the React frontend, so convert it from an int to a subreddit.
  let intToSubreddit = mapIntToSubreddit[Number(subredditAsInt)];
  try {
    // Check if any portion of the specified timestamp is not a number. If so, return nothing.
    if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
      return await res.json({
        success: false,
        error: "Invalid day, month, or year."
      });
    }
    // Query adapted from: https://stackoverflow.com/a/18270068 and https://stackoverflow.com/a/16610459
    const threadInformation = await db.any(
      `SELECT * 
      FROM thread 
      WHERE subreddit = $1
      AND TO_TIMESTAMP(thread_timestamp)::date >= TO_TIMESTAMP($2)
      AND TO_TIMESTAMP(thread_timestamp)::date < TO_TIMESTAMP($2) + INTERVAL '1 DAY'`,
      [intToSubreddit, specifiedTimestamp]
    );

    // We want to stop if the query yielded 0 results (and avoid sorting effectively nothing).
    if (threadInformation.length === 0) {
      return await res.status(200).json({
        success: true,
        specifiedThreadByTimestamp: [],
        message: `No data retrieved with given date ${formattedDate}`
      });
    } else {
      // We have the thread ID of the thread with the specified date.
      // So now we want to get the outfits from that thread, organize them, and return them.
      const outfitsOfThread = await db.any(
        "SELECT * FROM outfit WHERE thread_id = $1",
        [threadInformation[0].thread_id]
      );

      const commentsOfThreadByCommentId = await sortCommentsByCommentId(
        outfitsOfThread,
        res
      );
      return await res.status(200).json({
        success: true,
        commentsOfThreadByCommentId: commentsOfThreadByCommentId,
        message: `Retrieved thread with given date ${formattedDate}`
      });
    }
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

module.exports = {
  getCommentsFromSpecificUser: getCommentsFromSpecificUser,
  getThreadsBySubreddit: getThreadsBySubreddit,
  getCommentsOfThreadByThreadId: getCommentsOfThreadByThreadId,
  getAllUsers: getAllUsers,
  getAllThreads: getAllThreads,
  getThreadByTimestamp: getThreadByTimestamp
};
