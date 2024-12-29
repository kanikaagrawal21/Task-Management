import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header.tsx";
import TaskActions from "../components/TaskActions.tsx";
import TaskCard from "../components/TaskCard.tsx";
import TaskModal from "../components/TaskModal.tsx";
import "./TaskList.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (page: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://task-management-app-backend-7snc.onrender.com/tasks?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data.tasks);
      setFilteredTasks(response.data.tasks);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handleEdit = (updatedTask: any) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    setFilteredTasks(
      filteredTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleDelete = async (taskId: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://task-management-app-backend-7snc.onrender.com/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(currentPage);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAdd = (newTask: any) => {
    fetchTasks(currentPage);
    setIsModalOpen(false);
  };

  const sortByTime = () => {
    const sortedTasks = [...filteredTasks].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    setFilteredTasks(sortedTasks);
  };

  const sortByPriority = () => {
    const sortedTasks = [...filteredTasks].sort(
      (a, b) => b.priority - a.priority
    );
    setFilteredTasks(sortedTasks);
  };

  const filterByStatus = (status: string) => {
    if (status === "All") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  const removeFilters = () => {
    setFilteredTasks(tasks);
  };

  return (
    <div className="task-list-container">
      <Header />
      <TaskActions
        openModal={() => setIsModalOpen(true)}
        sortByTime={sortByTime}
        sortByPriority={sortByPriority}
        filterByStatus={filterByStatus}
        removeFilters={removeFilters}
      />
      <div className="task-grid">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onTaskAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default TaskList;
