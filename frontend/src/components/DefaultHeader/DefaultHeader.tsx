import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styles from './DefaultHeader.module.scss';

interface DefaultHeaderProps {
  title: string;
}

const DefaultHeader = ({ title }: DefaultHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className={styles.DefaultHeader}>
      <h1 className={styles.title}>{title}</h1>
      <button
        className={styles.logout}
        onClick={() => {
          Cookies.remove('token');
          navigate('/');
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default DefaultHeader;
