import { format } from 'date-fns';
import { Task } from '../../types';
import styles from './TaskList.module.scss';

interface TaskListProps {
  list: Task[];
}

const TaskList = ({ list }: TaskListProps) => {
  return (
    <div className={styles.TaskList}>
      {list.map((task) => (
        <div key={task.id} className={styles.TaskCard}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.status}</p>
          <p>
            {task.dueDate ? format(new Date(task.dueDate), 'dd-MM-yyyy') : ''}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
