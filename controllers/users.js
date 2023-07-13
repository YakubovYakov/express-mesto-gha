/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-shadow */
// const validationError = require('mongoose').Error;
const User = require('../models/user');

const INTERNAL_SERVER_ERROR = 500;

const BAD_REQUEST_ERROR = 400;
const CAST_ERROR_CODE = 404;

const getUserInfo = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUserInfoId = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      if (err.message === 'NotValidId') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный id' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
