import { useEffect, useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { STATUS_OPTIONS } from '../../constants/contants';
import styles from './NewTaskPage.module.scss';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';
import ReactSelect, { MultiValue } from 'react-select';
import { UserOption } from '../../types';

const NewTaskPage = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: '',
  });
  const [users, setUsers] = useState<UserOption[]>([]);
  const [allUsers, setAllUsers] = useState([]);

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

  const handleUserChange = (selectedOptions: MultiValue<UserOption>) => {
    setUsers(selectedOptions as UserOption[]);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        ...newTask,
        userIds: users.map((user) => user.value),
      };

      await api.post('/task', payload);
      alert('Task added successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to add task');
    }
  };
  return (
    <>
      <DefaultHeader title="Add New Task" isHomeButton />
      <div className={styles.NewTaskPage}>
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
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            placeholder="Task Due Date"
          />
          <SelectForm
            value={newTask.status}
            label="Task Status"
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
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
          <button type="submit">Add Task</button>
        </form>
      </div>
    </>
  );
};

export default NewTaskPage;
