const express = require('express');
const router = express.Router();
const account = require('../account');
const question = require('../question');
const result = require('../result');
const event = require('../event');

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

router.get('/result', (req, res, next) => {
  result.getResult(req, res);
});

router.post('/event', (req, res, next) => {
  event.addEvent(req, res);
});

router.get('/event', (req, res, next) => {
  event.getEvents(req, res);
});

module.exports = router;
