let express = require('express');
let router = express.Router();
let db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Reddit Outfits' });
  res.sendFile('../../src/App.js');
});

router.get('/u/:author_name', db.getCommentsByAuthor);
router.get('/r/:subreddit', db.getThreadsBySubreddit);
router.get('/r/:subreddit/:threadId', db.getOutfitsOfThreadByThreadId);
router.get('/users', db.getAllAuthors);
router.get('/threads', db.getAllThreads);

module.exports = router;