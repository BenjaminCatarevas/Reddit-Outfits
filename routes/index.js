let express = require('express');
let router = express.Router();
let db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Reddit Outfits' });
});

router.get('/u/:author_name', db.getOutfitsByUser);
router.get('/r/:subreddit', db.getThreadsBySubreddit);
router.get('/r/:subreddit/:threadId', db.getOutfitsByThreadId);
//router.get('/r/:subreddit/datePosted', db.getOutfitsByDatePosted);

module.exports = router;