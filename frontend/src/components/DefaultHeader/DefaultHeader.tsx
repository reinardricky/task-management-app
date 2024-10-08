import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styles from './DefaultHeader.module.scss';
import { useUser } from '../../context/UserContext';
import { useEffect } from 'react';
import Notifications from '../Notification/Notification';

interface DefaultHeaderProps {
  title: string;
  isHomeButton?: boolean;
}

const DefaultHeader = ({ title, isHomeButton }: DefaultHeaderProps) => {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <header className={styles.DefaultHeader}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.email}>Hello, {user?.email}</span>
      <button
        className={styles.logout}
        onClick={() => {
          Cookies.remove('token');
          navigate('/');
        }}
      >
        Logout
      </button>
      {isHomeButton && (
        <a
          className={styles.home}
          onClick={() => {
            navigate('/dashboard');
          }}
        >
          Home
        </a>
      )}
      <Notifications />
    </header>
  );
};

export default DefaultHeader;
