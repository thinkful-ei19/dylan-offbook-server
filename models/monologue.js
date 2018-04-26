'use strict';

const mongoose = require('mongoose');

const monologueSchema = new mongoose.Schema({
  title: { type: String },
  playwright: { type: String },
  text: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  created: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: true },
  areCommentsHidden: { type: Boolean, default: true },
  isAddCommentHidden: { type: Boolean, default: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

monologueSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Monologue', monologueSchema);