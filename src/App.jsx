import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import ShortsFeed from './components/ShortsFeed';
import UploadModal from './components/UploadModal';
import { SAMPLE_VIDEOS, CATEGORIES } from './data/mockData';
import { Tv, ThumbsUp, Mic, Sparkles } from 'lucide-react';

export default function App() {
  const [videos, setVideos] = useState(SAMPLE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (currentView === 'liked') {
      return video.isLiked && matchesSearch;
    }
    if (currentView === 'subscriptions') {
      return video.isSubscribed && matchesSearch;
    }

    return matchesCategory && matchesSearch;
  });

  const handleAddVideo = (newVideo) => {
    setVideos([newVideo, ...videos]);
    setSelectedVideo(newVideo);
  };

  const handleToggleSubscribe = (channelId) => {
    setVideos(videos.map(v => {
      if (v.channel.id === channelId) {
        return {
          ...v,
          isSubscribed: !v.isSubscribed
        };
      }
      return v;
    }));
  };

  return (
    <div className="app-container">
      <Navbar 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        notificationCount={2}
        onNavigateHome={() => {
          setSelectedVideo(null);
          setCurrentView('home');
          setActiveCategory('All');
          setSearchQuery('');
        }}
      />

      <div className="main-layout">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            setSelectedVideo(null);
          }}
        />

        <main className="content-area">
          {currentView === 'shorts' ? (
            <ShortsFeed />
          ) : selectedVideo ? (
            <VideoPlayer 
              video={selectedVideo}
              allVideos={videos}
              onSelectVideo={(v) => setSelectedVideo(v)}
              onToggleSubscribe={handleToggleSubscribe}
            />
          ) : (
            <div>
              <div className="categories-bar">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {currentView === 'subscriptions' && (
                <div style={{ marginBottom: 16, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tv color="var(--brand-red)" /> Subscribed Channels Uploads
                </div>
              )}
              {currentView === 'liked' && (
                <div style={{ marginBottom: 16, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ThumbsUp color="var(--brand-red)" /> Liked Videos
                </div>
              )}

              {filteredVideos.length > 0 ? (
                <div className="video-grid">
                  {filteredVideos.map(video => (
                    <VideoCard 
                      key={video.id}
                      video={video}
                      onSelectVideo={(v) => setSelectedVideo(v)}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Sparkles size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <h2>No videos found</h2>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: 16 }}
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)}
          onAddVideo={handleAddVideo}
        />
      )}

      {isVoiceModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsVoiceModalOpen(false)}>
          <div className="modal-card voice-modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem' }}>Listening...</h3>
            <div className="mic-pulse-circle">
              <Mic size={36} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Say something like "Cyberpunk Lo-Fi" or "Build AI agents in React"
            </p>
            <button className="btn-secondary" onClick={() => setIsVoiceModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
