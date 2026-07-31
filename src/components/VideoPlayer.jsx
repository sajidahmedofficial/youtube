import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  ThumbsUp, ThumbsDown, Share2, Bookmark, 
  Download, CheckCircle2, ChevronDown, ChevronUp, Monitor
} from 'lucide-react';
import CommentsSection from './CommentsSection';

export default function VideoPlayer({ video, allVideos, onSelectVideo, onToggleSubscribe }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likedState, setLikedState] = useState(video.isLiked ? 'liked' : null);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed);

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    setLikedState(video.isLiked ? 'liked' : null);
    setLikeCount(video.likes);
    setIsSubscribed(video.isSubscribed);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleLikeToggle = () => {
    if (likedState === 'liked') {
      setLikedState(null);
      setLikeCount(prev => prev - 1);
    } else {
      setLikedState('liked');
      setLikeCount(prev => prev + 1);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (onToggleSubscribe) onToggleSubscribe(video.channel.id);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const recommendedVideos = allVideos.filter(v => v.id !== video.id);

  return (
    <div className={`watch-container ${isTheaterMode ? 'theater-mode' : ''}`}>
      <div className="player-section">
        <div className="custom-player-wrapper">
          <div className="ambient-glow" />

          <video
            ref={videoRef}
            src={video.videoUrl}
            className="main-video-element"
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          <div className="player-controls-overlay">
            <div className="progress-bar-container" onClick={handleSeek}>
              <div 
                className="progress-filled" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="progress-scrubber" />
              </div>
            </div>

            <div className="controls-row">
              <div className="controls-left">
                <button className="icon-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <div className="volume-wrapper">
                  <button className="icon-btn" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={isMuted ? 0 : volume} 
                    onChange={handleVolumeChange}
                    className="volume-slider" 
                  />
                </div>

                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="controls-right">
                <select 
                  value={playbackSpeed} 
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>

                <button 
                  className="icon-btn" 
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  title="Theater mode"
                >
                  <Monitor size={18} />
                </button>

                <button 
                  className="icon-btn" 
                  onClick={toggleFullscreen}
                  title="Fullscreen"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="video-watch-details">
          <h1 className="watch-title">{video.title}</h1>

          <div className="watch-action-bar">
            <div className="channel-info-left">
              <img 
                src={video.channel.avatar} 
                alt={video.channel.name} 
                className="channel-avatar" 
                style={{ width: 44, height: 44 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {video.channel.name}
                  {video.channel.verified && <CheckCircle2 size={14} color="var(--text-muted)" />}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {video.channel.subscribers}
                </div>
              </div>

              <button 
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="action-buttons-right">
              <div className="like-dislike-group">
                <button onClick={handleLikeToggle} style={{ color: likedState === 'liked' ? 'var(--brand-red)' : 'inherit' }}>
                  <ThumbsUp size={16} fill={likedState === 'liked' ? 'currentColor' : 'none'} />
                  <span>{likeCount.toLocaleString()}</span>
                </button>
                <div className="divider" />
                <button onClick={() => setLikedState(likedState === 'disliked' ? null : 'disliked')}>
                  <ThumbsDown size={16} fill={likedState === 'disliked' ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button className="btn-pill" onClick={() => setShowShareModal(true)}>
                <Share2 size={16} />
                <span>Share</span>
              </button>

              <button className="btn-pill">
                <Bookmark size={16} />
                <span>Save</span>
              </button>

              <button className="btn-pill">
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <div 
          className="description-box" 
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          <div className="description-header">
            <span>{video.views}</span>
            <span>{video.uploadedAt}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              {isDescriptionExpanded ? 'Show less' : 'Show more'}
              {isDescriptionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>

          <div className="description-text">
            {isDescriptionExpanded 
              ? video.description 
              : video.description.slice(0, 140) + "..."}
          </div>

          <div className="tags-row">
            {video.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>

        <CommentsSection />
      </div>

      <div className="recommended-sidebar">
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>
          Up Next
        </div>

        {recommendedVideos.map(rec => (
          <div 
            key={rec.id} 
            className="rec-card"
            onClick={() => onSelectVideo(rec)}
          >
            <div className="rec-thumbnail">
              <img src={rec.thumbnail} alt={rec.title} />
              <span className="duration-badge">{rec.duration}</span>
            </div>

            <div className="rec-info">
              <div className="rec-title">{rec.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rec.channel.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.views} • {rec.uploadedAt}</div>
            </div>
          </div>
        ))}
      </div>

      {showShareModal && (
        <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Video</h3>
              <button className="icon-btn" onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-around', margin: '12px 0' }}>
                <button className="btn-pill"><Share2 size={16} /> Twitter</button>
                <button className="btn-pill"><Bookmark size={16} /> Embed</button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href} 
                  className="form-input" 
                />
                <button className="btn-primary" onClick={() => alert('Link copied!')}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
