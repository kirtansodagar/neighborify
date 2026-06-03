import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, PlusIcon, MessageCircleIcon, UserIcon } from './Icons';

const tabs = [
  { to: '/', icon: HomeIcon, label: 'Home', end: true },
  { to: '/neighbors', icon: SearchIcon, label: 'Explore', end: true },
  { to: '/create', icon: null, label: '', isCreate: true },
  { to: '/chat', icon: MessageCircleIcon, label: 'Messages', end: true },
  { to: '/profile', icon: UserIcon, label: 'Profile', end: false },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav glass">
      {tabs.map(({ to, icon: Icon, label, end, isCreate }) =>
        isCreate ? (
          <NavLink key={to} to={to} className="nav-create-btn" aria-label="Create Post">
            <div className="create-icon-wrap">
              <PlusIcon size={22} />
            </div>
          </NavLink>
        ) : (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={22} />
            <span className="nav-label">{label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
