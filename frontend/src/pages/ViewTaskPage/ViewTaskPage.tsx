import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../../types';
import api from '../../services/api';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';
import { format } from 'date-fns';
import styles from './ViewTaskPage.module.scss';

const ViewTaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/task/${id}`);
        setTask(response.data);
      } catch (err) {
        alert('Failed to fetch task');
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  return (
    <>
      <DefaultHeader title="Task Details" />
      <div className={styles.ViewTaskPage}>
        {task ? (
          <div>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>
              {task.dueDate ? format(new Date(task.dueDate), 'dd-MM-yyyy') : ''}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default ViewTaskPage;
