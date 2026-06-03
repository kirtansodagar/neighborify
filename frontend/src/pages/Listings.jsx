import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, ImageIcon } from '../components/Icons';

export default function Listings() {
  const { user } = useSelector((s) => s.auth);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'other', condition: 'good' });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/listings?pincode=${user?.pincode}`);
        setListings(data.data.listings);
      } catch {}
      setLoading(false);
    })();
  }, [user?.pincode]);

  const createListing = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/listings', { ...form, price: Number(form.price) });
      setListings(prev => [data.data.listing, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', price: '', category: 'other', condition: 'good' });
    } catch {}
  };

  if (loading) return <LoadingSpinner type="feed" count={4} />;

  return (
    <div className="listings-page">
      <div className="page-header">
        <h2>Classifieds</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <PlusIcon size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={createListing} className="form-card">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="form-input" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="form-input" rows={3} />
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (₹)" required className="form-input" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
            {['electronics', 'furniture', 'vehicles', 'home', 'books', 'services', 'other'].map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="form-input">
            {['new', 'like_new', 'good', 'fair', 'poor'].map(c => (
              <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
          <button type="submit" className="submit-btn">Post Listing</button>
        </form>
      )}

      <div className="listings-grid">
        {listings.map(item => (
          <div key={item._id} className="listing-card">
            <div className="listing-img">
              <ImageIcon size={28} />
            </div>
            <div className="listing-body">
              <h3 className="listing-title">{item.title}</h3>
              <p className="listing-price">₹{item.price?.toLocaleString()}</p>
              <div className="listing-meta">
                <span className="listing-badge">{item.condition?.replace('_', ' ')}</span>
                <span className="listing-badge">{item.category}</span>
              </div>
              <p className="listing-seller">by {item.seller?.name || 'Unknown'}</p>
            </div>
          </div>
        ))}
        {listings.length === 0 && <p className="empty-state">No listings in your area</p>}
      </div>
    </div>
  );
}
