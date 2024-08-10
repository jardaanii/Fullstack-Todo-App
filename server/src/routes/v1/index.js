const express = require("express");
const { createTodo, updateTodo } = require("../../utils/types");
const { z } = require("zod");
const { Todo } = require("../../repository/db");
const router = express.Router();

router.post("/todo", async (req, res) => {
  try {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if (!parsedPayload.success) {
      return res.status(411).json({
        message: "You sent the wrong credentials",
      });
    }
    const { title, description } = createPayload;
    const todo = new Todo({
      title,
      description,
      completed: false,
    });
    await todo.save();
    return res.status(200).json({
      todo: {
        _id: todo._id.toString(),
        title: todo.title,
        description: todo.description,
        completed: false,
      },
      message: "Created the todo successfully",
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({
      message: "An error occurred while creating the todo",
    });
  }
});

router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find({});
    return res.status(200).json({
      todos: todos,
      success: true,
      message: "Successfully fetched all the todos",
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({
      message: "An error occurred while fetching todos",
    });
  }
});

router.put("/completed", async (req, res) => {
  try {
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if (!parsedPayload.success) {
      return res.status(411).json({
        message: "You sent the wrong todo id",
      });
    }
    const { id } = updatePayload;
    await Todo.updateOne({ _id: id }, { completed: true });

    return res.status(200).json({
      success: true,
      message: "Successfully marked the todo as completed",
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return res.status(500).json({
      message: "An error occurred while updating the todo",
    });
  }
});

module.exports = router;
