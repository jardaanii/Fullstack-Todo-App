const { z } = require("zod");

const createTodo = z.object({
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
});

const updateTodo = zod.object({
  id: z.string(),
});

module.exports = {
  createTodo: createTodo,
  updateTodo: updateTodo,
};
