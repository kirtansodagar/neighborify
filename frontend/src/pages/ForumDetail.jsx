import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeftIcon, SendIcon } from '../components/Icons';

export default function ForumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: f } = await api.get(`/forums/${id}`);
        setForum(f.data.forum);
        const { data: c } = await api.get(`/comments/forum/${id}`);
        setComments(c.data.comments);
      } catch { navigate(-1); }
      setLoading(false);
    })();
  }, [id, navigate]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/comments/forum/${id}`, { text: newComment });
      setComments(prev => [{ ...data.data.comment, replies: [] }, ...prev]);
      setNewComment('');
    } catch {}
  };

  if (loading) return <LoadingSpinner type="feed" count={2} />;
  if (!forum) return null;

  return (
    <div className="forum-detail">
      <button className="forum-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeftIcon size={16} /> Back
      </button>

      <div className="forum-main">
        <span className="forum-tag-big">{forum.category}</span>
        <h1 className="forum-title-big">{forum.title}</h1>
        <div className="forum-author">
          by {forum.author?.name || 'Unknown'} · {forum.author?.pincode || ''}
        </div>
        <p className="forum-content-text">{forum.content}</p>
        {forum.tags?.length > 0 && (
          <div className="forum-tags">
            {forum.tags.map(t => <span key={t} className="forum-tag-item">#{t}</span>)}
          </div>
        )}
      </div>

      <div className="forum-comments-section">
        <h3>Comments ({comments.length})</h3>
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
        {comments.map(c => (
          <div key={c._id} className="forum-comment">
            <div className="fc-avatar">{c.author?.name?.charAt(0) || '?'}</div>
            <div className="fc-body">
              <strong className="fc-author">{c.author?.name}</strong>
              <p className="fc-text">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
