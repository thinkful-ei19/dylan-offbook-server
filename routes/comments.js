'use strict';

const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const Monologue = require('../models/monologue');

router.get('/', (req, res, next) => {
  Comment.find({})
    .sort('comment')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.post('/:monologueId', (req, res, next) => {
  Comment.create({
    comment: req.body.comment,
    monologueId: req.params.monologueId
  })
    .then(comment => {
      return Monologue.findByIdAndUpdate(req.params.monologueId, {
        $addToSet: { comments: comment._id }
      });
    })
    .then(monologue => {
      res.status(201).json(monologue);
    })
    .catch(err => next(err));
});

module.exports = router;