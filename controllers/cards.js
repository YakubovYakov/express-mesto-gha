/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const InternalServerError = require('../errors/InternalServerError');

const BAD_REQUEST_ERROR = 400;
const CAST_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => res.status(InternalServerError).send({ message: 'Произошла ошибка' }));
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Неправильный запрос' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((data) => {
      if (data) {
        res.send({ message: 'Карточка удалена' });
      } else {
        res
          .status(CAST_ERROR_CODE)
          .send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Неправильный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(CAST_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Неправильный id карточки' });
      } else {
        res.status(InternalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(CAST_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Неправильный id карточки' });
      } else {
        res.status(InternalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  removeLike,
};
