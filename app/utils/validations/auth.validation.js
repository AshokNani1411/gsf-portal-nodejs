const {
  Joi
} = require("express-validation");

module.exports = {
  loginRequest: {
    body: Joi.object({
      id: Joi.string().required(),
      password: Joi.string().required().min(8).max(128)
    }),
  }
};