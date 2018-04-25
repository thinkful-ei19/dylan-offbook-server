'use strict';

const express = require('express');
const router = express.Router();

const Monologue = require('../models/monologue');

router.get('/', (req, res, next) => {
  Monologue.find({})
    .populate('comments')
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Monologue.findById({ _id: id })
    .populate('comments')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

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

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, text, playwright, comments } = req.body;
  let updatedMonologue = {};

  if (title) updatedMonologue.title = title;
  if (text) updatedMonologue.text = text;
  if (playwright) updatedMonologue.playwright = playwright;
  if (comments) updatedMonologue.comments = comments;

  // const updatedMonologue = { title, text, playwright, comments };

  Monologue.findByIdAndUpdate(id, { $set: updatedMonologue }, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;