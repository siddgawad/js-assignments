const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: {
        type: String,
        enum: ["low", "medium", "urgent"],
        default: "low"
    },
    status: { type: Boolean, default: false },
    column: {
        type: String,
        enum: ["To Do", "In Progress", "Under Review", "Finished"],
        default: "To Do"
    },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
