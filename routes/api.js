const express = require('express');
const router = express.Router();
const account = require('../account');

/* GET users listing. */
router.post('/account/create', (req, res, next) => {
  account.create(req, res);
});

module.exports = router;
