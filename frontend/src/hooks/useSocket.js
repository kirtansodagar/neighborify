import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, updateLastMessage } from '../store/chatSlice';
import { addNotification } from '../store/notificationSlice';

export default function useSocket() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((s) => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => console.log('Socket connected'));

    socket.on('chat:message', (message) => {
      const chatId = message.chat;
      dispatch(addMessage({ chatId, message }));
      dispatch(updateLastMessage({ chatId, message }));
    });

    socket.on('chat:typing', ({ userId, isTyping }) => {
      console.log('Typing:', userId, isTyping);
    });

    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on('disconnect', () => console.log('Socket disconnected'));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token, dispatch]);

  const emit = (event, data) => {
    socketRef.current?.emit(event, data);
  };

  const joinChat = (chatId) => {
    socketRef.current?.emit('chat:join', chatId);
  };

  const leaveChat = (chatId) => {
    socketRef.current?.emit('chat:leave', chatId);
  };

  const sendMessage = (chatId, content) => {
    socketRef.current?.emit('chat:message', { chatId, content });
  };

  const sendTyping = (chatId, isTyping) => {
    socketRef.current?.emit('chat:typing', { chatId, isTyping });
  };

  return { socket: socketRef.current, emit, joinChat, leaveChat, sendMessage, sendTyping };
}
