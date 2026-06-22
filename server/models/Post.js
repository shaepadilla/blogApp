const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
