const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "todos.json");

// Load todos from file
function loadTodos() {
  try {
    if (!fs.existsSync(FILE_PATH)) return [];

    const data = fs.readFileSync(FILE_PATH, "utf8");
    if (!data.trim()) return [];

    return JSON.parse(data);
  } catch (error) {
    console.log("❌ Failed to load todos:", error.message);
    return [];
  }
}

// Save todos to file
function saveTodos(todos) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), "utf-8");
    console.log("✅ Todos saved successfully!");
  } catch (error) {
    console.log("❌ Failed to save todos:", error.message);
  }
}

// Parse CLI input
const [, , command, ...args] = process.argv;

switch (command) {
  case "add": {
    const taskText = args.join(" ").trim();

    if (!taskText) {
      console.log("❌ Task text is required!");
      break;
    }

    const todos = loadTodos();

    const newTodo = {
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      task: taskText,
      done: false
    };

    todos.push(newTodo);
    saveTodos(todos);

    console.log(`✅ Added task [${newTodo.id}]: "${newTodo.task}"`);
    break;
  }

  case "list": {
    const todos = loadTodos();

    if (todos.length === 0) {
      console.log("📭 No tasks found!");
      break;
    }

    console.log("📝 Your TODOs:\n");
    todos.forEach((todo) => {
      const status = todo.done ? "✅" : "❌";
      console.log(`[${todo.id}] ${status} ${todo.task}`);
    });

    break;
  }

  case "done": {
    const id = parseInt(args[0]);

    if (isNaN(id)) {
      console.log("❌ Please provide a valid task ID.");
      break;
    }

    const todos = loadTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      console.log(`❌ Task with ID ${id} not found.`);
      break;
    }

    if (todo.done) {
      console.log(`ℹ️ Task [${id}] is already marked as done.`);
      break;
    }

    todo.done = true;
    saveTodos(todos);

    console.log(`✅ Task [${id}] marked as done.`);
    break;
  }

  case "delete": {
    const id = parseInt(args[0]);

    if (isNaN(id)) {
      console.log("❌ Please provide a valid task ID to delete.");
      break;
    }

    const todos = loadTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      console.log(`❌ Task with ID ${id} not found.`);
      break;
    }

    const removed = todos.splice(index, 1)[0];
    saveTodos(todos);

    console.log(`🗑️ Deleted task [${removed.id}]: "${removed.task}"`);
    break;
  }

  default:
    console.log("❓ Unknown command. Try: add, list, done, delete");
}
