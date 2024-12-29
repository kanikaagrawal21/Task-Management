import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.tsx";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedPercentage: "0",
    pendingPercentage: "0",
    averageCompletionTime: "0",
  });

  const [pendingSummary, setPendingSummary] = useState({
    totalPendingTasks: 0,
    totalTimeLapsed: 0,
    totalTimeToFinish: 0,
    prioritySummary: Array(5).fill({
      priority: 0,
      pendingTasks: 0,
      timeLapsed: 0,
      timeToFinish: 0,
    }),
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch all tasks for dashboard
        const response = await axios.get("https://task-management-app-backend-7snc.onrender.com/tasks/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data;

        // Calculate metrics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === "Finished").length;
        const pendingTasks = totalTasks - completedTasks;

        const completedTimes = tasks
          .filter((task) => task.status === "Finished")
          .map(
            (task) =>
              new Date(task.end_time).getTime() - new Date(task.start_time).getTime()
          );

        const averageCompletionTime =
          completedTimes.reduce((sum, time) => sum + time, 0) / (completedTasks || 1);

        const pendingTasksData = tasks.filter((task) => task.status === "Pending");

        const totalTimeLapsed = pendingTasksData.reduce((sum, task) => {
          const startTime = new Date(task.start_time).getTime();
          const currentTime = Date.now();
          return sum + Math.max(0, currentTime - startTime);
        }, 0);

        const totalTimeToFinish = pendingTasksData.reduce((sum, task) => {
          const endTime = new Date(task.end_time).getTime();
          const currentTime = Date.now();
          return sum + Math.max(0, endTime - currentTime);
        }, 0);

        const prioritySummary = [1, 2, 3, 4, 5].map((priority) => {
          const priorityTasks = pendingTasksData.filter((task) => task.priority === priority);
          const timeLapsed = priorityTasks.reduce((sum, task) => {
            const startTime = new Date(task.start_time).getTime();
            const currentTime = Date.now();
            return sum + Math.max(0, currentTime - startTime);
          }, 0);
          const timeToFinish = priorityTasks.reduce((sum, task) => {
            const endTime = new Date(task.end_time).getTime();
            const currentTime = Date.now();
            return sum + Math.max(0, endTime - currentTime);
          }, 0);
          return {
            priority,
            pendingTasks: priorityTasks.length,
            timeLapsed: Math.round(timeLapsed / (1000 * 60 * 60)), // Convert to hours
            timeToFinish: Math.round(timeToFinish / (1000 * 60 * 60)), // Convert to hours
          };
        });

        // Update state with calculated data
        setSummary({
          totalTasks,
          completedPercentage: ((completedTasks / totalTasks) * 100).toFixed(2),
          pendingPercentage: ((pendingTasks / totalTasks) * 100).toFixed(2),
          averageCompletionTime: (averageCompletionTime / (1000 * 60 * 60)).toFixed(2), // Convert to hours
        });

        setPendingSummary({
          totalPendingTasks: pendingTasks,
          totalTimeLapsed: Math.round(totalTimeLapsed / (1000 * 60 * 60)), // Convert to hours
          totalTimeToFinish: Math.round(totalTimeToFinish / (1000 * 60 * 60)), // Convert to hours
          prioritySummary,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Dashboard</h1>
        <section className="summary-section">
          <h2>Summary</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>{summary.totalTasks}</h3>
              <p>Total tasks</p>
            </div>
            <div className="summary-card">
              <h3>{summary.completedPercentage}%</h3>
              <p>Tasks completed</p>
            </div>
            <div className="summary-card">
              <h3>{summary.pendingPercentage}%</h3>
              <p>Tasks pending</p>
            </div>
            <div className="summary-card">
              <h3>{summary.averageCompletionTime} hrs</h3>
              <p>Average time per completed task</p>
            </div>
          </div>
        </section>

        <section className="pending-summary-section">
          <h2>Pending task summary</h2>
          <div className="pending-summary-cards">
            <div className="summary-card">
              <h3>{pendingSummary.totalPendingTasks}</h3>
              <p>Pending tasks</p>
            </div>
            <div className="summary-card">
              <h3>{pendingSummary.totalTimeLapsed} hrs</h3>
              <p>Total time lapsed</p>
            </div>
            <div className="summary-card">
              <h3>{pendingSummary.totalTimeToFinish} hrs</h3>
              <p>Total time to finish</p>
            </div>
          </div>
          <table className="priority-table">
            <thead>
              <tr>
                <th>Task priority</th>
                <th>Pending tasks</th>
                <th>Time lapsed (hrs)</th>
                <th>Time to finish (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {pendingSummary.prioritySummary.map((row, index) => (
                <tr key={index}>
                  <td>{row.priority}</td>
                  <td>{row.pendingTasks}</td>
                  <td>{row.timeLapsed}</td>
                  <td>{row.timeToFinish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
