import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import useSocket from '../hooks/useSocket';

export default function Layout() {
  useSocket();

  return (
    <div className="app-layout">
      <TopBar />
      <main className="main-content page-container">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
