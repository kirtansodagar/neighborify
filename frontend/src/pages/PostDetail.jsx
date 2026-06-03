import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SendIcon } from '../components/Icons';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: p } = await api.get(`/posts/${id}`);
        setPost(p.data.post);
        const { data: c } = await api.get(`/comments/post/${id}`);
        setComments(c.data.comments);
      } catch { navigate(-1); }
      setLoading(false);
    })();
  }, [id, navigate]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/comments/post/${id}`, { text: newComment });
      setComments(prev => [{ ...data.data.comment, replies: [] }, ...prev]);
      setNewComment('');
    } catch {}
  };

  if (loading) return <div className="feed-posts"><LoadingSpinner type="feed" count={1} /></div>;

  return (
    <div className="post-detail">
      <PostCard post={post} detailView />

      <div className="comments-section">
        <h3 className="comments-title">Comments ({comments.length})</h3>

        <form onSubmit={addComment} className="comment-form">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
            <SendIcon size={18} />
          </button>
        </form>

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <div className="comment-avatar-ring">
                <div className="comment-avatar">{c.author?.name?.charAt(0) || '?'}</div>
              </div>
              <div className="comment-body">
                <strong className="comment-author">{c.author?.name || 'Unknown'}</strong>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="no-comments">No comments yet. Be the first!</p>}
        </div>
      </div>
    </div>
  );
}
