const mongoose = require('mongoose');

const urlRegex = /^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return urlRegex.test(value);
      },
      message: 'Invalid image URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return urlRegex.test(value);
      },
      message: 'Invalid trailerLink URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return urlRegex.test(value);
      },
      message: 'Invalid thumbnail URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
