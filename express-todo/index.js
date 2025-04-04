const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const Todo = require("../models/Todo")
const mongoose = require("mongoose");

app.use(cors());


app.use(express.json());

// ✅ GET all todos
app.get("/", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        return res.status(200).json({ todos });
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ POST new todo
app.post("/", async (req, res) => {
    try {
        const { title,priority,column } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "title not found" });
        }
        const validColumns = ["To Do", "In Progress", "Under Review", "Finished"];
        if (!validColumns.includes(column)) {
            return res.status(400).json({ message: "Invalid column name received" });
        }

        const newTodo = await Todo.create({ title,priority,column});
        return res.status(201).json({ message: "successfully added new todo", todo: newTodo });
    } catch (err) {
        console.error("Error adding todo:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ POST delete todo by ID
app.post("/delete", async (req, res) => {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "No ID provided" });
    }
  
    try {
      const result = await Todo.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      res.status(200).json({ message: "Deleted todo successfully" });
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

// ✅ PUT mark todo as done
app.put("/done", async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).json({ message: "id not provided" });
        }

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "todo not found" });
        }

        if (todo.status === true) {
            return res.status(200).json({ message: "todo is already marked as done" });
        }

        todo.status = true;
        await todo.save();

        return res.status(200).json({ message: "todo marked as done", todo });
    } catch (err) {
        console.error("Error marking todo as done:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/move", async (req, res) => {
    const { id, column } = req.body;
    if (!id || !column) {
      return res.status(400).json({ message: "Missing id or column" });
    }
  
    try {
      const todo = await Todo.findById(id);
      if (!todo) return res.status(404).json({ message: "Todo not found" });
  
      todo.column = column;
      await todo.save();
  
      res.status(200).json({ message: "Updated column", todo });
    } catch (err) {
      console.error("Error moving task:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

// ✅ Connect to MongoDB and start server
mongoose
    .connect("mongodb+srv://[username]]:[password]@cluster0.0ruxnow.mongodb.net/taskify?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

// Fallback route
app.all("*", (req, res) => {
    res.status(404).send(`Route not found: ${req.method} ${req.path}`);
});