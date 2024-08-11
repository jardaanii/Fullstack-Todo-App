const mongoose = require("mongoose");
const { mongoURL } = require("../config/server-config");

// Connect to MongoDB
mongoose.connect(mongoURL);

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo", // Changed to match the model name
    },
  ],
});

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema); // Changed to singular "Todo"

module.exports = { Todo, User };
