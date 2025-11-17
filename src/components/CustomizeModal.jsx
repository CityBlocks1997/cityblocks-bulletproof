import React from 'react';
import { X, Upload, Video, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CustomizeModal({ isOpen, onClose }) {
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
          🏠 Customize Your Own Brownstone
        </h2>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
            Build your personalized brownstone showcase! Upload 12 videos (30 seconds each) 
            and create a unique viewing experience.
          </p>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '25px', marginBottom: '15px' }}>
            📋 Requirements
          </h3>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>12 Videos:</strong> One for each window position
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>30 Seconds Max:</strong> Keep it short and impactful
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Video Format:</strong> MP4, MOV, or WebM (max 50MB per video)
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Category:</strong> Assign each video to one of the 12 creator categories
            </li>
          </ul>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '25px', marginBottom: '15px' }}>
            🎯 How It Works
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '15px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <Upload className="w-8 h-8" style={{ color: '#d4af37', marginRight: '15px' }} />
              <div>
                <strong style={{ color: '#f5c842' }}>Step 1: Upload</strong><br />
                Upload your 12 videos and assign them to window positions (1-12)
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '15px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <Video className="w-8 h-8" style={{ color: '#d4af37', marginRight: '15px' }} />
              <div>
                <strong style={{ color: '#f5c842' }}>Step 2: Preview</strong><br />
                Test your brownstone with all playback modes
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '15px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <LinkIcon className="w-8 h-8" style={{ color: '#d4af37', marginRight: '15px' }} />
              <div>
                <strong style={{ color: '#f5c842' }}>Step 3: Share</strong><br />
                Get your unique URL and share it with the world!
              </div>
            </div>
          </div>

          <h3 style={{ color: '#f5c842', fontSize: '1.5rem', marginTop: '25px', marginBottom: '15px' }}>
            💡 Pro Tips
          </h3>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              Mix different categories for variety
            </li>
            <li style={{ marginBottom: '10px' }}>
              Consider how videos work together in Cacophony mode
            </li>
            <li style={{ marginBottom: '10px' }}>
              Plan your Busker Mode sequence for maximum impact
            </li>
            <li style={{ marginBottom: '10px' }}>
              Create themed brownstones (all music, all animation, etc.)
            </li>
          </ul>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(76, 175, 80, 0.2)',
            borderRadius: '10px',
            border: '2px solid rgba(76, 175, 80, 0.5)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
              Ready to build your brownstone?
            </p>
            <Link to={createPageUrl('Terms')}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)',
                  color: '#2d5016',
                  border: '2px solid #b8941f',
                  padding: '15px 40px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={onClose}
              >
                🚀 Start Creating
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}