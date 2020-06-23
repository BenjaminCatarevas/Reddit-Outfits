let express = require("express");
let router = express.Router();
let db = require("../queries");

/* GET home page. */
router.get("/", function(req, res, next) {
  //res.render('index', { title: 'Reddit Outfits' });
  res.sendFile("../../src/App.js");
});

router.get("/u/:author_name", db.getCommentsFromSpecificUser);
router.get("/r/:subredditAsInt", db.getThreadsBySubreddit);
router.get("/r/:subredditAsInt/:threadId", db.getCommentsOfThreadByThreadId);
router.get("/users", db.getAllUsers);
router.get("/threads", db.getAllThreads);
router.get("/r/:subredditAsInt/:year/:month/:day", db.getThreadByTimestamp);
router.get("/comments/:searchTerm", db.getCommentsFromSearchTerm);

module.exports = router;
