// const mongoose = require('mogoose');
const User = require('../models/user');
// const AuthError = require('../errors/AuthError');
// const ConflictError = require('../errors/BadRequestError');
// const ForbiddenError = require('../errors/ForbiddenError');
// const NotFoundError = require('../errors/NotFoundError'); // 404
const InternalServerError = require('../errors/InternalServerError');
// 500
const BAD_REQUEST_ERROR = 400;
const CAST_ERROR_CODE = 404;

const getUserInfo = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(InternalServerError).send({ message: 'Произошла ошибка' }));
};

const getUserInfoId = (req, res) => {
  User.findById(req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_CODE)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res
          .status(InternalServerError)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res
          .status(CAST_ERROR_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Некорректные данные при обновлении профиля' });
      } else {
        res.status(InternalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res
          .status(CAST_ERROR_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Некорректные данные при обновлении профиля' });
      } else {
        res.status(InternalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUserInfo,
  getUserInfoId,
  createUserInfo,
  updateUser,
  updateAvatar,
};
