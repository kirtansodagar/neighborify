import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const initialState = {
  chats: [],
  messages: {},
  activeChat: null,
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/chats');
    return data.data.chats;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load chats');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ chatId, page = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/chats/${chatId}/messages?page=${page}&limit=50`);
    return { chatId, messages: data.data.messages, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load messages');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat(state, action) { state.activeChat = action.payload; },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) state.messages[chatId] = [];
      state.messages[chatId].push(message);
    },
    updateLastMessage(state, action) {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c._id === chatId);
      if (chat) chat.lastMessage = { content: message.content, sender: message.sender, sentAt: message.createdAt };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => { state.chats = action.payload; })
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state) => { state.loading = false; });
  },
});

export const { setActiveChat, addMessage, updateLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
