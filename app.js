const express = require('express');
const mongoose = require('mongoose');
// const NotFoundError = require('./errors/NotFoundError');
const CAST_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
  req.user = {
    _id: '64a95bc690e3e95e1be3c681',
  };
  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
