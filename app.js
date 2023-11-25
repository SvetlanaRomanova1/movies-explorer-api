require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const {createUser, signout} = require("./controllers/users");
const {login} = require("./controllers/users");
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/bitfilmsdb';

// Подключение к MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(cookieParser());
// Использование роутов пользователей
app.use('/users', auth, require('./routes/users'));
// Использование роутов фильмов
app.use('/movies', auth, require('./routes/movies'));

// Подключение логгер запросов
app.use(requestLogger);

// Обработчики для регистрации и входа (аутентификации)
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  login
);

// Обработчики для создания пользователя
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ tlds: { allow: false } }),
      name: Joi.string().min(2).max(30),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.post('/signout', signout);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

