const cardsRouter = require("express").Router();

const {
  getCards,
  postCard,
  deleteCard,
  addLike,
  removeLike,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post("/", postCard);
cardsRouter.delete("/:cardId", deleteCard);
cardsRouter.put("/:cardId/likes", addLike);
cardsRouter.delete("/:cardId/likes", removeLike);

module.exports = cardsRouter;
