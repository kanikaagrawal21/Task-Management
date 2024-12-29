import React from "react";
import "./TaskActions.css";

interface TaskActionsProps {
  openModal: () => void;
  sortByTime: () => void;
  sortByPriority: () => void;
  filterByStatus: (status: string) => void;
  removeFilters: () => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  openModal,
  sortByTime,
  sortByPriority,
  filterByStatus,
  removeFilters,
}) => {
  return (
    <div className="task-actions-container">
      <button onClick={openModal} className="add-task-button">
        + Add Task
      </button>
      <div className="task-filters">
        <button onClick={sortByTime} className="filter-button">
          Sort by Time
        </button>
        <button onClick={sortByPriority} className="filter-button">
          Sort by Priority
        </button>
        <div className="dropdown">
          <button className="filter-button dropdown-toggle">Status</button>
          <div className="dropdown-menu">
            <button
              onClick={() => filterByStatus("Pending")}
              className="dropdown-item"
            >
              Pending
            </button>
            <button
              onClick={() => filterByStatus("Finished")}
              className="dropdown-item"
            >
              Finished
            </button>
          </div>
        </div>
        <button
          onClick={removeFilters}
          className="filter-button clear-filters-button"
        >
          Remove Filters
        </button>
      </div>
    </div>
  );
};

export default TaskActions;
