import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '+91', pincode: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirmPassword) return setLocalError('Passwords do not match');
    if (form.password.length < 8) return setLocalError('Password must be at least 8 characters');
    const result = await dispatch(registerUser({
      name: form.name, phone: form.phone, pincode: form.pincode, password: form.password
    }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91XXXXXXXXXX' },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '6-digit pincode', maxLength: 6 },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 characters' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <div className="auth-logo-icon">🏘️</div>
        </div>
        <h1 className="auth-title">Join Neighborify</h1>
        <p className="auth-subtitle">Connect with people around you</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {fields.map(f => (
            <div key={f.name} className="auth-field">
              <label>{f.label}</label>
              <input
                type={f.type} name={f.name} value={form[f.name]}
                onChange={handleChange} placeholder={f.placeholder}
                required maxLength={f.maxLength} className="auth-input"
              />
            </div>
          ))}
          {(error || localError) && <p className="auth-error">{localError || error}</p>}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
