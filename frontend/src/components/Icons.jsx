const s = { fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };

export function HomeIcon({ size = 24, fill: f }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s} fill={f || 'none'}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
export function SearchIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}
export function PlusIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
export function HeartIcon({ size = 24, fill: f }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s} fill={f || 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
}
export function MessageCircleIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
}
export function UserIcon({ size = 24, fill: f }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s} fill={f || 'none'}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
export function BellIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
}
export function SettingsIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m17.66-7.66l-1.41 1.41M6.34 17.66l-1.41 1.41m14.14 0l-1.41-1.41M6.34 6.34L4.93 4.93" /></svg>;
}
export function ArrowLeftIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
}
export function MoreHorizontalIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>;
}
export function SendIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
export function BookmarkIcon({ size = 24, fill: f }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s} fill={f || 'none'}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;
}
export function MessageSquareIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
}
export function ShareIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
}
export function CameraIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>;
}
export function MapPinIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
export function CalendarIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
export function UsersIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
}
export function AlertTriangleIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
export function EditIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
export function TrashIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
}
export function XIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
export function CheckIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="20 6 9 17 4 12" /></svg>;
}
export function MoonIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>;
}
export function SunIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
}
export function LogOutIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
export function GridIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
}
export function ClockIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
export function ChevronLeftIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6" /></svg>;
}
export function ChevronRightIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6" /></svg>;
}
export function HashIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>;
}
export function ImageIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
export function VideoIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
}
export function PlayIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
export function FilterIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
}
export function EyeIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
export function RefreshIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>;
}
export function InfoIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
}
export function PhoneIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;
}
export function LockIcon({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
}
