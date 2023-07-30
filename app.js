const express = require('express');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const cookies = require('cookies');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const regex = require('./utils/url-regexp');
const NotFoundError = require('./errors/NotFoundError');
const rootRouter = require('./routes/index');
const { login, createUserInfo } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
// app.use(cookies());
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.use(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regex),
    }),
  }),
  createUserInfo,
);
app.use(auth);

app.use('/', rootRouter);

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));
// eslint-disable-next-line no-unused-vars
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
