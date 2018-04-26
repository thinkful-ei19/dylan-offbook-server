'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: { type: String },
  monologueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monologue' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

commentSchema.index({ comment: 1, monologueId: 1 }, { unique: true });

commentSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Comment', commentSchema);