Overview
Purpose: Taskify is a Kanban board app where users register/login, create tasks (todos), move them between columns (To Do, In Progress, Under Review, Finished), and manage tasks with priorities and due dates. Real-time updates are handled via Socket.IO.

Backend:
Tech Stack: Node.js, Express, MongoDB, Mongoose, bcrypt (password hashing), JWT (authentication), Socket.IO (real-time updates), express-validator (input validation).

Models:
Users.js: User model with username (used as email) and password; passwords are hashed with bcrypt via a pre-save hook.

todo.js: Todo model with title, priority (low/medium/urgent), column (To Do/In Progress/Under Review/Finished), status (boolean), userId (references User), and timestamps.

Controllers:
authController.js: Handles register and login, generating JWTs.

todoController.js: Handles todo endpoints for routing logic

(Missing todoController.js logic assumed from todoRoutes.js): Likely includes getAllTodos, createTodo, deleteTodo, markDone, moveTodo.

Middleware:
authMiddleware.js: Verifies JWTs, attaching decoded user data to req.user.

Routes:
authRoutes.js: Defines /register and /login endpoints.

todoRoutes.js: Defines protected endpoints for todos (GET /, POST /, POST /delete, PUT /done, PUT /move) with validation.

Server:
server.js: Sets up Express, MongoDB, Socket.IO, and serves static files (HTML, JS, CSS).

Frontend:
Tech Stack: HTML, CSS, vanilla JavaScript, Socket.IO client, drag-and-drop API.

Pages:
index.html: Main Kanban board with columns and logout button.

login.html: Login form.

register.html: Registration form with email and password validation.

Scripts:
script.js: Handles Kanban board logic (drag-and-drop, task creation, rendering, Socket.IO events).

login.js: Submits login requests and stores JWT in localStorage.

register.js: Validates email/password and submits registration requests.

cardDetail.js: Manages task detail modals (title, description, image, due date).

modal.js: Creates prompt modals for task creation.

Styles:
styles.css: Styles the Kanban board, cards, and auth forms.

modal.css: Styles modals for task creation and details.

auth.css: Styles login and register pages.


---

## 👨‍💻 Author

Built by [@siddgawad](https://github.com/siddgawad) with guidance, persistence, and evolving mastery of full-stack fundamentals.
