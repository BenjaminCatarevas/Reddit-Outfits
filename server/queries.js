const promise = require("bluebird");
const configInfo = require("./config");

// pg-promise initialization options;
const initOptions = {
  // bluebird promise library instead of default ES6 Promise for optimization.
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

/* Helper functions */
/**
 * This function converts the raw comment data from the database and converts it into a more manageable and expanded format.
 * Specifically, it converts raw database entries (where each entry has a single outfit) into a dictionary with the following format:
 * commentID:commentInformation
 * The commentInformation value is an object containing the information for the comment ID. Notably, it contains an array of every outfit associated with that comment.
 * This is compared to the original format where each entry had a singular outfit.
 * @param {object} data Comment data retrieved from database.
 * @param {object} res Middleware response object.
 */
async function sortCommentsByCommentId(data, res) {
  try {
    // Create a JSON object to organize outfits by their comment ID.
    // We do this because outfits are stored as individual URLs, and are not inherently grouped by a comment.
    let commentsByCommentId = {};
    // Go through each comment of the user and organize the outfits by comment.
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
        // So we construct a new entry in the object based on the comment.
        commentsByCommentId[currentCommentId] = {
          authorName: currentOutfitRecord.author_name,
          outfits: [currentOutfitRecord.outfit_url],
          commentBody: currentOutfitRecord.body,
          commentPermalink: currentOutfitRecord.comment_permalink,
          commentScore: currentOutfitRecord.comment_score,
          commentTimestamp: currentOutfitRecord.comment_timestamp,
          threadId: currentOutfitRecord.thread_id
        };
      }
    }
    // We now convert the object of comments to an array of comments, each comment represented as an object.
    // We do this because having an array of objects is easier to sort, manage, and access than an object for our purposes.
    const commentObjectArray = Object.keys(commentsByCommentId).map(key => {
      const currentComment = commentsByCommentId[key];
      const commentObj = {
        authorName: currentComment.authorName,
        outfits: currentComment.outfits,
        commentBody: currentComment.commentBody,
        commentPermalink: currentComment.commentPermalink,
        commentScore: currentComment.commentScore,
        commentTimestamp: currentComment.commentTimestamp,
        commentId: key,
        threadId: currentComment.threadId
      };
      return commentObj;
    });

    return commentObjectArray;
  } catch (err) {
    res.json({
      success: false,
      error: err.message || err
    });
  }
}

/* Query functions */
/**
 * This function retrieves all comments from a specific user based on the params from the backend endpoint.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
async function getCommentsFromSpecificUser(req, res, next) {
  let authorName = req.params.author_name;

  try {
    // Extract all comment data from specific user.
    const rawSpecificUserComments = await db.any(
      `SELECT * 
      FROM outfit JOIN comment ON outfit.comment_id = comment.comment_id 
      WHERE outfit.author_name = $1`,
      [authorName]
    );

    // Bucket the comments by comment ID.
    const sortedCommentsFromSpecificUser = await sortCommentsByCommentId(
      rawSpecificUserComments,
      res
    );

    return await res.status(200).json({
      success: true,
      commentsFromSpecificUser: sortedCommentsFromSpecificUser,
      message: `Retrieved all outfits of user ${authorName}`
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message || err
    });
  }
}

/**
 * This function retrieves all comments from a specific thread based on the params from the backend endpoint.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
async function getCommentsOfThreadByThreadId(req, res, next) {
  // The subreddit comes in as an int from the React frontend, so convert it from an int to a subreddit.
  let { subredditAsInt } = req.params;
  let intToSubreddit = mapIntToSubreddit[Number(subredditAsInt)];
  let threadId = req.params.threadId;

  try {
    const rawCommentsOfThreadByThreadId = await db.any(
      `SELECT * 
      FROM outfit JOIN comment ON outfit.comment_id = comment.comment_id 
      WHERE outfit.subreddit = $1 AND outfit.thread_id = $2`,
      [intToSubreddit, threadId]
    );

    // Bucket the comments/outfits by comment ID.
    const sortedCommentsOfThreadByThreadId = await sortCommentsByCommentId(
      rawCommentsOfThreadByThreadId,
      res
    );

    return await res.status(200).json({
      success: true,
      commentsOfThreadByThreadId: sortedCommentsOfThreadByThreadId,
      message: `Retrieved all outfits from thread ${threadId} of subreddit ${intToSubreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.messgae || err
    });
  }
}

/**
 * This function retrieves all threads from a specific subreddit based on the params from the backend endpoint.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
async function getThreadsBySubreddit(req, res, next) {
  // The subreddit comes in as an int from the React frontend, so convert it from an int to a subreddit.
  let { subredditAsInt } = req.params;
  let intToSubreddit = mapIntToSubreddit[Number(subredditAsInt)];

  try {
    const subredditThreads = await db.any(
      `SELECT * 
      FROM thread 
      WHERE subreddit = $1`,
      [intToSubreddit]
    );

    return await res.status(200).json({
      success: true,
      subredditThreads: subredditThreads,
      message: `Retrieved all threads from ${intToSubreddit}`
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

/**
 * This function retrieves all users.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
async function getAllUsers(req, res, next) {
  try {
    const allUsers = await db.any("SELECT * FROM author");

    return await res.status(200).json({
      success: true,
      allUsers: allUsers,
      message: "Retrieved all users."
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

/**
 * This function retrieves all threads.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
async function getAllThreads(req, res, next) {
  try {
    const allThreads = await db.any("SELECT * FROM thread");

    return await res.status(200).json({
      success: true,
      allThreads: allThreads,
      message: "Retrieved all threads."
    });
  } catch (err) {
    return await res.json({
      success: false,
      error: err.message || err
    });
  }
}

/**
 * This function retrieves all threads on a specific timestamp/date based on the params from the backend endpoint.
 * Argument explanations adapted from: https://expressjs.com/en/guide/writing-middleware.html
 * @param {object} req HTTP request argument to the middleware function.
 * @param {object} res HTTP response argument to the middleware function.
 * @param {object} next Callback argument to the middleware function.
 */
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

    // Retrieve thread for specified timestamp +/- one day to be within the range.
    // Query adapted from: https://stackoverflow.com/a/18270068 and https://stackoverflow.com/a/16610459
    const threadSpecifiedByTimestamp = await db.any(
      `SELECT * 
      FROM thread 
      WHERE subreddit = $1
      AND TO_TIMESTAMP(thread_timestamp)::date >= TO_TIMESTAMP($2)
      AND TO_TIMESTAMP(thread_timestamp)::date < TO_TIMESTAMP($2) + INTERVAL '1 DAY'`,
      [intToSubreddit, specifiedTimestamp]
    );

    // We want to stop if the query yielded 0 results (and avoid sorting effectively nothing).
    if (threadSpecifiedByTimestamp.length === 0) {
      return await res.status(200).json({
        success: true,
        specifiedThreadByTimestamp: [],
        message: `No data retrieved with given date ${formattedDate}`
      });
    } else {
      // We have the thread ID of the thread with the specified date.
      // So now we want to get the outfits from that thread, organize them, and return them.
      const rawOutfitsOfThreadByTimestamp = await db.any(
        `SELECT * 
        FROM outfit JOIN comment ON outfit.comment_id = comment.comment_id 
        WHERE outfit.thread_id = $1`,
        [threadSpecifiedByTimestamp[0].thread_id]
      );

      // Bucket the comments by comment ID.
      const sortedOutfitsOfThreadByTimestamp = await sortCommentsByCommentId(
        rawOutfitsOfThreadByTimestamp,
        res
      );

      return await res.status(200).json({
        success: true,
        commentsOfThreadByTimestamp: sortedOutfitsOfThreadByTimestamp,
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

async function getCommentsFromSearchTerm(req, res, next) {
  try {
    let { searchTerm } = req.params;

    /**
     * NOTE: To prevent SQL injections, we invoke the pgp helper function pgp.as.value() to dispose of any malicious preceding or trailing quotation marks.
     * For more information, see the following:
     * https://github.com/vitaly-t/pg-promise#open-values
     * https://vitaly-t.github.io/pg-promise/formatting.html#.value
     * https://vitaly-t.github.io/pg-promise/formatting.js.html#line540
     */
    const rawCommentsFromSearchTerm = await db.any(
      `SELECT * 
      FROM comment JOIN outfit ON comment.comment_id = outfit.comment_id
      WHERE comment.body LIKE '%$1:value%'`,
      [pgp.as.value(searchTerm)]
    );

    // Bucket the comments by comment ID.
    const sortedCommentsFromSearchTerm = await sortCommentsByCommentId(
      rawCommentsFromSearchTerm,
      res
    );

    return await res.status(200).json({
      success: true,
      commentsFromSearchTerm: sortedCommentsFromSearchTerm,
      message: `Retrieved thread with search term ${searchTerm}`
    });
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
  getThreadByTimestamp: getThreadByTimestamp,
  getCommentsFromSearchTerm: getCommentsFromSearchTerm
};
