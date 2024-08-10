const express = require("express");
const { createTodo, updateTodo } = require("../../utils/types");
const router = express.Router();

/** / This route would let the user to create a todo and add it to db/
 we expect 
 body{
   title :string,
   dec:string,
   completed:bool
    }
**/
router.post("/todo", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeparse(createPayload);

  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "You sent the wrong creadentials",
    });
  }
});
router.get("/todos", async (req, res) => {});

router.put("/completed", async (req, res) => {
  const updatePayload = req.body;
  const parsedPayload = updateTodo.safeparse(updatePayload);
  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "You sent the wrong todo id",
    });
  }
});

module.exports = router;
