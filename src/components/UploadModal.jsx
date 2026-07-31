import React, { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function UploadModal({ onClose, onAddVideo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

  const presetVideos = [
    { label: 'Big Buck Bunny 4K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { label: 'Tears of Steel Sci-Fi', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { label: 'Elephants Dream Animated', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { label: 'For Bigger Blazes 1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a video title');
      return;
    }

    const newVideo = {
      id: `v-custom-${Date.now()}`,
      title: title,
      description: description || 'No description provided.',
      videoUrl: videoUrl,
      thumbnail: thumbnailUrl,
      previewUrl: videoUrl,
      duration: '08:45',
      views: '1 view',
      uploadedAt: 'Just now',
      category: category,
      channel: {
        id: 'ch-user',
        name: 'Alex Developer (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        subscribers: '1 Subscriber',
        verified: true
      },
      likes: 1,
      dislikes: 0,
      isLiked: true,
      isSubscribed: false,
      tags: ['#NewUpload', `#${category}`]
    };

    onAddVideo(newVideo);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="var(--brand-red)" />
            <h3>Upload Video to Studio Pro</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Video Title *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Master React 19 and Next.js App Router" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                placeholder="Tell viewers about your video..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sample Video Preset</label>
                <select 
                  className="form-select"
                  onChange={e => setVideoUrl(e.target.value)}
                >
                  {presetVideos.map(pv => (
                    <option key={pv.label} value={pv.url}>{pv.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Custom MP4 Source Video URL</label>
              <input 
                type="url" 
                className="form-input" 
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Thumbnail Image URL</label>
              <input 
                type="url" 
                className="form-input" 
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
