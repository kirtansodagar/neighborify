import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFeed, fetchStories } from '../store/feedSlice';
import PostCard from '../components/PostCard';
import StoryCircle from '../components/StoryCircle';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPinIcon, CalendarIcon, MessageSquareIcon, AlertTriangleIcon } from '../components/Icons';

const quickLinks = [
  { to: '/alerts', icon: AlertTriangleIcon, label: 'Alerts', color: '#DC2626', bg: '#FEE2E2' },
  { to: '/events', icon: CalendarIcon, label: 'Events', color: '#2563EB', bg: '#DBEAFE' },
  { to: '/forums', icon: MessageSquareIcon, label: 'Forums', color: '#059669', bg: '#D1FAE5' },
  { to: '/neighbors', icon: MapPinIcon, label: 'Neighbors', color: '#D97706', bg: '#FEF3C7' },
];

export default function Feed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { posts, stories, loading, page, hasMore } = useSelector((s) => s.feed);

  useEffect(() => {
    if (user?.pincode) {
      dispatch(fetchFeed({ pincode: user.pincode, page: 1 }));
      dispatch(fetchStories(user.pincode));
    }
  }, [dispatch, user?.pincode]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchFeed({ pincode: user.pincode, page: page + 1 }));
    }
  }, [dispatch, loading, hasMore, page, user?.pincode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const currentStories = stories?.filter(g =>
    g.stories?.some(s => { try { return new Date(s.expiresAt) > new Date(); } catch { return true; } })
  ) || [];

  return (
    <div className="feed-page">
      {currentStories.length > 0 && (
        <div className="stories-section">
          <div className="stories-row">
            {currentStories.map((group, i) => (
              <StoryCircle
                key={group.user?._id || i}
                group={group}
                onClick={() => navigate('/stories')}
              />
            ))}
          </div>
        </div>
      )}

      <div className="feed-quick-actions">
        {quickLinks.map(({ to, icon: Icon, label, color, bg }) => (
          <Link key={to} to={to} className="feed-quick-btn">
            <div className="feed-quick-icon" style={{ background: bg, color }}>
              <Icon size={18} />
            </div>
            {label}
          </Link>
        ))}
      </div>

      <div className="feed-posts">
        {loading && posts.length === 0 ? (
          <LoadingSpinner type="feed" count={3} />
        ) : (
          <>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
            {loading && <LoadingSpinner type="feed" count={1} />}
            {!hasMore && posts.length > 0 && (
              <p className="feed-end">You're all caught up</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
