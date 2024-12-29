import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal.tsx";
import "./TaskCard.css";

interface TaskCardProps {
  task: any;
  onDelete: (taskId: string) => void;
  onEdit: (updatedTask: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (updatedTask: any) => {
    onEdit(updatedTask); 
    setIsEditModalOpen(false); 
  };

  return (
    <>
      <div className="task-card">
        <h3 className="task-id">Task ID: {task._id}</h3>
        <h2 className="task-title">{task.title}</h2>
        <div className="status-priority">
          <p
            className={`task-status ${
              task.status === "Pending" ? "pending" : "finished"
            }`}
          >
            {task.status}
          </p>
          <p className="task-priority">Priority: {task.priority}</p>
        </div>
        <p className="task-meta">
          <span>Start:</span> {new Date(task.start_time).toLocaleString()}
        </p>
        <p className="task-meta">
          <span>End:</span> {new Date(task.end_time).toLocaleString()}
        </p>
        <div className="task-actions">
          <button
            className="edit-button"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
          <button className="delete-button" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEdit}
        />
      )}
    </>
  );
};

export default TaskCard;
