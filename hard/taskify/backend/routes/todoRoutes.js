import express from "express";
import { body, validationResult } from "express-validator";

import {
  getAllTodos,
  createTodo,
  deleteTodo,
  markDone,
  moveTodo,
} from "../controller/todoController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware); // ✅ All routes are protected

// ✅ Middleware to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// ✅ GET todos (no validation needed for GET)
router.get("/", getAllTodos);

// ✅ Create todo
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required").trim(),
    body("priority").isIn(["low", "medium", "urgent"]).withMessage("Invalid priority"),
    body("column").isIn(["To Do", "In Progress", "Under Review", "Finished"]).withMessage("Invalid column"),
    handleValidation,
  ],
  createTodo
);

// ✅ Delete todo
router.post("/delete", [body("id").notEmpty().withMessage("ID is required"), handleValidation], deleteTodo);

// ✅ Mark done
router.put("/done", [body("id").notEmpty().withMessage("ID is required"), handleValidation], markDone);

// ✅ Move todo
router.put(
  "/move",
  [
    body("id").notEmpty().withMessage("ID is required"),
    body("column").isIn(["To Do", "In Progress", "Under Review", "Finished"]).withMessage("Invalid column"),
    handleValidation,
  ],
  moveTodo
);

export default router;
