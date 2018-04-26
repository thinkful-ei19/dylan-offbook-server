'use strict';

const express = require('express');
const router = express.Router();

const Monologue = require('../models/monologue');

router.get('/', (req, res, next) => {

  const userId = req.user.id;

  Monologue.find({ userId })
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
  const userId = req.user.id;

  Monologue.findById({ _id: id, userId })
    .populate('comments')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

  const { title, text, playwright } = req.body;
  const userId = req.user.id;
  const newMonologue = { title, text, playwright, userId };

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
  const userId = req.user.id;
  const { title, text, playwright, comments } = req.body;
  let updatedMonologue = { userId };

  if (title) updatedMonologue.title = title;
  if (text) updatedMonologue.text = text;
  if (playwright) updatedMonologue.playwright = playwright;
  if (comments) updatedMonologue.comments = comments;

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