import React, { useEffect, useState } from "react";
import { Task } from "../types";
import api from "../services/api";

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/task/me");
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/task", { title: newTask });
      setNewTask("");
      // Refresh task list or append the new task to the state
    } catch (err) {
      setError("Failed to add task");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      {/* Add buttons for creating tasks, etc. */}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task Title"
          required
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default DashboardPage;
