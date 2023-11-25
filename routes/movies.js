const express = require('express');

const router = express.Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// Роут для получения всех сохранённых текущим пользователем фильмов
router.get('/', getMovies);

// Роут для создания фильма
router.post('/', createMovie);

// Роут для удаления сохранённого фильма по id
router.delete('/:movieId', deleteMovie);

module.exports = router;
