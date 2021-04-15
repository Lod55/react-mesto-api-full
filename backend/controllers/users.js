const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CastError = require('../errors/cast-err');

const getUsers = (req, res, next) => {
  User.find({}, { __v: 0 })
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((user) => {
      if (!user) {
        throw new CastError('Вы не авторизованы', 401);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (userId.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  User.findById(userId, { __v: 0 })
    .then((user) => {
      if (!user) {
        throw new CastError('Пользователь по указанному _id не найден.', 404);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const data = { ...req.body };

  if (!data.email || !data.password) {
    throw new CastError('Переданы некорректные данные при создании юзера.', 400);
  }

  bcrypt.hash(data.password, 10)
    .then((hash) => User.create({ ...data, password: hash }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const massage = `${Object.values(err.errors).map((el) => el.message).join(', ')}`;
        const errorСustom = new CastError(massage, 400);
        next(errorСustom);
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        const errorСustom = new CastError('Данный Email уже зарегистрирован', 409);
        next(errorСustom);
      }
      if (err.code === 500) {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const data = { ...req.body };
  if (!data.name || !data.about) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  if (req.user._id.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new CastError('Пользователь по указанному _id не найден.', 404);
      }
      res.status(201).send({
        name: user.name,
        about: user.about,
      });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const data = { ...req.body };

  if (!data.avatar) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  if (req.user._id.length !== 24) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new CastError('Пользователь по указанному _id не найден.', 404);
      }
      res.status(201).send({
        avatar: user.avatar,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const data = { ...req.body };

  if (!data.email || !data.password) {
    throw new CastError('Переданы некорректные данные.', 400);
  }

  return User.findUserByCredentials(data.email, data.password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie(
        'jwt',
        token,
        { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true },
      )
        .send({ massege: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
