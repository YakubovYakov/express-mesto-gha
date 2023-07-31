const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo,
  getUserInfoId,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');
const regex = require('../utils/url-regexp');
// возвращает информацию о текущем пользователе
router.get('/me', getUser);
// Пользователи
router.get('/', getUserInfo);

// Пользователь по ID
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserInfoId,
);
// Обновление профиля
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);
// Обновляет аватар
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(regex),
    }),
  }),
  updateAvatar,
);

module.exports = router;
