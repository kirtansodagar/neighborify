import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Stories from './pages/Stories';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ChatWindow from './pages/ChatWindow';
import Events from './pages/Events';
import Forums from './pages/Forums';
import ForumDetail from './pages/ForumDetail';
import Listings from './pages/Listings';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Neighbors from './pages/Neighbors';
import Alerts from './pages/Alerts';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Feed />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatWindow />} />
        <Route path="/events" element={<Events />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/forums/:id" element={<ForumDetail />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/neighbors" element={<Neighbors />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
