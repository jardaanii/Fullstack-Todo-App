//Package imports
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// File imports
const { createTodo, updateTodo, userTodos } = require("../../utils/types");
const { validateUser, validateToken } = require("../../middlewares/index");
const { jwtPassword, SALT } = require("../../config/server-config");
const { Todo, User } = require("../../repository/db");
const { sendMail } = require("../../utils/sendMail");
const router = express.Router();

//function verifies the password
function checkPassword(userInputPlainPassword, encryptedPassword) {
  return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
}

async function sendTodos(user) {
  const todosIds = user.todo.map((x) => x._id);

  const todos = await Promise.all(
    todosIds.map((x) => {
      const todo = Todo.findById(x);

      return todo;
    })
  );

  const Todos = todos.filter((x) => x !== null);

  return Todos;
}

//Sign up Route gives nothing and creates a user in db
router.post("/signup", validateUser, async (req, res) => {
  const parsedPayload = userTodos.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(411).json({
      success: false,
      message: "You sent the wrong credentials",
    });
  }

  const username = req.body.username;
  const plainPassword = req.body.password;

  const userr = await User.findOne({ username: username });
  if (userr) {
    return res.status(403).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(plainPassword, SALT);
  const user = new User({
    username: username,
    password: hashedPassword,
  });
  await user.save();

  sendMail(username);

  return res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});

//Sign in Route gives the user todos and returns a bearer token
router.post("/signin", validateUser, async (req, res) => {
  const parsedPayload = userTodos.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "You sent the wrong credentials",
    });
  }
  const username = req.body.username;
  const plainPassword = req.body.password;
  const user = await User.findOne({
    username: username,
  });

  if (user === null) {
    return res.status(403).json({
      success: false,
      message: "User doesnt exist in our in memory db",
    });
  }
  const hashedPassword = user.password;

  const match = checkPassword(plainPassword, hashedPassword);
  if (!match) {
    return res.status(401).json({
      status: 403,
      success: false,
      message: "Access denied. Incorrect password.",
    });
  }

  const token = jwt.sign({ username: username }, jwtPassword, {
    expiresIn: "2h",
  });

  const todos = await sendTodos(user);

  return res.status(200).json({
    message: "Login successful!",
    token,
    todos: todos,
  });
});

router.post("/todo", validateToken, async (req, res) => {
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

    const user = req.user;
    user.todo.push(todo._id.toString());
    await user.save();

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

router.get("/todos", validateToken, async (req, res) => {
  try {
    const user = req.user;
    const todos = await sendTodos(user);
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

router.put("/completed", validateToken, async (req, res) => {
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
