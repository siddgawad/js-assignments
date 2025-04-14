import Todo from "../models/Todo.js";
import { getIO } from "../server/server.js";
import { validationResult } from "express-validator";

// ✅ GET all todos for logged-in user
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ todos });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({
      message: "Failed to fetch todos",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// ✅ CREATE new todo with validation check
const createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  try {
    const { title, priority, column } = req.body;

    const newTodo = await Todo.create({
      title,
      priority,
      column,
      userId: req.user.id
    });

    getIO().emit("todoCreated", newTodo);

    return res.status(201).json({ message: "Todo created", todo: newTodo });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({
      message: "Failed to create todo",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// ✅ DELETE todo by ID (only if it belongs to user)
const deleteTodo = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this todo" });
    }

    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({
      message: "Failed to delete todo",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// ✅ MARK todo as done
const markDone = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to mark this todo" });
    }

    if (todo.status === true) {
      return res.status(200).json({ message: "Todo already marked as done" });
    }

    todo.status = true;
    await todo.save();

    res.status(200).json({ message: "Todo marked as done", todo });
  } catch (err) {
    console.error("Error marking todo as done:", err);
    res.status(500).json({
      message: "Failed to mark todo as done",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// ✅ MOVE todo to another column
const moveTodo = async (req, res) => {
  const { id, column } = req.body;
  if (!id || !column) {
    return res.status(400).json({ message: "ID and column are required" });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to move this todo" });
    }

    todo.column = column;
    await todo.save();

    res.status(200).json({ message: "Column updated", todo });
  } catch (err) {
    console.error("Error moving todo:", err);
    res.status(500).json({
      message: "Failed to move todo",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

export {
  getAllTodos,
  createTodo,
  deleteTodo,
  markDone,
  moveTodo,
};
