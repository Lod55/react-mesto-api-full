const { Schema, model } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const CastError = require('../errors/cast-err');

const userSchema = new Schema({
  name: {
    type: String,
    minLength: [2, 'Минимальное кол-во символов 2'],
    maxLength: [30, 'Максимальное кол-во символов 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: [2, 'Минимальное кол-во символов 2'],
    maxLength: [30, 'Максимальное кол-во символов 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v),
      message: 'Неправильный формат Url',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, 'Минимальное кол-во символов 6'],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new CastError('Неправильные почта или пароль', 401);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new CastError('Неправильные почта или пароль', 401);
          }

          return user;
        });
    });
};

module.exports = model('user', userSchema);
