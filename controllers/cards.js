const Card = require('../models/card');
// const BadRequestError = require('../errors/BadRequestError'); // 400
// const AuthError = require('../errors/AuthError');
// const ConflictError = require('../errors/BadRequestError');
// const ForbiddenError = require('../errors/ForbiddenError');
// const NotFoundError = require('../errors/NotFoundError'); // 404
const InternalServerError = require('../errors/InternalServerError');
// 500
const BAD_REQUEST_ERROR = 400;
const CAST_ERROR_CODE = 404;

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
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(InternalServerError).send({
      message: 'Internal server error',
    }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((data) => {
      if (data) {
        res.send({ message: 'Карточка удалена' });
      } else {
        res.status(CAST_ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'castError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Неправильный id карточки' });
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
      if (err.name === 'castError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Неправильный id карточки' });
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
      if (err.name === 'castError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Неправильный id карточки' });
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
