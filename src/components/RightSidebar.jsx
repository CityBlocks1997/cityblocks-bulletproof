import React from 'react';

const categories = [
  '3D Artists',
  'Animators',
  'Filmmakers',
  'Game Developers',
  'Illustrators',
  'Motion Graphics Artists',
  'Musicians',
  'Photographers',
  'UX/UI Designers',
  'Video Editors',
  'Voice Actors',
  'Writers'
];

export default function RightSidebar({ onCategoryClick }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%)',
      border: '2px solid #4a2c1f',
      borderRadius: '15px',
      padding: '18px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{
        color: 'transparent',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextStroke: '0.5px rgba(212, 175, 55, 0.3)',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid rgba(212, 175, 55, 0.3)'
      }}>
        Explore The Community
      </h3>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(category => (
          <li
            key={category}
            onClick={() => onCategoryClick(category)}
            style={{
              padding: '12px 15px',
              marginBottom: '8px',
              background: 'rgba(222, 184, 135, 0.6)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '1px solid rgba(139, 90, 60, 0.3)',
              color: '#2d5016',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.8)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(222, 184, 135, 0.6)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}