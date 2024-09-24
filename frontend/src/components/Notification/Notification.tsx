import { useEffect } from 'react';
import io from 'socket.io-client';
import { useUser } from '../../context/UserContext';

const Notifications = () => {
  const { user } = useUser();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL); // Adjust the URL to match your backend

    // Subscribe to the user's notifications
    const userId = user?.id;
    socket.emit('subscribe-to-notifications', userId);

    // Listen for task assignment notifications
    socket.on('task-assigned', (task) => {
      alert(`Task assigned: ${task.title}`);
    });

    // Listen for comment notifications
    socket.on('comment-added', (comment) => {
      alert(
        `New Comment by ${comment.user.email}: ${comment.content} on Task ${comment.task.title}`,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

export default Notifications;
