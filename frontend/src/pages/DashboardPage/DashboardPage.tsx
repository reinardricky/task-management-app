import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import api from '../../services/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import TaskList from '../../components/TaskList/TaskList';
import styles from './DashboardPage.module.scss';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');

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

  return (
    <>
      <DefaultHeader title="Dashboard" />
      <div className={styles.DashboardPage}>
        <button onClick={() => navigate('/new')}>Add Task</button>
        {error && <p>{error}</p>}
        <TaskList list={tasks} />
      </div>
    </>
  );
};

export default DashboardPage;
