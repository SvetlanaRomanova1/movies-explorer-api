require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGODB_URI } = require('./utils/config');
const { centralizedErrorHandler } = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(routes);

// Подключение логгер запросов
app.use(requestLogger);

/* eslint-disable-next-line no-unused-vars */
app.use((req, res, next) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
