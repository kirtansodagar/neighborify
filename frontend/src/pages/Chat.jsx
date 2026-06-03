import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../store/chatSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Chat() {
  const dispatch = useDispatch();
  const { chats, loading } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchChats()); }, [dispatch]);

  if (loading && chats.length === 0) return <LoadingSpinner type="chat" count={5} />;

  return (
    <div className="chat-page">
      <div className="chat-list">
        {chats.map((chat) => {
          const other = chat.participants?.find(p => p._id !== user?._id);
          const time = chat.lastMessage?.sentAt
            ? new Date(chat.lastMessage.sentAt).toLocaleDateString()
            : '';
          return (
            <Link key={chat._id} to={`/chat/${chat._id}`} className="chat-item">
              <div className="chat-avatar-ring">
                <div className="chat-avatar">{other?.name?.charAt(0)?.toUpperCase() || '?'}</div>
              </div>
              <div className="chat-info">
                <div className="chat-name">{other?.name || 'Unknown'}</div>
                <div className="chat-last-msg">
                  {chat.lastMessage?.content?.substring(0, 50) || 'No messages yet'}
                </div>
              </div>
              {time && <span className="chat-time">{time}</span>}
            </Link>
          );
        })}
        {chats.length === 0 && !loading && (
          <div className="chat-empty">No conversations yet. Find neighbors to chat with!</div>
        )}
      </div>
    </div>
  );
}
