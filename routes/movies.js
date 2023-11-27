const express = require('express');

const router = express.Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { movieIdValidate, movieValidate } = require('../middlewares/validation');

// Роут для получения всех сохранённых текущим пользователем фильмов
router.get('/', getMovies);

// Роут для создания фильма
router.post('/', movieValidate, createMovie);

// Роут для удаления сохранённого фильма по id
router.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = router;
