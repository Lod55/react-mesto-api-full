const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
