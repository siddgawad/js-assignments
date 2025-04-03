# 🧠 Kanban Task Manager Breakdown

This markdown file outlines the **9 core modules** of your Kanban + Backend system, built with vanilla JS, Express.js, and MongoDB (Mongoose).

---

## ✅ 1. UI DOM Structure

- HTML structure: columns (`To Do`, `In Progress`, `Finished`, etc.)
- Buttons: "Add Task", dynamically added to each column
- Event listeners tied to DOM loading (`DOMContentLoaded`)

---

## ✅ 2. Card Creation Logic

- Prompts for:
  - `title`
  - `priority` (low / medium / urgent)
- Dynamically builds:
  - `.card` div with header/footer
  - Priority badge span
  - Timestamp
  - Optional action button (e.g., "Mark as In Progress")

---

## ✅ 3. Drag and Drop

- `dragstart`, `dragover`, `drop`, and `dragleave` handlers
- Visual feedback (`.drag-over` highlight)
- Sets priority attribute during drag
- Updates card column location on drop

---

## ✅ 4. Time Tracking System

- Sets `data-timestamp` at creation/move
- Uses `setInterval` to update "Just now" / "5 mins ago"
- Friendly relative time rendering
- Persists `createdAt` from MongoDB

---

## ✅ 5. Mark as In Progress Logic

- Dynamically added `button.mark-in-progress`
- Only visible in:
  - To Do
  - Under Review (if applicable)
- Removed if card is dropped into:
  - In Progress
  - Finished

---

## ✅ 6. Delete Button Logic

- Appears when card is dropped into “Finished”
- `button.delete-btn` dynamically added
- Calls backend `POST /delete`
- Removes from:
  - MongoDB
  - UI

---

## ✅ 7. MongoDB Backend (Express.js + Mongoose)

- Routes:
  - `GET /` — fetch all tasks
  - `POST /` — create new task
  - `PUT /done` — mark task as done
  - `PUT /move` — update task's column
  - `POST /delete` — delete a task
- MongoDB stores:
  - `title`, `priority`, `column`, `status`, `createdAt`

---

## ✅ 8. Persistence (loadAndRenderTasks)

- On page load (`DOMContentLoaded`)
  - Fetches all tasks from MongoDB
  - Recreates card DOM for each task
- Sets correct:
  - Priority badge
  - Column placement
  - Button visibility

---

## ✅ 9. Card Movement Tracking & Status

- `column`: tracks which Kanban column card belongs to
- `status`: true = done
- UI syncs with backend:
  - `PUT /move` when dropped
  - `PUT /done` when marked finished
  - Reflects correct time and buttons

---

## 📁 Future Ideas

- Add `movedAt` timestamp
- Visual log of "Moved from X to Y"
- Subtasks, due dates, filters

---

## 🔧 Tech Stack

- **Frontend**: HTML + CSS + Vanilla JS (no frameworks)
- **Backend**: Express.js + Mongoose
- **Database**: MongoDB Atlas

---

## 👨‍💻 Author

Built by [@siddgawad](https://github.com/siddgawad) with guidance, persistence, and evolving mastery of full-stack fundamentals.
