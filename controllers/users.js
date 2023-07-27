// eslint-disable-next-line no-unused-vars
const validationError = require('mongoose').Error.ValidationError;
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
// const { generateToken } = require('../utils/token');

const { JWT_SECRET = 'secret-key' } = process.env;

const getUserInfo = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

const getUserInfoId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('CastError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      if (err.message === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(err);
      }
    });
};

const createUserInfo = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          const returnUser = user.toObject();
          delete returnUser.password;
          res.send({ data: returnUser });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные при создании профиля'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else next(err);
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Unauthorized('Неверный email или пароль');
    }
    const isSameUser = await bcrypt.compare(password, user.password);
    if (!isSameUser) {
      throw new Unauthorized('Неверный email или пароль');
    }
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    // const payload = { _id: user._id };
    // // const token = (payload);
    // res.cookie('jwt', token);
    // console.log('1', token);
    return res.cookie('jwt', token);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new Unauthorized('Неверный email или пароль'));
    }
    next(err);
  }
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  getUserInfo,
  getUserInfoId,
  createUserInfo,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
