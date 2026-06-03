import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const alertTypes = ['all', 'safety', 'lost_found', 'traffic', 'utility', 'weather', 'general'];

export default function Alerts() {
  const { user } = useSelector((s) => s.auth);
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/posts/alerts?pincode=${user?.pincode}`);
        setAlerts(data.data.posts);
      } catch {}
      setLoading(false);
    })();
  }, [user?.pincode]);

  const filtered = activeFilter === 'all' ? alerts : alerts.filter(a => a.alertType === activeFilter);

  return (
    <div className="alerts-page">
      <h2>Community Alerts</h2>

      <div className="alert-filters">
        {alertTypes.map(t => (
          <button
            key={t}
            className={`alert-filter ${activeFilter === t ? 'active' : ''}`}
            onClick={() => setActiveFilter(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner type="feed" count={2} />
      ) : (
        filtered.map(alert => <PostCard key={alert._id} post={alert} />)
      )}

      {!loading && filtered.length === 0 && (
        <p className="empty-state">No alerts in this category</p>
      )}
    </div>
  );
}
