const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["Pending", "Finished"],
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// validate end_time > start_time
TaskSchema.pre("save", function (next) {
  if (this.end_time <= this.start_time) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

TaskSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (
    update.end_time &&
    update.start_time &&
    update.end_time <= update.start_time
  ) {
    return next(new Error("End time must be after start time"));
  }

  next();
});

module.exports = mongoose.model("Task", TaskSchema);
