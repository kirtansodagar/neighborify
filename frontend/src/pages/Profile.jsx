import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPinIcon, SettingsIcon, GridIcon } from '../components/Icons';

export default function Profile() {
  const { id } = useParams();
  const { user: authUser } = useSelector((s) => s.auth);
  const profileId = id || authUser?._id;
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: u } = await api.get(`/users/${profileId}`);
        setProfile(u.data.user);
        const { data: p } = await api.get(`/users/${profileId}/posts`);
        setPosts(p.data.posts);
      } catch {}
      setLoading(false);
    })();
  }, [profileId]);

  if (loading) return <LoadingSpinner type="profile" />;
  if (!profile) return <div className="page-error">User not found</div>;

  const isOwn = authUser?._id === profileId;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large-ring">
          <div className="profile-avatar-large">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() || '?'
            )}
          </div>
        </div>
        <h1 className="profile-name">{profile.name}</h1>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <div className="profile-meta">
          {profile.neighborhood && (
            <span><MapPinIcon size={14} /> {profile.neighborhood}</span>
          )}
          <span>📍 {profile.pincode}</span>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{profile.postsCount || posts.length}</strong>
            Posts
          </div>
          <div className="profile-stat">
            <strong>{profile.followersCount || 0}</strong>
            Followers
          </div>
          <div className="profile-stat">
            <strong>{profile.followingCount || 0}</strong>
            Following
          </div>
        </div>

        <div className="profile-actions">
          {isOwn ? (
            <Link to="/settings" className="profile-edit-btn">
              <SettingsIcon size={16} /> Edit Profile
            </Link>
          ) : (
            <button className="profile-edit-btn">Follow</button>
          )}
        </div>
      </div>

      <div className="profile-posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post._id} to={`/post/${post._id}`} className="profile-grid-item">
              {post.media?.length > 0 ? (
                <img src={post.media[0].url} alt="" loading="lazy" />
              ) : (
                <div className="profile-grid-placeholder">
                  <GridIcon size={20} />
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="profile-empty">No posts yet</div>
        )}
      </div>
    </div>
  );
}
