import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, UserOption } from '../../types';
import api from '../../services/api';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';
import { formatDate } from 'date-fns';
import styles from './ViewTaskPage.module.scss';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';
import { STATUS_OPTIONS } from '../../constants/contants';
import ReactSelect, { MultiValue } from 'react-select';
import CommentSection from '../../components/CommentSection/CommentSection';

const ViewTaskPage = () => {
  const { id } = useParams();

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [allUsers, setAllUsers] = useState([]);

  const previousTaskRef = useRef<Task | null>(null);
  const previousUsersRef = useRef<UserOption[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user');
        setAllUsers(response.data);
      } catch (err) {
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/task/${id}`);
        previousTaskRef.current = response.data;
        setTask({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
          dueDate: response.data.dueDate,
        });
        setUsers(
          response.data.users.map((user: { id: number; email: string }) => ({
            value: user.id,
            label: user.email,
          })),
        );
        previousUsersRef.current = response.data.users.map(
          (user: { id: number; email: string }) => ({
            value: user.id,
            label: user.email,
          }),
        );
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
      const payload = {
        ...task,
        userIds: users.map((user) => user.value),
      };

      await api.patch(`/task/${id}`, payload);
      alert('Task updated successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update task');
    }
  }, [id, task, users]);

  const handleDeleteTask = useCallback(async () => {
    try {
      await api.delete(`/task/${id}`);
      alert('Task deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete task');
    }
  }, [id]);

  const handleUserChange = (selectedOptions: MultiValue<UserOption>) => {
    setUsers(selectedOptions as UserOption[]);
  };

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
            <ReactSelect
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '100%',
                  maxWidth: '425px',
                  margin: '20px 0',
                }),
              }}
              isMulti
              value={users}
              onChange={handleUserChange}
              options={allUsers.map((user: { id: string; email: string }) => ({
                value: user.id,
                label: user.email,
              }))}
              placeholder="Select Users"
            />
            <button
              onClick={handleUpdateTask}
              disabled={
                JSON.stringify(previousTaskRef.current) ===
                  JSON.stringify(task) &&
                JSON.stringify(previousUsersRef.current) ===
                  JSON.stringify(users)
              }
            >
              Update Task
            </button>
            <button
              onClick={() => {
                setTask(previousTaskRef.current);
                setUsers(previousUsersRef.current);
              }}
              disabled={
                JSON.stringify(previousTaskRef.current) ===
                  JSON.stringify(task) &&
                JSON.stringify(previousUsersRef.current) ===
                  JSON.stringify(users)
              }
            >
              Reset Task
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteTask}>
              Delete Task
            </button>
            {id ? <CommentSection taskId={Number(id)} /> : null}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default ViewTaskPage;
