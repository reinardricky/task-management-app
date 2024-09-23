import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../../types';
import api from '../../services/api';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';
import { format, formatDate } from 'date-fns';
import styles from './ViewTaskPage.module.scss';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';
import { STATUS_OPTIONS } from '../../constants/contants';

const ViewTaskPage = () => {
  const { id } = useParams();
  const previousTaskRef = useRef<Task | null>(null);
  const [task, setTask] = useState<Task | null>(null);

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
    } catch (err) {
      alert('Failed to update task');
    }
  }, [id, task]);

  return (
    <>
      <DefaultHeader title="Task Details" />
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
                // compare previous task and task
                (previousTaskRef.current &&
                  previousTaskRef.current.title === task.title &&
                  previousTaskRef.current.description === task.description &&
                  previousTaskRef.current.dueDate &&
                  task.dueDate &&
                  format(previousTaskRef.current.dueDate, 'yyyy-MM-dd') ===
                    format(task.dueDate, 'yyyy-MM-dd') &&
                  previousTaskRef.current.status === task.status) ||
                false
              }
            >
              Update Task
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
