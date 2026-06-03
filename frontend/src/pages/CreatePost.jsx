import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/feedSlice';
import { ImageIcon, VideoIcon, AlertTriangleIcon, HashIcon } from '../components/Icons';

const postTypes = [
  { key: 'text', icon: HashIcon, label: 'Text' },
  { key: 'image', icon: ImageIcon, label: 'Media' },
  { key: 'alert', icon: AlertTriangleIcon, label: 'Alert' },
];

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [type, setType] = useState('text');
  const [alertType, setAlertType] = useState('general');
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.feed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);
    if (type === 'alert') formData.append('alertType', alertType);
    files.forEach(f => formData.append('media', f));
    const result = await dispatch(createPost(formData));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div className="create-page">
      <h2 className="create-page-title">Create Post</h2>

      <div className="create-type-selector">
        {postTypes.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`create-type-btn ${type === key ? 'active' : ''}`}
            onClick={() => setType(key)}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={5000}
          rows={5}
          required
          className="create-textarea"
        />

        {type === 'image' && (
          <label className="create-file-label">
            <ImageIcon size={20} />
            {files.length > 0 ? `${files.length} file(s) selected` : 'Tap to add photos or videos'}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setFiles([...e.target.files])}
              className="create-file-input"
            />
          </label>
        )}

        {type === 'alert' && (
          <select value={alertType} onChange={(e) => setAlertType(e.target.value)} className="create-select">
            <option value="general">General</option>
            <option value="safety">Safety</option>
            <option value="lost_found">Lost & Found</option>
            <option value="traffic">Traffic</option>
            <option value="utility">Utility</option>
            <option value="weather">Weather</option>
          </select>
        )}

        <button type="submit" className="create-submit-btn" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post to Neighborhood'}
        </button>
      </form>
    </div>
  );
}
