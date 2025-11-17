import React from 'react';
import { X } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
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
          ℹ️ About CityBlocks
        </h2>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            Our Mission
          </h3>
          <p style={{ marginBottom: '20px' }}>
            CityBlocks is the algorithm-free video platform dedicated to pure creativity. 
            We believe creators deserve a space where their work speaks for itself—without 
            clickbait, without manipulation, without the noise.
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            The Problem We Solve
          </h3>
          <p style={{ marginBottom: '20px' }}>
            Traditional social media platforms prioritize engagement over artistry. Their algorithms 
            push content that generates reactions—often negative ones. Creators are forced to compete 
            with news, politics, viral drama, and "Karen videos" for attention.
          </p>
          <p style={{ marginBottom: '20px' }}>
            <strong>Not here.</strong>
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            The CityBlocks Difference
          </h3>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>No Algorithms:</strong> You choose what to watch and in what order
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>30-Second Format:</strong> Short, impactful showcases of talent
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>12 Creative Categories:</strong> Animators, Illustrators, Motion Graphics Artists, 3D Artists, Photographers, Video Editors, Filmmakers, Musicians, Voice Actors, Writers, Game Developers, and UX/UI Designers
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Curated Experience:</strong> Every brownstone is intentionally designed
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Innovative Playback:</strong> Unique viewing modes you won't find anywhere else
            </li>
          </ul>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            Trademarked Innovations
          </h3>
          <p style={{ marginBottom: '20px' }}>
            <strong>CityBlocks™</strong> - The platform name and concept<br />
            <strong>Busker Brownstone™</strong> - Our flagship building<br />
            <strong>Sequential Dimensional™</strong> - Progressive grid formation mode<br />
            <strong>I. Otto Shuda™</strong> - Our AI curator assistant
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '20px', marginBottom: '15px' }}>
            Contact Us
          </h3>
          <p style={{ marginBottom: '20px' }}>
            CityBlocks Media LLC<br />
            EIN: 41-2485799<br />
            <br />
            For business inquiries, partnerships, or support:<br />
            <a href="mailto:info@cityblocks.com" style={{ color: '#d4af37' }}>info@cityblocks.com</a>
          </p>

          <p style={{ color: '#f5c842', fontStyle: 'italic', marginTop: '30px', fontSize: '1.2rem' }}>
            Where Pure Creativity Resides
          </p>
        </div>
      </div>
    </div>
  );
}