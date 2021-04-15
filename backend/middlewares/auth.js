const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const CastError = require('../errors/cast-err');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new CastError('Необходимо авторизоваться', 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const castError = new CastError('Авторизация не пройдена', 401);
    next(castError);
  }

  req.user = payload;
  next();
};

module.exports = { auth };
