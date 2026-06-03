import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, MessageCircleIcon, ShareIcon, BookmarkIcon, MoreHorizontalIcon, PlayIcon } from './Icons';

export default function PostCard({ post, detailView }) {
  const { author, content, media, type, likesCount, commentsCount, sharesCount, createdAt, alertType, _id } = post || {};
  const [liked, setLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const lastTap = useRef(0);
  const heartRef = useRef(null);

  const timeAgo = (() => {
    try { return formatDistanceToNow(new Date(createdAt), { addSuffix: true }); }
    catch { return ''; }
  })();

  const alertColors = { safety: '#DC2626', lost_found: '#EA580C', traffic: '#D97706', utility: '#2563EB', weather: '#0891B2', general: '#6B7280' };

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setLiked(true);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTap.current = now;
  }, []);

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(p => !p);
    if (!liked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
  };

  return (
    <article className={`post-card ${type === 'alert' ? 'post-alert' : ''}`}>
      <div className="post-header">
        <Link to={`/profile/${author?._id}`} className="post-author-link">
          <div className="post-avatar-ring">
            <div className="post-avatar">{author?.name?.charAt(0)?.toUpperCase() || '?'}</div>
          </div>
          <div className="post-author-info">
            <span className="post-author-name">{author?.name || 'Unknown'}</span>
            <span className="post-location">{author?.neighborhood || author?.pincode || ''}</span>
          </div>
        </Link>
        <div className="post-header-right">
          {type === 'alert' && alertType && (
            <span className="post-alert-badge" style={{ background: alertColors[alertType] || '#6B7280' }}>
              {alertType.replace('_', ' ')}
            </span>
          )}
          <button className="post-more-btn" aria-label="More">
            <MoreHorizontalIcon size={18} />
          </button>
        </div>
      </div>

      {content && <div className="post-content"><p>{content}</p></div>}

      {media?.length > 0 && (
        <div className="post-media" onClick={handleDoubleTap}>
          {media[0].type === 'video' ? (
            <div className="post-video-wrap">
              <video src={media[0].url} controls className="post-img" />
              <div className="post-play-overlay"><PlayIcon size={32} /></div>
            </div>
          ) : (
            <img src={media[0].url} alt="" className="post-img" loading="lazy" />
          )}
          {showHeartAnim && (
            <div className="post-heart-burst" ref={heartRef}>
              <HeartIcon size={80} fill="#fff" />
            </div>
          )}
        </div>
      )}

      <div className="post-actions-bar">
        <div className="post-actions-left">
          <button className={`post-action-btn ${liked ? 'liked' : ''}`} onClick={toggleLike} aria-label="Like">
            <HeartIcon size={22} fill={liked ? '#EF4444' : 'none'} />
          </button>
          <Link to={`/post/${_id}`} className="post-action-btn" aria-label="Comment">
            <MessageCircleIcon size={22} />
          </Link>
          <button className="post-action-btn" aria-label="Share">
            <ShareIcon size={20} />
          </button>
        </div>
        <button className={`post-action-btn ${bookmarked ? 'bookmarked' : ''}`} onClick={() => setBookmarked(p => !p)} aria-label="Save">
          <BookmarkIcon size={20} fill={bookmarked ? 'var(--color-primary)' : 'none'} />
        </button>
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span className="post-stat"><strong>{likesCount + (liked && !(post?.likedByUser) ? 1 : 0) || 0}</strong> likes</span>
          {!detailView && commentsCount > 0 && (
            <Link to={`/post/${_id}`} className="post-stat-link">
              <strong>{commentsCount}</strong> {commentsCount === 1 ? 'comment' : 'comments'}
            </Link>
          )}
        </div>
        {!detailView && content && (
          <Link to={`/post/${_id}`} className="post-caption-link">
            <strong>{author?.name || 'Unknown'}</strong> {content.length > 150 ? content.slice(0, 150) + '...' : content}
          </Link>
        )}
        <span className="post-time">{timeAgo}</span>
      </div>
    </article>
  );
}
