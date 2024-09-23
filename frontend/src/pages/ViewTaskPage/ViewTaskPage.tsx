import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '../../types';
import api from '../../services/api';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';
import { formatDate } from 'date-fns';
import styles from './ViewTaskPage.module.scss';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';
import { STATUS_OPTIONS } from '../../constants/contants';

const ViewTaskPage = () => {
  const { id } = useParams();
  const previousTaskRef = useRef<Task | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/task/${id}`);
        previousTaskRef.current = response.data;
        setTask(response.data);
      } catch (err) {
        alert('Failed to fetch task');
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleUpdateTask = useCallback(async () => {
    try {
      await api.patch(`/task/${id}`, task);
      alert('Task updated successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update task');
    }
  }, [id, task]);

  const handleDeleteTask = useCallback(async () => {
    try {
      await api.delete(`/task/${id}`);
      alert('Task deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete task');
    }
  }, [id]);

  return (
    <>
      <DefaultHeader title="Task Details" isHomeButton />
      <div className={styles.ViewTaskPage}>
        {task ? (
          <>
            <InputForm
              type="text"
              value={task.title}
              label="Title"
              onChange={(e) => {
                // Update task title
                setTask({ ...task, title: e.target.value });
              }}
              placeholder="Title"
              required
            />
            <InputForm
              type="text"
              value={task.description}
              label="Description"
              onChange={(e) => {
                // Update task description
                setTask({ ...task, description: e.target.value });
              }}
              placeholder="Description"
              required
            />
            <InputForm
              type="date"
              value={task.dueDate ? formatDate(task.dueDate, 'yyyy-MM-dd') : ''}
              label="Due Date"
              onChange={(e) => {
                // Update task due date
                setTask({ ...task, dueDate: new Date(e.target.value) });
              }}
              placeholder="Due Date"
              required
            />
            <SelectForm
              value={task.status}
              label="Task Status"
              onChange={(e) =>
                setTask({
                  ...task,
                  status: e.target.value as 'To Do' | 'In Progress' | 'Done',
                })
              }
              placeholder="Select Status"
              options={STATUS_OPTIONS}
              required
            />
            <button
              onClick={handleUpdateTask}
              disabled={
                JSON.stringify(previousTaskRef.current) === JSON.stringify(task)
              }
            >
              Update Task
            </button>
            <button
              onClick={() => {
                setTask(previousTaskRef.current);
              }}
              disabled={
                JSON.stringify(previousTaskRef.current) === JSON.stringify(task)
              }
            >
              Reset Task
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteTask}>
              Delete Task
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default ViewTaskPage;
