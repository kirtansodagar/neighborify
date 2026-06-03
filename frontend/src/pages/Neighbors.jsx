import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPinIcon } from '../components/Icons';

export default function Neighbors() {
  const { user } = useSelector((s) => s.auth);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/users/neighbors?pincode=${user?.pincode}`);
        setNeighbors(data.data.users);
      } catch {}
      setLoading(false);
    })();
  }, [user?.pincode]);

  if (loading) return <LoadingSpinner type="chat" count={5} />;

  return (
    <div className="neighbors-page">
      <h2>Neighbors</h2>
      <p className="neighbors-sub">
        <MapPinIcon size={14} /> People around {user?.pincode}
      </p>

      <div className="neighbors-list">
        {neighbors.map(n => (
          <Link key={n._id} to={`/profile/${n._id}`} className="neighbor-card">
            <div className="neighbor-avatar-ring">
              <div className="neighbor-avatar">{n.name?.charAt(0)?.toUpperCase() || '?'}</div>
            </div>
            <div className="neighbor-info">
              <span className="neighbor-name">{n.name}</span>
              <span className="neighbor-bio">{n.bio || 'No bio'}</span>
            </div>
            <span className="neighbor-followers">{n.followersCount || 0} followers</span>
          </Link>
        ))}
        {neighbors.length === 0 && <p className="empty-state">No neighbors found in your area</p>}
      </div>
    </div>
  );
}
