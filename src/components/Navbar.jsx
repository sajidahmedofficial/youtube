import React, { useState } from 'react';
import { 
  Menu, Search, Mic, Video, Bell, User, X, 
  Sparkles, SlidersHorizontal, CheckCircle2 
} from 'lucide-react';

export default function Navbar({ 
  toggleSidebar, 
  searchQuery, 
  setSearchQuery, 
  onOpenUploadModal, 
  onOpenVoiceModal,
  notificationCount,
  onNavigateHome
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const sampleNotifications = [
    { id: 1, text: "TechVision Labs uploaded: Building AI Agents in 2026", time: "10 mins ago", unread: true },
    { id: 2, text: "Neon Nights Radio is now live: 24/7 Lo-Fi Beats", time: "1 hour ago", unread: true },
    { id: 3, text: "Your comment on 'Quantum Pro Headset' received 45 likes", time: "3 hours ago", unread: false }
  ];

  return (
    <header className="navbar">
      <div className="nav-left">
        <button 
          className="icon-btn" 
          onClick={toggleSidebar} 
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="brand-logo" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
          <div className="logo-badge">
            <Video size={18} fill="#ffffff" />
          </div>
          <span>YouTube</span>
          <span className="pro-text">Studio Pro</span>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-box-container">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search videos, creators, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={handleClearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
          <button className="search-btn" title="Search">
            <Search size={18} />
          </button>
        </div>

        <button 
          className="icon-btn voice-btn" 
          onClick={onOpenVoiceModal} 
          title="Search with Voice"
        >
          <Mic size={18} />
        </button>
      </div>

      <div className="nav-right">
        <button className="create-btn" onClick={onOpenUploadModal}>
          <Sparkles size={16} color="#ff0033" />
          <span>Create</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)} 
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'var(--brand-red)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 5px',
                lineHeight: 1
              }}>
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setShowNotifications(false)}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sampleNotifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: n.unread ? 'rgba(255, 0, 51, 0.08)' : 'transparent',
                    fontSize: '0.82rem',
                    borderLeft: n.unread ? '3px solid var(--brand-red)' : 'none'
                  }}>
                    <div>{n.text}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="User Profile" 
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          />

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '240px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Alex Developer</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>alex@antigravity.dev</div>
              </div>
              <button className="sidebar-item" style={{ padding: '8px' }}>
                <User size={16} /> Your Channel
              </button>
              <button className="sidebar-item" style={{ padding: '8px' }}>
                <Sparkles size={16} /> YouTube Studio
              </button>
              <button className="sidebar-item" style={{ padding: '8px', color: 'var(--brand-red)' }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
