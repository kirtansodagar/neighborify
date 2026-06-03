import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../store/feedSlice';
import { XIcon } from '../components/Icons';

export default function Stories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stories } = useSelector((s) => s.feed);
  const { user } = useSelector((s) => s.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => { dispatch(fetchStories(user?.pincode)); }, [dispatch, user?.pincode]);

  const activeStories = stories?.filter(g => g.stories?.length > 0) || [];
  const currentGroup = activeStories[currentIndex];
  const currentStory = currentGroup?.stories?.[storyIndex];

  const goNext = useCallback(() => {
    if (!currentGroup) return;
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(s => s + 1);
    } else if (currentIndex < activeStories.length - 1) {
      setCurrentIndex(i => i + 1);
      setStoryIndex(0);
    } else {
      navigate(-1);
    }
  }, [storyIndex, currentIndex, currentGroup, activeStories.length, navigate]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex(s => s - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setStoryIndex((activeStories[currentIndex - 1]?.stories?.length || 1) - 1);
    }
  }, [storyIndex, currentIndex, activeStories]);

  useEffect(() => {
    if (!currentStory) return;
    const timer = setTimeout(goNext, 5000);
    return () => clearTimeout(timer);
  }, [currentStory, goNext]);

  const handleClose = () => navigate(-1);

  return (
    <div className="stories-view">
      <div className="stories-progress-bar">
        {currentGroup?.stories?.map((_, i) => (
          <div key={i} className={`stories-progress-segment ${i < storyIndex ? 'watched' : i === storyIndex ? 'active' : ''}`}>
            <div className="stories-progress-fill" />
          </div>
        ))}
      </div>

      <div className="stories-top-bar">
        <div className="stories-user-info">
          <div className="stories-user-avatar">
            {currentGroup?.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span className="stories-user-name">{currentGroup?.user?.name || 'User'}</span>
        </div>
        <button className="stories-close-btn" onClick={handleClose} aria-label="Close">
          <XIcon size={22} />
        </button>
      </div>

      <div className="stories-media-wrap">
        {currentStory?.media?.url && (
          <img src={currentStory.media.url} alt="" className="stories-media" />
        )}
        {currentStory?.caption && (
          <div className="stories-caption">{currentStory.caption}</div>
        )}
      </div>

      <div className="stories-nav-area">
        <div className="stories-nav-half" onClick={goPrev} />
        <div className="stories-nav-half" onClick={goNext} />
      </div>
    </div>
  );
}
