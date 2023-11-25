const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// Контроллер для получения всех сохранённых текущим пользователем фильмов
const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// Контроллер для создания фильма
const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    res.status(201).json(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// Контроллер для удаления сохранённого фильма по id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    // eslint-disable-next-line no-console
    console.log({ movie, movieId: req.params.movieId });
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав для удаления фильма');
    }
    await Movie.deleteOne(movie);
    res.status(200).json({ message: 'Фильм успешно удалён' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMovies, createMovie, deleteMovie };
