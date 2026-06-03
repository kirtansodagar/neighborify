export default function LoadingSpinner({ type = 'spinner', count = 1 }) {
  if (type === 'spinner') {
    return (
      <div className="loading-wrap">
        <div className="spinner spinner-lg" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (type === 'feed') {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-feed">
        <div className="skeleton-feed-header">
          <div className="skeleton skeleton-circle" style={{ width: 36, height: 36 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text" style={{ width: '25%', height: 10 }} />
          </div>
        </div>
        <div className="skeleton skeleton-card" style={{ height: 200, margin: '8px 0' }} />
        <div className="skeleton-feed-actions">
          <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 4 }} />
        </div>
      </div>
    ));
  }

  if (type === 'profile') {
    return (
      <div className="skeleton-profile">
        <div className="skeleton-profile-header">
          <div className="skeleton skeleton-circle" style={{ width: 72, height: 72, margin: '0 auto' }} />
          <div className="skeleton skeleton-text" style={{ width: '50%', margin: '12px auto 8px' }} />
          <div className="skeleton skeleton-text" style={{ width: '70%', margin: '0 auto' }} />
        </div>
        <div className="skeleton-profile-stats">
          <div className="skeleton" style={{ width: 60, height: 32, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 60, height: 32, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 60, height: 32, borderRadius: 6 }} />
        </div>
      </div>
    );
  }

  if (type === 'chat') {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-chat-item">
        <div className="skeleton skeleton-circle" style={{ width: 44, height: 44, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ width: '35%' }} />
          <div className="skeleton skeleton-text" style={{ width: '60%', height: 10 }} />
        </div>
      </div>
    ));
  }

  return (
    <div className="loading-wrap">
      <div className="spinner" />
    </div>
  );
}
