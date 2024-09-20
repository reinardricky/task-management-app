import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import api from '../../services/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import TaskList from '../../components/TaskList/TaskList';
import styles from './DashboardPage.module.scss';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';

const statusOptions = ['To Do', 'In Progress', 'Done'];

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: '',
    user: [],
  });

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/task/me');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token');
      if (token) {
        // Check if login expired
        const response = await api.get('/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };
    verifyToken();
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/task', newTask);
      setNewTask({
        title: '',
        description: '',
        status: '',
        dueDate: '',
        user: [],
      });
      // Refresh task list or append the new task to the state
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  return (
    <div className={styles.DashboardPage}>
      <button
        onClick={() => {
          Cookies.remove('token');
          navigate('/');
        }}
      >
        Logout
      </button>
      <h1>Dashboard</h1>
      {/* Add buttons for creating tasks, etc. */}
      <form onSubmit={handleAddTask}>
        <InputForm
          type="text"
          value={newTask.title}
          label="Task Title"
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
          required
        />
        <InputForm
          type="text"
          value={newTask.description}
          label="Task Description"
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task Description"
        />
        <InputForm
          type="date"
          value={newTask.dueDate}
          label="Task Due Date"
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          placeholder="Task Due Date"
        />
        <SelectForm
          value={newTask.status}
          label="Task Status"
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          placeholder="Select Status"
          options={statusOptions}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      {error && <p>{error}</p>}
      <TaskList list={tasks} />
    </div>
  );
};

export default DashboardPage;
