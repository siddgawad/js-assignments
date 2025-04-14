import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "urgent"], default: "medium" },
    column: {
      type: String,
      enum: ["To Do", "In Progress", "Under Review", "Finished"],
      default: "To Do",
    },
    status: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
