import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ArrowUpDown } from 'lucide-react';
import { INITIAL_COMMENTS } from '../data/mockData';

export default function CommentsSection() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Alex Developer (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: newCommentText,
      timeAgo: 'Just now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked
        };
      }
      return c;
    }));
  };

  const handleAddReply = (commentId) => {
    const text = replyTextMap[commentId];
    if (!text || !text.trim()) return;

    setComments(comments.map(c => {
      if (c.id === commentId) {
        const newReply = {
          id: `c-r-${Date.now()}`,
          author: 'Alex Developer (You)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          text: text,
          timeAgo: 'Just now',
          likes: 0
        };
        return {
          ...c,
          replies: [...c.replies, newReply]
        };
      }
      return c;
    }));

    setReplyTextMap({ ...replyTextMap, [commentId]: '' });
    setActiveReplyId(null);
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <span className="comments-count">{comments.length} Comments</span>
        <button className="sort-btn">
          <ArrowUpDown size={16} /> Sort by
        </button>
      </div>

      <div className="add-comment-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
          alt="Your avatar" 
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        <div className="comment-input-area">
          <input 
            type="text" 
            className="comment-input" 
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          {newCommentText && (
            <div className="comment-actions">
              <button className="btn-secondary" onClick={() => setNewCommentText('')}>Cancel</button>
              <button className="btn-primary" onClick={handleAddComment}>Comment</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <img 
              src={comment.avatar} 
              alt={comment.author} 
              style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}
            />
            <div className="comment-content" style={{ width: '100%' }}>
              <div className="comment-author">
                <span>{comment.author}</span>
                <span className="time">{comment.timeAgo}</span>
              </div>

              <div className="comment-text">{comment.text}</div>

              <div className="comment-footer-actions">
                <button 
                  className="icon-btn" 
                  style={{ width: 24, height: 24, color: comment.isLiked ? 'var(--brand-red)' : 'inherit' }}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
                </button>
                <span>{comment.likes > 0 ? comment.likes : ''}</span>

                <button className="icon-btn" style={{ width: 24, height: 24 }}>
                  <ThumbsDown size={14} />
                </button>

                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                >
                  Reply
                </button>
              </div>

              {activeReplyId === comment.id && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    className="comment-input"
                    placeholder="Write a reply..."
                    value={replyTextMap[comment.id] || ''}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [comment.id]: e.target.value })}
                  />
                  <button className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => handleAddReply(comment.id)}>
                    Reply
                  </button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid var(--border-subtle)' }}>
                  {comment.replies.map(reply => (
                    <div key={reply.id} style={{ display: 'flex', gap: '10px' }}>
                      <img src={reply.avatar} alt={reply.author} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      <div>
                        <div className="comment-author" style={{ fontSize: '0.8rem' }}>
                          {reply.author} {reply.isCreator && <span style={{ background: '#383838', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>Creator</span>}
                          <span className="time">{reply.timeAgo}</span>
                        </div>
                        <div className="comment-text" style={{ fontSize: '0.85rem' }}>{reply.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
