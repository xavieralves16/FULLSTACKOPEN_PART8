const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  author: {
    type: String,
    required: true,
    minlength: 1
  },
  published: {
    type: Number,
  },
});

module.exports = mongoose.model('Book', bookSchema);