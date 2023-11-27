const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorisationError = require('../errors/unauthorized-error');
const { JWT_SECRET } = require('../utils/config');
const Conflict = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');

// Контроллер для получения пользователей
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    next(error);
  }
};

// Контроллер для обновления информации о пользователе
const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    // Обновление пользователя
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.status(200).json({ email: updatedUser.email, name: updatedUser.name });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
    } else if (error.code === 11000) {
      next(new Conflict('Такой пользователь уже существует!'));
    } else {
      next(error);
    }
  }
};

// Контроллер для создания пользователей
const createUser = async (req, res, next) => {
  try {
    const {
      email,
      name,
      password,
    } = req.body;

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя в базе данных
    const user = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ _id: user._id, email: user.email, name: user.name });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
    } else if (error.code === 11000) {
      next(new Conflict('Такой пользователь уже существует!'));
    } else {
      next(error);
    }
  }
};

// Контроллер для аутентификации пользователя и выдачи JWT-токена
const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Переменная время хранения токена
    const TOKEN_EXPIRATION = '7d';

    // Проверяем, существует ли пользователь с таким email в базе данных
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthorisationError('Аутентификация не удалась. Пользователь не найден.');
    }

    // Проверяем, соответствует ли введенный пароль хешу пароля в базе данных
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthorisationError('Аутентификация не удалась. Неверный пароль.');
    }

    // Генерируем JWT-токен
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    res.cookie('jwt', token, { httpOnly: true });

    res.status(200).json({ message: 'Аутентификация успешна.', token });
  } catch (error) {
    next(error);
  }
};

// Контроллер для выхода пользователя и удаления JWT из куков
const signout = async (req, res) => {
  // Устанавливаем куку с истекшим сроком жизни
  res.cookie('jwt', '', { expires: new Date(0) });
  res.status(200).json({ message: 'Пользователь успешно вышел из аккаунта' });
};

module.exports = {
  getUserInfo, updateUser, createUser, login, signout,
};
