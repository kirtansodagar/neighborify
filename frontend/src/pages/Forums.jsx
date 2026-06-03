import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, MessageSquareIcon, HeartIcon } from '../components/Icons';

const categories = ['all', 'general', 'help', 'recommendations', 'safety', 'buy_sell', 'events'];

export default function Forums() {
  const { user } = useSelector((s) => s.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', tags: '' });
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const catParam = category !== 'all' ? `&category=${category}` : '';
        const { data } = await api.get(`/forums?pincode=${user?.pincode}${catParam}`);
        setForums(data.data.forums);
      } catch {}
      setLoading(false);
    })();
  }, [user?.pincode, category]);

  const createForum = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/forums', {
        ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setForums(prev => [data.data.forum, ...prev]);
      setShowForm(false);
      setForm({ title: '', content: '', category: 'general', tags: '' });
    } catch {}
  };

  return (
    <div className="forums-page">
      <div className="page-header">
        <h2>Forums</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <PlusIcon size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={createForum} className="form-card">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="form-input" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content" required rows={4} className="form-input" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}</option>
            ))}
          </select>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="form-input" />
          <button type="submit" className="submit-btn">Create Discussion</button>
        </form>
      )}

      <div className="category-tabs">
        {categories.map(c => (
          <button
            key={c}
            className={`cat-tab ${category === c ? 'active' : ''}`}
            onClick={() => setSearchParams({ category: c === 'all' ? '' : c })}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner type="feed" count={3} />
      ) : (
        <div className="forums-list">
          {forums.map(f => (
            <Link key={f._id} to={`/forums/${f._id}`} className="forum-card">
              <span className="forum-tag">{f.category}</span>
              <h3 className="forum-title">{f.title}</h3>
              <p className="forum-desc">{f.content?.substring(0, 100)}...</p>
              <div className="forum-footer">
                <span>by {f.author?.name || 'Unknown'}</span>
                <span>
                  <MessageSquareIcon size={12} /> {f.commentsCount || 0} · <HeartIcon size={12} /> {f.likesCount || 0}
                </span>
              </div>
            </Link>
          ))}
          {forums.length === 0 && <p className="empty-state">No discussions yet. Start one!</p>}
        </div>
      )}
    </div>
  );
}
