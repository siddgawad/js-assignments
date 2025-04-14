import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "2d"
  });
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing credentials" });

  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser)
      return res.status(409).json({ message: "Username already exists" });

    const user = await Users.create({ username, password });
    const token = generateToken(user);
    res.status(201).json({ message: "User created", token });
  } catch (err) {
    res.status(400).json({ message: "Error during registration", error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: "Error during login", error: err.message });
  }
};
