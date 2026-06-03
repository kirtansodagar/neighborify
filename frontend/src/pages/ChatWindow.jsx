import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, setActiveChat } from '../store/chatSlice';
import useSocket from '../hooks/useSocket';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeftIcon, SendIcon } from '../components/Icons';

export default function ChatWindow() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, loading, chats } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const { joinChat, leaveChat, sendMessage: socketSend } = useSocket();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const chat = chats.find(c => c._id === id);
  const other = chat?.participants?.find(p => p._id !== user?._id);
  const chatMessages = messages[id] || [];

  useEffect(() => {
    dispatch(setActiveChat(id));
    dispatch(fetchMessages({ chatId: id, page: 1 }));
    joinChat(id);
    return () => { leaveChat(id); dispatch(setActiveChat(null)); };
  }, [id, dispatch, joinChat, leaveChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages.length]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socketSend(id, text);
    setText('');
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <button className="chat-window-back" onClick={() => navigate('/chat')} aria-label="Back">
          <ArrowLeftIcon size={22} />
        </button>
        <div className="chat-window-info">
          <div className="chat-window-name">{other?.name || 'Chat'}</div>
          <div className="chat-window-status">{other?.neighborhood || other?.pincode || ''}</div>
        </div>
      </div>

      <div className="chat-messages">
        {loading && chatMessages.length === 0 ? (
          <LoadingSpinner />
        ) : (
          chatMessages.map((msg) => (
            <div key={msg._id} className={`message ${msg.sender?._id === user?._id ? 'own' : ''}`}>
              <div className="message-text">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={send} className="chat-input-bar">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="chat-input-field"
        />
        <button type="submit" className="chat-send-btn" disabled={!text.trim()}>
          <SendIcon size={18} />
        </button>
      </form>
    </div>
  );
}
