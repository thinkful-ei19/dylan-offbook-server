'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const monologuesRouter = require('./routes/monologues');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const bodyParser = require('body-parser');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(bodyParser.json());

app.use('/api/users', usersRouter);
app.use('/api', authRouter);

app.use(passport.authenticate('jwt', { session: false, failsWithError: true }));

app.use('/api/monologues', monologuesRouter);
app.use('/api/comments', commentsRouter);


app.use(function (req, res, next) {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
