const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
  name: {
    type: String,
    minLength: [2, 'Минимальное кол-во символов 2'],
    maxLength: [30, 'Максимальное кол-во символов 30'],
    required: [true, 'Поле name обязательно для заполнения'],
  },
  link: {
    type: String,
    required: [true, 'Поле link обязательно для заполнения'],
    validate: {
      validator: (v) => /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/.test(v),
      message: 'Неправильный формат Url',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Обязательное поле'],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('card', cardSchema);
