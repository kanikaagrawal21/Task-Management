require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Database Connection
connectDB();

module.exports = app;
