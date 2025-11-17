import React from 'react';
import { X } from 'lucide-react';

export default function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
          maxWidth: '800px',
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

        <h2 style={{ color: '#d4af37', fontSize: '2.5rem', marginBottom: '20px' }}>
          🏛️ Welcome to CityBlocks!
        </h2>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px' }}>
            <strong>The Algorithm-Free Video Platform</strong>
          </p>

          <p style={{ marginBottom: '20px' }}>
            No news. No politics. No Karen videos. Just pure creativity.
          </p>

          <p style={{ marginBottom: '20px' }}>
            CityBlocks is a revolutionary video platform where creators from 12 different categories 
            showcase their work in a beautifully curated brownstone building. Each window represents 
            a different creator's 30-second video.
          </p>

          <p style={{ marginBottom: '20px' }}>
            <strong style={{ color: '#f5c842' }}>Experience video playback like never before:</strong>
          </p>

          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li>📺 <strong>Sequential Mode</strong> - Watch videos in order, one at a time</li>
            <li>📐 <strong>Sequential Dimensional™</strong> - Videos appear progressively: 1x1 → 2x2 → 3x3 → 4x3 grid</li>
            <li>🎲 <strong>Random Mode</strong> - Surprise yourself with random playback</li>
            <li>🎚️ <strong>Cacophony Mode</strong> - All 12 videos play simultaneously with one in spotlight</li>
            <li>🎸 <strong>Busker Mode™</strong> - Layer sounds progressively like a street performer</li>
          </ul>

          <p style={{ color: '#f5c842', fontStyle: 'italic' }}>
            This is where pure creativity resides.
          </p>
        </div>
      </div>
    </div>
  );
}