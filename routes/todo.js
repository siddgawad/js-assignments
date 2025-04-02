const { Router } = require("express");
const adminMiddleware = require("../../js/middleware/user");
const router = Router();

let todos = [];


router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    title,
    status: false,
  };

  todos.push(newTodo);
  return res.status(201).json({ message: "Todo created", todo: newTodo });
});


router.put("/", adminMiddleware, (req, res) => {
    /*
adminMiddleware is a function that runs before the route handler.

So the flow is:

A request comes to PUT /

adminMiddleware(req, res, next) runs first

If the middleware allows it (i.e., calls next()), then the function (req, res) => { ... } is allowed to run

If the middleware rejects it (i.e., returns a 403 or 401), the actual route never runs



    */
  const { id, title, status } = req.body;

  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) todo.title = title;
  if (status !== undefined) todo.status = status;

  return res.status(200).json({ message: "Todo updated", todo });
});


router.delete("/", adminMiddleware, (req, res) => {
  const { id } = req.body;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const removed = todos.splice(index, 1)[0];
  return res.status(200).json({ message: "Todo deleted", removed });
});


router.delete("/:id", adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const removed = todos.splice(index, 1)[0];
  return res.status(200).json({ message: "Todo deleted by param", removed });
});


router.get("/", adminMiddleware, (req, res) => {
  return res.status(200).json({ todos });
});


router.get("/:id", adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  return res.status(200).json({ todo });
});

module.exports = router;
