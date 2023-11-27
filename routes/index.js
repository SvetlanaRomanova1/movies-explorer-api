const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser, signout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const routesUsers = require('./users');
const routesMoves = require('./movies');
const { authValidate, registerValidate } = require('../middlewares/validation');

// Обработчики для регистрации и входа (аутентификации)
router.post('/signin', authValidate, login);

// Обработчики для создания пользователя
router.post('/signup', registerValidate, createUser);

router.post('/signout', signout);

router.use(auth);

// Использование роутов пользователей
router.use('/users', routesUsers);
// Использование роутов фильмов
router.use('/movies', routesMoves);

router.use('*', (req, _, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс не найден, проверьте адрес: ${req.baseUrl}`));
});

module.exports = router;
