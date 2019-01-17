let express = require('express');
let router = express.Router();
let db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Reddit Outfits' });
});

router.get('/user/:author_name', db.getUserOutfits);

module.exports = router;