const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidationHandler = (value, helpers) => {
  if (validator.isURL(value)) return value;
  return helpers.message('Некорректный формат ссылки.');
};

/* POST /signin */
const authValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

/* POST /signup */
const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

/* PATCH /users/me */
const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

/* POST /movies */
const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidationHandler),
    trailerLink: Joi.string().required().custom(urlValidationHandler),
    thumbnail: Joi.string().required().custom(urlValidationHandler),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

/* DELETE /movies/:movieId */
const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  userValidate,
  movieValidate,
  movieIdValidate,
  authValidate,
  registerValidate,
};
