const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const CastError = require('../errors/cast-err');
const {
  createUser,
  login,
  signOut,
  successfulAuth,
} = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); // Краш тест для ревью

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(50),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(50),
  }),
}), createUser);

router.get('/check-auth', auth, successfulAuth);
router.delete('/signout', auth, signOut);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', (res, req, next) => {
  const castError = new CastError('Данный запрос не найден', 404);
  next(castError);
});

module.exports = router;
