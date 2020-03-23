const express = require('express');

/**
 * Route to the index page
 * @type {Router}
 */
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
