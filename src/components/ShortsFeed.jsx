import React, { useState, useRef } from 'react';
import { 
  Heart, MessageSquare, Share2, Repeat, 
  Volume2, VolumeX, ChevronUp, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { SHORTS_DATA } from '../data/mockData';

export default function ShortsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedShorts, setLikedShorts] = useState({});
  const videoRef = useRef(null);

  const currentShort = SHORTS_DATA[currentIndex];

  const handleNext = () => {
    if (currentIndex < SHORTS_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = (id) => {
    setLikedShorts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="shorts-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="action-icon-circle" onClick={handlePrev} title="Previous Short">
          <ChevronUp size={24} />
        </button>
        <button className="action-icon-circle" onClick={handleNext} title="Next Short">
          <ChevronDown size={24} />
        </button>
      </div>

      <div className="short-card-reel">
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          poster={currentShort.thumbnail}
          className="short-video"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) videoRef.current.play();
              else videoRef.current.pause();
            }
          }}
        />

        <button 
          className="icon-btn" 
          onClick={() => setIsMuted(!isMuted)}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: 'rgba(0,0,0,0.5)' }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="short-overlay-details">
          <div className="short-channel-row">
            <img 
              src={currentShort.avatar} 
              alt={currentShort.channel} 
              style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #fff' }}
            />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>@{currentShort.channel}</span>
            <CheckCircle2 size={14} color="#3ea6ff" />
            <button className="subscribe-btn" style={{ padding: '6px 14px', fontSize: '0.75rem', marginLeft: 8 }}>
              Subscribe
            </button>
          </div>

          <div className="short-title">{currentShort.title}</div>
        </div>
      </div>

      <div className="shorts-actions-side">
        <button 
          className="action-icon-btn"
          onClick={() => toggleLike(currentShort.id)}
        >
          <div className="action-icon-circle" style={{ color: likedShorts[currentShort.id] ? 'var(--brand-red)' : '#fff' }}>
            <Heart size={22} fill={likedShorts[currentShort.id] ? 'currentColor' : 'none'} />
          </div>
          <span>{currentShort.likes}</span>
        </button>

        <button className="action-icon-btn">
          <div className="action-icon-circle">
            <MessageSquare size={22} />
          </div>
          <span>{currentShort.comments}</span>
        </button>

        <button className="action-icon-btn">
          <div className="action-icon-circle">
            <Share2 size={22} />
          </div>
          <span>{currentShort.shares}</span>
        </button>

        <button className="action-icon-btn">
          <div className="action-icon-circle">
            <Repeat size={22} />
          </div>
          <span>Remix</span>
        </button>
      </div>
    </div>
  );
}
