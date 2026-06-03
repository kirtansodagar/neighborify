export default function StoryCircle({ group, onClick, isSeen }) {
  const { user, stories } = group || {};
  if (!user) return null;

  const hasUnseen = !isSeen && stories?.some(s => {
    try { return new Date(s.expiresAt) > new Date(); }
    catch { return true; }
  });

  return (
    <button className={`story-circle ${hasUnseen ? 'unseen' : 'seen'}`} onClick={onClick}>
      <div className={`story-ring ${hasUnseen ? 'story-ring-active' : 'story-ring-seen'}`}>
        <div className="story-avatar-wrap">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="story-avatar-img" />
          ) : (
            <span className="story-avatar-text">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
          )}
        </div>
      </div>
      <span className="story-name">{user.name?.split(' ')[0] || 'User'}</span>
    </button>
  );
}
