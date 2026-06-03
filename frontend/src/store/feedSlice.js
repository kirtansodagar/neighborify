import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const initialState = {
  posts: [],
  stories: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchFeed = createAsyncThunk('feed/fetch', async ({ pincode, page = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/posts/feed?pincode=${pincode}&page=${page}&limit=20`);
    return { posts: data.data.posts, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load feed');
  }
});

export const fetchStories = createAsyncThunk('feed/fetchStories', async (pincode, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/stories?pincode=${pincode}`);
    return data.data.groups;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load stories');
  }
});

export const createPost = createAsyncThunk('feed/createPost', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.post;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const likePost = createAsyncThunk('feed/likePost', async (id, { rejectWithValue }) => {
  try {
    await api.post(`/posts/${id}/like`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to like post');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    resetFeed(state) {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.loading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.posts.length === 20;
      })
      .addCase(fetchFeed.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchStories.fulfilled, (state, action) => { state.stories = action.payload; })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload); })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload);
        if (post) post.likesCount = (post.likesCount || 0) + 1;
      });
  },
});

export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
