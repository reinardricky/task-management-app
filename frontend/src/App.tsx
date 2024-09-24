import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import NewTaskPage from './pages/NewTaskPage/NewTaskPage';
import ViewTaskPage from './pages/ViewTaskPage/ViewTaskPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/new" element={<NewTaskPage />} />
        <Route path="/task/:id" element={<ViewTaskPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
