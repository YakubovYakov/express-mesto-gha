const express = require('express');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { PORT = 3000 } = process.env;
const helmet = require('helmet');

const CAST_ERROR_CODE = 404;

const app = express();
app.use(express.json());
app.use(helmet());

app.use('/', (req, res, next) => {
  req.user = {
    _id: '64b040658a0d70ec5536769a',
  };
  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
});
// eslint-disable-next-line no-unused-vars
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
