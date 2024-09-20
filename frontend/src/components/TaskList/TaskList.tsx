import { format } from 'date-fns';
import { Task } from '../../types';
import styles from './TaskList.module.scss';
import { useNavigate } from 'react-router-dom';
import { truncateText } from '../../services/utils';

interface TaskListProps {
  list: Task[];
}

const TaskList = ({ list }: TaskListProps) => {
  const navigate = useNavigate();
  return (
    <div className={styles.TaskList}>
      {list.map((task) => (
        <div
          key={task.id}
          className={styles.TaskCard}
          onClick={() => {
            navigate(`/task/${task.id}`);
          }}
        >
          <h3>{truncateText(task.title, 20)}</h3>
          <p>{truncateText(task.description || '', 100)}</p>
          <p>status: {task.status || '-'}</p>
          <p>
            due date:{' '}
            {task.dueDate ? format(new Date(task.dueDate), 'dd-MM-yyyy') : '-'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
