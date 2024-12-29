const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Task routes
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Dashboard route
router.get("/dashboard", authMiddleware, getDashboardStats);

module.exports = router;
