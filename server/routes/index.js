let express = require("express");
let router = express.Router();
let db = require("../queries");

/* GET home page. */
router.get("/", function(req, res, next) {
  //res.render('index', { title: 'Reddit Outfits' });
  res.sendFile("../../src/App.js");
});

router.get("/u/:author_name", db.getCommentsFromSpecificUser);
router.get("/r/:subreddit", db.getThreadsBySubreddit);
router.get("/r/:subreddit/:threadId", db.getCommentsOfThreadByThreadId);
router.get("/users", db.getAllUsers);
router.get("/threads", db.getAllThreads);
router.get("/r/:subreddit/:year/:month/:day", db.getThreadByTimestamp);

module.exports = router;
