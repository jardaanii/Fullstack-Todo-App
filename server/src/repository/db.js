const mongoose = require("mongoose");
const { mongoURL } = require("../config/server-config");

// Connect to MongoDB
mongoose.connect(mongoURL);

// Define schemas
const todoSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  description: String,
  completed: Boolean,
});

const todo = mongoose.model("todos", todoSchema);

module.exports = { todo };
