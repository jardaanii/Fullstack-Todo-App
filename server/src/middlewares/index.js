const jwt = require("jsonwebtoken");
const { jwtPassword } = require("../config/server-config");
const { User } = require("../repository/db");

const validateUser = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Something went wrong",
      err: "Email or password not present",
    });
  }

  next();
};

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required." });
  }

  try {
    const response = jwt.verify(token, jwtPassword);

    const user = await User.findOne({ username: response.username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Token is not valid ",
      err: "The users token is not valid",
    });
  }
};

module.exports = {
  validateUser,
  validateToken,
};
