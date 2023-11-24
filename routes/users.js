const express = require('express');
const { getUserInfo, updateUser } = require('../controllers/users');

const router = express.Router();

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUserInfo);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', updateUser);


module.exports = router;
