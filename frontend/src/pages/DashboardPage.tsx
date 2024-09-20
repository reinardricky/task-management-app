import React, { useEffect, useState } from "react";
import { Task } from "../types";
import api from "../services/api";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const statusOptions = ["To Do", "In Progress", "Done"];

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: "",
    user: [],
  });

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await api.get("/task/me");
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        // Check if login expired
        const response = await api.get("/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    verifyToken();
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/task", newTask);
      setNewTask({
        title: "",
        description: "",
        status: "",
        dueDate: "",
        user: [],
      });
      // Refresh task list or append the new task to the state
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          Cookies.remove("token");
          navigate("/");
        }}
      >
        Logout
      </button>
      <h1>Dashboard</h1>
      {/* Add buttons for creating tasks, etc. */}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="New Task Title"
          required
        />
        <input
          type="text"
          value={newTask.description}
          placeholder="Task Description"
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="datetime-local"
          value={newTask.dueDate}
          placeholder="Task Due Date"
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          required
        >
          <option value="" disabled>
            Select Status
          </option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>
              {task.dueDate ? format(new Date(task.dueDate), "dd-MM-yyyy") : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
