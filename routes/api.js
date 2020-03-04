const express = require('express');
const router = express.Router();
const account = require('../account');
const question = require('../question');
const result = require('../result');

/* GET users listing. */
router.post('/account/create', (req, res, next) => {
  account.create(req, res);
});

router.post('/account/login', (req, res, next) => {
  account.login(req, res);
});

router.get('/question', (req, res, next) => {
  question.get(req, res);
});

router.post('/question', (req, res, next) => {
  result.submit(req, res);
});

module.exports = router;
