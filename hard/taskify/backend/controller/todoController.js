import Todo from "../models/Todo.js";

// ✅ GET all todos for logged-in user
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ todos });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ CREATE new todo
const createTodo = async (req, res) => {
  try {
    const { title, priority, column } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const validColumns = ["To Do", "In Progress", "Under Review", "Finished"];
    if (!validColumns.includes(column)) {
      return res.status(400).json({ message: "Invalid column name" });
    }

    const newTodo = await Todo.create({
      title,
      priority,
      column,
      userId: req.user.id
    });

    return res.status(201).json({ message: "Todo created", todo: newTodo });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllTodos,
  createTodo,
  deleteTodo,
  markDone,
  moveTodo,
};
