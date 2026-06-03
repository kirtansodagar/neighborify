import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, MapPinIcon, UsersIcon, CalendarIcon } from '../components/Icons';

export default function Events() {
  const { user } = useSelector((s) => s.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', eventType: 'meetup', location: '', startDate: '', endDate: '' });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/events?pincode=${user?.pincode}`);
        setEvents(data.data.events);
      } catch {}
      setLoading(false);
    })();
  }, [user?.pincode]);

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/events', form);
      setEvents(prev => [data.data.event, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', eventType: 'meetup', location: '', startDate: '', endDate: '' });
    } catch {}
  };

  const rsvp = async (id) => {
    try {
      const { data } = await api.post(`/events/${id}/rsvp`);
      setEvents(prev => prev.map(e =>
        e._id === id
          ? { ...e, attendees: data.data.attending ? [...(e.attendees || []), user._id] : (e.attendees || []).filter(a => a !== user._id) }
          : e
      ));
    } catch {}
  };

  if (loading) return <LoadingSpinner type="feed" count={3} />;

  return (
    <div className="events-page">
      <div className="page-header">
        <h2>Events</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <PlusIcon size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={createEvent} className="form-card">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" required className="form-input" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="form-input" rows={3} />
          <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="form-input">
            {['meetup', 'festival', 'sports', 'workshop', 'volunteering', 'other'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="form-input" />
          <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="form-input" />
          <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="form-input" />
          <button type="submit" className="submit-btn">Create Event</button>
        </form>
      )}

      <div className="events-list">
        {events.map((event) => {
          const start = new Date(event.startDate);
          const isAttending = event.attendees?.includes(user?._id);
          return (
            <div key={event._id} className="event-card">
              <div className="event-date-badge">
                <span className="event-month">{start.toLocaleString('default', { month: 'short' })}</span>
                <span className="event-day">{start.getDate()}</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                {event.location && (
                  <p className="event-meta"><MapPinIcon size={14} /> {event.location.name || event.location}</p>
                )}
                <p className="event-meta"><UsersIcon size={14} /> {event.attendees?.length || 0}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''}</p>
                <button className={`event-rsvp-btn ${isAttending ? 'attending' : ''}`} onClick={() => rsvp(event._id)}>
                  {isAttending ? '✓ Attending' : 'RSVP'}
                </button>
              </div>
            </div>
          );
        })}
        {events.length === 0 && <p className="empty-state">No events in your area</p>}
      </div>
    </div>
  );
}
