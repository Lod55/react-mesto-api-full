const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/),
  }),
}), updateAvatar);

module.exports = router;
