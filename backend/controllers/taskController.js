const Task = require("../models/task");

// Get tasks
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Fetch tasks with pagination
    const tasks = await Task.find({ user: req.user._id })
      .skip(skip)
      .limit(Number(limit));

    const totalTasks = await Task.countDocuments({ user: req.user._id });

    res.json({
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, priority, status, start_time, end_time } = req.body;

    if (!title || !priority || !status || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const task = new Task({
      title,
      priority,
      status,
      start_time,
      end_time,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "Finished",
    });
    const pendingTasks = totalTasks - completedTasks;

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
