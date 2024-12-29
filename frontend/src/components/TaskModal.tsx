import React, { useState } from "react";
import axios from "axios";
import "./TaskModal.css";

interface TaskModalProps {
  onClose: () => void;
  onTaskAdd: (newTask: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onTaskAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: 1,
    status: "Pending",
    start_time: "",
    end_time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://task-management-app-backend-7snc.onrender.com/tasks",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(formData);

      onTaskAdd(response.data.task); 
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const toggleStatus = () => {
    setFormData((prevData) => ({
      ...prevData,
      status: prevData.status === "Pending" ? "Finished" : "Pending",
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Add New Task</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: parseInt(e.target.value) })
              }
            >
              <option value="1">1 (Low)</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 (High)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="start_time">Start Time</label>
            <input
              type="datetime-local"
              id="start_time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <input
              type="datetime-local"
              id="end_time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group switch-group">
            <label>Task Status</label>
            <div className="status-switch">
              <span>
                {formData.status === "Pending" ? "Pending" : "Finished"}
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.status === "Finished"}
                  onChange={toggleStatus}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="add-task-submit-button">
              Add Task
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
