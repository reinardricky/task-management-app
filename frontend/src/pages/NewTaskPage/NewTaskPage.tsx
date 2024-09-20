import { useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import SelectForm from '../../components/SelectForm/SelectForm';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { STATUS_OPTIONS } from '../../constants/contants';
import styles from './NewTaskPage.module.scss';
import DefaultHeader from '../../components/DefaultHeader/DefaultHeader';

const NewTaskPage = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: '',
    user: [],
  });

  const navigate = useNavigate();

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/task', newTask);
      alert('Task added successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to add task');
    }
  };
  return (
    <>
      <DefaultHeader title="Add New Task" />
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
          <button type="submit">Add Task</button>
        </form>
      </div>
    </>
  );
};

export default NewTaskPage;
