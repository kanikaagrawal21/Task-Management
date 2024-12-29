const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasksForDashboard
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Task routes
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Dashboard route
router.get("/dashboard", authMiddleware, getAllTasksForDashboard);

module.exports = router;
