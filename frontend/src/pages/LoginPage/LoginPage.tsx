import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './LoginPage.module.scss';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import InputForm from '../../components/InputForm/InputForm';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();

  const verifyToken = useCallback(async () => {
    let token = Cookies.get('token');

    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token') || '';
      if (token) {
        // Save token to cookies if found in URL
        Cookies.set('token', token);
      }
    }

    if (token) {
      try {
        // Check if login expired
        const response = await api.get('/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        alert('Session expired. Please log in again.');
      }
    }
  }, [navigate]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // Memoize values to prevent unnecessary re-renders
  const memoizedEmail = useMemo(() => email, [email]);
  const memoizedPassword = useMemo(() => password, [password]);
  const memoizedConfirmPassword = useMemo(
    () => confirmPassword,
    [confirmPassword],
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await api.post('/auth/login', {
          email: memoizedEmail,
          password: memoizedPassword,
        });
        if (response.status === 201) {
          alert('Login successful');
          Cookies.set('token', response.data.access_token);
          navigate('/dashboard');
        }
      } catch (err: any) {
        alert(err.response.data.message);
      }
    },
    [memoizedEmail, memoizedPassword, navigate],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (memoizedPassword !== memoizedConfirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const response = await api.post('/auth/register', {
          email: memoizedEmail,
          password: memoizedPassword,
        });
        Cookies.set('token', response.data.token);
        navigate('/dashboard');
      } catch (err: any) {
        alert(err.response.data.message);
      }
    },
    [memoizedEmail, memoizedPassword, memoizedConfirmPassword, navigate],
  );

  return (
    <div className={styles.LoginPage}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        <InputForm
          type="email"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <InputForm
          type="password"
          value={password}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {isRegister ? (
          <InputForm
            type="password"
            value={confirmPassword}
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        ) : null}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p>or sign in with</p>
      <GoogleLoginButton />
      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
