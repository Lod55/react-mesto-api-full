const Card = require('../models/card');
const CastError = require('../errors/cast-err');

const getCars = (req, res, next) => {
  Card.find({}, { __v: 0, createdAt: 0 })
    .populate('likes', { __v: 0 })
    .populate('owner', { __v: 0 })
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const data = { ...req.body };

  if (!data.link || !data.name) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  Card.create({ ...data, owner: req.user._id })
    .then((card) => res.status(201).send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    }))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  if (cardId.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new CastError('Карточка с указанным _id не найдена.', 404);
      }

      if (req.user._id !== String(card.owner._id)) {
        throw new CastError('Карточку другого пользователя удалить нельзя!', 400);
      }

      Card.deleteOne(card)
        .then(res.send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (cardId.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, select: { __v: 0, createdAt: 0 } },
  )
    .populate('owner', { __v: 0 })
    .populate('likes', { __v: 0 })
    .then((card) => {
      if (!card) {
        throw new CastError('Карточка с указанным _id не найдена.', 404);
      }
      res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (cardId.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, select: { __v: 0, createdAt: 0 } },
  )
    .populate('owner', { __v: 0 })
    .populate('likes', { __v: 0 })
    .then((card) => {
      if (!card) {
        throw new CastError('Карточка с указанным _id не найдена.', 404);
      }
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCars,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
