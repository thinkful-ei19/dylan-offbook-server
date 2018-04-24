'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Monologue = require('../models/monologue');

const seedMonologues = require('../db/seed/monologues');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Monologue.insertMany(seedMonologues)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err.message);
    console.log(err);
  });