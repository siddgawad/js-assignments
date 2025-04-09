const express = require("express");
const {
  getAllTodos,
  createTodo,
  deleteTodo,
  markDone,
  moveTodo,
} = require("../controller/todoController");

const router = express.Router();

router.get("/", getAllTodos);
router.post("/", createTodo);
router.post("/delete", deleteTodo);
router.put("/done", markDone);
router.put("/move", moveTodo);

module.exports = router;

