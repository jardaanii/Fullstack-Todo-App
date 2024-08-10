const express = require("express");
const { createTodo, updateTodo } = require("../../utils/types");
const { Todo } = require("../../repository/db");

const router = express.Router();

router.post("/todo", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeparse(createPayload);

  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "You sent the wrong creadentials",
    });
  }

  const title = createPayload.title;
  const description = createPayload.description;

  const todo = new Todo({
    title: title,
    description: description,
    completed: false,
  });
  await todo.save();

  return res.status(200).json({
    message: "Created the todo successfully",
  });
});

router.get("/todos", async (req, res) => {
  const todos = await Todo.find({});

  return res.status(200).json({
    data: todos,
    success: true,
    message: "Succesfully fetched all the todos",
  });
});

router.put("/completed", async (req, res) => {
  const updatePayload = req.body;
  const parsedPayload = updateTodo.safeparse(updatePayload);
  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "You sent the wrong todo id",
    });
  }

  const id = updatePayload.id;

  await Todo.update(
    {
      _id: updatePayload.id,
    },
    {
      completed: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Succesfully marked the todo completed",
  });
});

module.exports = router;
