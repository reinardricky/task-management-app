import { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import InputForm from '../InputForm/InputForm';
import { Comment } from '../../types';
import styles from './CommentSection.module.scss';

const CommentSection = ({ taskId }: { taskId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [addComment, setAddComment] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/${taskId}`);
      setComments(response.data);
    } catch (err) {
      alert('Failed to fetch comments');
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = useCallback(async () => {
    try {
      await api.post('/comments', { content: addComment, taskId });
      fetchComments();
      setAddComment('');
      alert('Comment added successfully');
    } catch (err) {
      alert('Failed to add comment');
    }
  }, [taskId, addComment]);

  return (
    <div className={styles.CommentSection}>
      <h3>Comments</h3>
      <InputForm
        type="text"
        placeholder="Add a comment"
        value={addComment}
        onChange={(e) => {
          setAddComment(e.target.value);
        }}
        label="Add a comment"
        onEnter={handleAddComment}
      />
      {comments.map((comment) => (
        <div key={comment.id}>
          <h4>{comment.user.email}</h4>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
