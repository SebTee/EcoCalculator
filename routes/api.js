const express = require('express');
const account = require('../account');
const question = require('../question');
const result = require('../result');
const event = require('../event');

/**
 * Routes for the API
 * @type {Router}
 */
const apiRouter = express.Router();

apiRouter.post('/account/create', (req, res, next) => {
  account.create(req, res);
});

apiRouter.post('/account/login', (req, res, next) => {
  account.login(req, res);
});

apiRouter.get('/question', (req, res, next) => {
  question.get(req, res);
});

apiRouter.post('/question', (req, res, next) => {
  result.submit(req, res);
});

apiRouter.get('/result', (req, res, next) => {
  result.getResult(req, res);
});

apiRouter.post('/event', (req, res, next) => {
  event.addEvent(req, res);
});

apiRouter.get('/event', (req, res, next) => {
  event.getEvents(req, res);
});

apiRouter.delete('/event', (req, res, next) => {
  event.deleteEvent(req, res);
});

module.exports = apiRouter;
