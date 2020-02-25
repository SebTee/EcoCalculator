const express = require('express');
const router = express.Router();
const account = require('../account');

/* GET users listing. */
router.post('/account/create', (req, res, next) => {
  account.create(req, res);
});

router.post('/account/login', (req, res, next) => {
  account.login(req, res);
});

module.exports = router;
