import db from "../models/database.js";
const { Admin, Course } = db;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminSignInController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isValid = await bcrypt.compare(password, existingAdmin.password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { id: existingAdmin._id },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Admin signed in", accessToken });
  } catch (err) {
    console.error("Admin sign-in error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminSignUpController = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({ firstName, lastName, email, password });
    const accessToken = jwt.sign(
      { id: newAdmin._id },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ message: "Admin signed up", accessToken });
  } catch (err) {
    console.error("Admin signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminCourseController = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId
    });

    return res.status(201).json({ message: "Admin created course",creatorId, courseId: course._id});
  } catch (err) {
    console.error("Course creation error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminPutCourseController = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl, courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "courseId is required" });
  }

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(403).json({ message: "Unauthorized to edit this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, price, imageUrl },
      { new: true }
    );

    return res.status(200).json({
      message: "Admin edited course",
      courseId: updatedCourse._id
    });
  } catch (err) {
    console.error("Course update error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminGetCourseController = async (req, res) => {
    const adminId=req.adminId;
  try {
    const courses = await Course.find({creatorId:adminId});
    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }

    return res.json({
      message: "Courses fetched successfully",
      data: courses
    });
  } catch (err) {
    console.error("Course fetch error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  adminSignInController,
  adminSignUpController,
  adminCourseController,
  adminPutCourseController,
  adminGetCourseController
};
