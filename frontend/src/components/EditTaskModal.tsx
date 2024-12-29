import React, { useState } from "react";
import axios from "axios";
import "./TaskModal.css";

interface EditTaskModalProps {
  task: any;
  onClose: () => void;
  onSave: (updatedTask: any) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onClose,
  onSave,
}) => {
  const formatDateForInput = (date: string | Date): string => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: task.title,
    priority: task.priority,
    status: task.status,
    start_time: formatDateForInput(task.start_time),
    end_time: formatDateForInput(task.end_time),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated");
      return;
    }

    try {
      const response = await axios.put(
        `https://task-management-app-backend-7snc.onrender.com/tasks/${task._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSave(response.data.task);
      onClose();
    } catch (error: any) {
      console.error(
        "Error updating task:",
        error.response?.data?.message || error.message
      );
      alert("Failed to update task");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
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
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Finished">Finished</option>
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
          <div className="modal-actions">
            <button type="submit" className="add-task-submit-button">
              Save
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
