import React from 'react';
import { 
  Home, Flame, Tv, Folder, History, Clock, 
  ThumbsUp, Compass, Music, Gamepad2, Cpu, Settings 
} from 'lucide-react';

export default function Sidebar({ isCollapsed, currentView, setCurrentView }) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shorts', label: 'Shorts', icon: Flame },
    { id: 'subscriptions', label: 'Subscriptions', icon: Tv }
  ];

  const libraryItems = [
    { id: 'library', label: 'Library', icon: Folder },
    { id: 'history', label: 'History', icon: History },
    { id: 'watch-later', label: 'Watch Later', icon: Clock },
    { id: 'liked', label: 'Liked Videos', icon: ThumbsUp }
  ];

  const exploreItems = [
    { id: 'trending', label: 'Trending', icon: Compass },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'tech', label: 'Tech & AI', icon: Cpu }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-section">
        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <div 
              key={item.id} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="sidebar-section">
        {!isCollapsed && <div className="sidebar-section-title">You</div>}
        {libraryItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <div 
              key={item.id} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="sidebar-section">
        {!isCollapsed && <div className="sidebar-section-title">Explore</div>}
        {exploreItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <div 
              key={item.id} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {!isCollapsed && (
        <div style={{ marginTop: 'auto', paddingTop: '16px', fontSize: '0.72rem', color: 'var(--text-subtle)', paddingLeft: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
            <Settings size={16} /> Settings
          </div>
          <div>© 2026 YouTube Studio Pro</div>
        </div>
      )}
    </aside>
  );
}
