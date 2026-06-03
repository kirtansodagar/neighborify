import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BellIcon, SettingsIcon, ArrowLeftIcon } from './Icons';

const titles = {
  '/': 'Neighborify', '/stories': 'Stories', '/create': 'Create Post',
  '/chat': 'Messages', '/events': 'Events', '/forums': 'Forums',
  '/listings': 'Classifieds', '/notifications': 'Notifications',
  '/settings': 'Settings', '/neighbors': 'Neighbors', '/alerts': 'Alerts'
};

export default function TopBar() {
  const { user } = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notifications);
  const location = useLocation();

  const path = '/' + location.pathname.split('/')[1];
  const isChild = location.pathname.split('/').length > 2 && path !== '/';
  const title = titles[path] || 'Neighborify';

  return (
    <header className="topbar glass">
      <div className="topbar-inner">
        <div className="topbar-left">
          {isChild ? (
            <Link to="/" className="topbar-back" aria-label="Back">
              <ArrowLeftIcon size={22} />
            </Link>
          ) : (
            <Link to="/" className="topbar-brand">
              <span className="topbar-logo" />
              <span className="topbar-title">{title}</span>
            </Link>
          )}
        </div>
        <div className="topbar-right">
          <Link to="/notifications" className="topbar-icon-btn" aria-label="Notifications">
            <BellIcon size={22} />
            {unreadCount > 0 && <span className="topbar-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </Link>
          <Link to="/settings" className="topbar-icon-btn" aria-label="Settings">
            <SettingsIcon size={20} />
          </Link>
          {user && (
            <Link to="/profile" className="topbar-avatar-link">
              <div className="topbar-avatar">{user.name?.charAt(0)?.toUpperCase() || '?'}</div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
