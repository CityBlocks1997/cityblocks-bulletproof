import React from 'react';
import { X } from 'lucide-react';

export default function CreatorModal({ isOpen, onClose, creatorNumber }) {
  if (!isOpen) return null;

  // Placeholder creator data - will be populated from database later
  const creatorInfo = {
    name: `Featured Creator #${creatorNumber}`,
    category: 'Coming Soon',
    bio: 'This spot is reserved for one of our top creators. Check back soon to see who made it to the Top Ten!',
    portfolio: '',
    videos: 0
  };

  return (
    <div 
      style={{
        display: 'flex',
        position: 'fixed',
        zIndex: 10000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '30px',
          border: '2px solid #d4af37',
          borderRadius: '15px',
          width: '80%',
          maxWidth: '700px',
          color: 'white',
          position: 'relative',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            color: '#d4af37',
            float: 'right',
            fontSize: '35px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            transition: 'all 0.3s'
          }}
        >
          <X className="w-8 h-8" />
        </button>

        <h2 style={{ color: '#d4af37', fontSize: '2rem', marginBottom: '10px' }}>
          ⭐ {creatorInfo.name}
        </h2>

        <p style={{ color: '#f5c842', fontSize: '1.2rem', marginBottom: '20px' }}>
          {creatorInfo.category}
        </p>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px' }}>
            {creatorInfo.bio}
          </p>

          <div style={{ 
            padding: '20px', 
            background: 'rgba(212, 175, 55, 0.1)', 
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <p style={{ marginBottom: '10px' }}>
              <strong>Total Videos:</strong> {creatorInfo.videos}
            </p>
            {creatorInfo.portfolio && (
              <p>
                <strong>Portfolio:</strong>{' '}
                <a 
                  href={creatorInfo.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#f5c842' }}
                >
                  View Work
                </a>
              </p>
            )}
          </div>

          <p style={{ 
            marginTop: '20px', 
            fontStyle: 'italic', 
            color: '#f5c842',
            textAlign: 'center'
          }}>
            The Top Ten rankings update weekly based on community engagement.
          </p>
        </div>
      </div>
    </div>
  );
}