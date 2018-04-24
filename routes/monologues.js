'use strict';

const express = require('express');
const router = express.Router();

const Monologue = require('../models/monologue');

router.get('/monologues', (req, res, next) => {

  Monologue.find({})
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });

});

router.post('/monologues', (req, res, next) => {

  const { title, text, playwright } = req.body;
  const newMonologue = { title, text, playwright };

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  Monologue.create(newMonologue)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;