import React, { useState, useRef } from 'react';
import { CheckCircle2, MoreVertical } from 'lucide-react';

export default function VideoCard({ video, onSelectVideo }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="video-card"
      onClick={() => onSelectVideo(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="thumbnail-wrapper">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="thumbnail-img"
          loading="lazy"
        />

        {isHovered && video.previewUrl && (
          <video
            ref={videoRef}
            src={video.previewUrl}
            muted
            loop
            playsInline
            className="hover-preview-video"
          />
        )}

        {video.isLive ? (
          <span className="live-badge">LIVE</span>
        ) : (
          <span className="duration-badge">{video.duration}</span>
        )}
      </div>

      <div className="video-info">
        <img 
          src={video.channel.avatar} 
          alt={video.channel.name} 
          className="channel-avatar" 
        />

        <div className="video-details">
          <h3 className="video-title" title={video.title}>
            {video.title}
          </h3>

          <div className="channel-name-row">
            <span>{video.channel.name}</span>
            {video.channel.verified && (
              <CheckCircle2 className="verified-icon" size={14} />
            )}
          </div>

          <div className="video-meta">
            <span>{video.views}</span>
            <span style={{ margin: '0 4px' }}>•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>

        <button 
          className="icon-btn" 
          style={{ width: 28, height: 28, marginLeft: 'auto', flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
