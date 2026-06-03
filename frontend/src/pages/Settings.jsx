import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '../store/authSlice';
import { UserIcon, BellIcon, MoonIcon, SunIcon, LogOutIcon, InfoIcon } from '../components/Icons';

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', email: user?.email || '' });
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(form));
    setEditing(false);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <div className="settings-page">
      <div className="settings-section">
        <h3>Profile</h3>
        {editing ? (
          <form onSubmit={handleSave} className="settings-form">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Name" />
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input" placeholder="Bio" rows={3} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="Email" type="email" />
            <div className="settings-actions">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="settings-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Pincode:</strong> {user?.pincode}</p>
            <p><strong>Bio:</strong> {user?.bio || 'Not set'}</p>
            <p><strong>City:</strong> {user?.city || 'Not set'}</p>
            <button className="profile-edit-btn" onClick={() => setEditing(true)} style={{ marginTop: 8 }}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <button className="settings-menu-item" onClick={toggleTheme} style={{ width: '100%', textAlign: 'left' }}>
          <div className="settings-menu-icon">
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </div>
          <div className="settings-menu-text">
            <div className="settings-menu-title">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
            <div className="settings-menu-desc">Switch appearance</div>
          </div>
        </button>
      </div>

      <div className="settings-section">
        <h3>Account</h3>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOutIcon size={18} /> Log Out
        </button>
      </div>

      <div className="settings-section">
        <h3>About</h3>
        <p className="about-text"><InfoIcon size={14} /> Neighborify v1.0.0</p>
        <p className="about-text">Connect with your neighborhood</p>
      </div>
    </div>
  );
}
