import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import path from "path";
import { join } from 'path';

import authRoutes from "../routes/authRoutes.js";
import todoRoutes from "../routes/todoRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const httpServer = createServer(app); // ⬅️ needed for socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ✅ Export getIO for controller use
let _io;
export const getIO = () => _io;

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
});

_io = io;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve specific files with correct MIME types
app.get('/script.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../public/script.js'));
});

app.get('/modal.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../public/modal.js'));
});

app.get('/cardDetail.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../public/cardDetail.js'));
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve login.html for the login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Serve register.html for the register route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// ✅ MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
