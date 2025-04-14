import express from "express";
import {
  getAllTodos,
  createTodo,
  deleteTodo,
  markDone,
  moveTodo,
} from "../controller/todoController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // ✅ Apply to all routes

router.get("/", getAllTodos);
router.post("/", createTodo);
router.post("/delete", deleteTodo);
router.put("/done", markDone);
router.put("/move", moveTodo);

export default router;


