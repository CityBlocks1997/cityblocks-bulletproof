import React from 'react';
import { X } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
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
          animation: 'modalSlideIn 0.3s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto'
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
          📺 How It Works
        </h2>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            The Brownstone
          </h3>
          <p style={{ marginBottom: '20px' }}>
            Each brownstone building has 12 windows. Each window features a 30-second video 
            from a creator in one of our 12 categories. This is the "Busker Brownstone™" - 
            our original building that showcases the CityBlocks jingle.
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            Playback Modes
          </h3>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Sequential:</strong> Videos play one after another in window order (1→2→3...→12)
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Random:</strong> Videos play in a shuffled order for variety
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Custom Sequence:</strong> Enter your own order (e.g., "1,12,4,7") to create your own playlist
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Cacophony:</strong> All 12 videos play at once! One video is at full volume while others play at 30-60% volume
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Busker Mode™:</strong> Layer sounds progressively. Enter a sequence with delays (use 0 for 1.5s pause). 
              Example: "11,0,2" plays window 11, waits 1.5 seconds, then adds window 2
            </li>
          </ul>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            The 12 Creative Categories
          </h3>
          <p style={{ marginBottom: '20px' }}>
            🎨 3D Artists • 🎬 Animators • 🎥 Filmmakers • 🎮 Game Developers • 🖼️ Illustrators • 
            ✨ Motion Graphics Artists • 🎵 Musicians • 📸 Photographers • 💻 UX/UI Designers • 
            ✂️ Video Editors • 🎙️ Voice Actors • ✏️ Writers
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            Customize Your Own
          </h3>
          <p style={{ marginBottom: '20px' }}>
            Creators can build their own brownstone! Upload 12 videos (30 seconds each) to our hosted platform, 
            or use your YouTube links for increased views and longer runtime. Assign them to window positions 
            and share your personalized brownstone URL with the world.
          </p>

          <p style={{ color: '#f5c842', fontStyle: 'italic', marginTop: '30px' }}>
            No algorithms. No recommendations. Just pure, curated creativity.
          </p>
        </div>
      </div>
    </div>
  );
}