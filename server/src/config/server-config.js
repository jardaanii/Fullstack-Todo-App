const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  mongoURL: process.env.mongoURL,
  jwtPassword: process.env.jwtPassword,
  SALT: bcrypt.genSaltSync(10),
};
