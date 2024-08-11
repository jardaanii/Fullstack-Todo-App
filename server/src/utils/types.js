const { z } = require("zod");

const userTodos = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

const createTodo = z.object({
  title: z.string(),
  description: z.string(),
});

const updateTodo = z.object({
  id: z.string(),
});

module.exports = {
  createTodo,
  updateTodo,
  userTodos,
};
