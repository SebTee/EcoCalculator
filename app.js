const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({'secret': 'w&W!wJ$ME@YgKg^3TF#HpTmNBOwU3M8XbFivkC*HuKrMZsjbUnT#YsiVKXG6ugjr'}));

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

module.exports = app;
