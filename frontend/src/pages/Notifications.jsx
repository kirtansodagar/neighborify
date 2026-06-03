import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllRead } from '../store/notificationSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HeartIcon, MessageCircleIcon, UserIcon, BellIcon, AlertTriangleIcon, CalendarIcon } from '../components/Icons';

const iconMap = {
  like: HeartIcon, comment: MessageCircleIcon, follow: UserIcon,
  alert: AlertTriangleIcon, event_reminder: CalendarIcon,
};

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  if (loading && notifications.length === 0) return <LoadingSpinner />;

  return (
    <div className="notif-page">
      <div className="notif-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button className="mark-read-btn" onClick={() => dispatch(markAllRead())}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notif-list">
        {notifications.map(n => {
          const Icon = iconMap[n.type] || BellIcon;
          return (
            <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
              <div className="notif-icon-wrap">
                <Icon size={18} />
              </div>
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                {n.message && <div className="notif-message">{n.message}</div>}
                <div className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && <p className="empty-state">No notifications yet</p>}
      </div>
    </div>
  );
}
