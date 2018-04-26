'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Monologue = require('../models/monologue');
const Comment = require('../models/comment');
const User = require('../models/user');

const seedMonologues = require('../db/seed/monologues');
const seedComments = require('../db/seed/comments');
const seedUsers = require('../db/seed/users');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Monologue.insertMany(seedMonologues),
      Comment.insertMany(seedComments),
      Comment.createIndexes(),
      User.insertMany(seedUsers),
      User.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err.message);
    console.log(err);
  });