const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const CastError = require('../errors/cast-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new CastError('Необходимо авторизоваться', 401);
  }

  const token = extractBearerToken(authorization);
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
