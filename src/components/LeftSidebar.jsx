import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function LeftSidebar({ onHowItWorksClick, onAboutClick, onCustomizeClick, onCreatorClick }) {
  // Fetch top 12 brownstones by likes
  const { data: topBrownstones = [] } = useQuery({
    queryKey: ['top-brownstones'],
    queryFn: async () => {
      const brownstones = await base44.entities.Brownstone.filter({ 
        is_published: true, 
        is_disabled: false 
      }, '-total_likes', 12); // Get top 12 instead of 10
      return brownstones;
    },
  });

  return (
    <>
      <style jsx>{`
        .left-sidebar {
          background: linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%);
          border: 2px solid #4a2c1f;
          borderRadius: 15px;
          padding: 18px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .sidebar-section {
          margin-bottom: 20px;
        }

        .sidebar-section h3 {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 15px;
          padding: 12px;
          background: linear-gradient(135deg, #d4af37 0%, #f5c842 100%);
          border: 2px solid #b8941f;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.5);
          -webkit-text-stroke: 0.5px #000000;
          text-stroke: 0.5px #000000;
        }

        .sidebar-section:has(.featured-creators) h3 {
          color: #2d5016;
        }

        .sidebar-btn {
          background: linear-gradient(135deg, #d4af37 0%, #f5c842 100%);
          color: #2d5016;
          border: 2px solid #b8941f;
          padding: 12px;
          width: 100%;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 10px;
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.5);
          text-align: center;
          -webkit-text-stroke: 0.5px #000000;
          text-stroke: 0.5px #000000;
          text-decoration: none;
          display: block;
        }

        .sidebar-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.7);
          background: linear-gradient(135deg, #f5c842 0%, #d4af37 100%);
        }

        .sidebar-list {
          list-style: none;
        }

        .sidebar-list li {
          padding: 12px 15px;
          background: rgba(222, 184, 135, 0.6);
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 3px solid transparent;
          color: #2c2416;
          border: 1px solid rgba(139, 90, 60, 0.3);
        }

        .sidebar-list li:hover {
          background: rgba(222, 184, 135, 0.85);
          border-left-color: #6b4423;
          border-color: #6b4423;
          transform: translateX(5px);
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .brownstone-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 832 / 1500;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid #d4af37;
        }

        .brownstone-thumbnail:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.8);
          border-color: #f5c842;
        }

        .thumbnail-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(0, 0, 0, 0.8);
          color: #d4af37;
          font-size: 0.7rem;
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: bold;
          z-index: 10;
        }

        .thumbnail-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          color: white;
          font-size: 0.65rem;
          padding: 6px 4px 4px;
          text-align: center;
          font-weight: bold;
          z-index: 10;
        }

        .thumbnail-likes {
          color: #d4af37;
          font-size: 0.6rem;
        }
      `}</style>

      <div className="left-sidebar">
        <div className="sidebar-section">
          <h3 style={{
            background: 'linear-gradient(135deg, #4a2c1f 0%, #6b4423 100%)',
            border: '2px solid #4a2c1f',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
            WebkitTextStroke: '0.5px #000000',
            color: '#ffffff'
          }}>Get Started</h3>
          <Link to={createPageUrl('Terms')} className="sidebar-btn">
            🏠 Claim Your Brownstone
          </Link>
          <ul className="sidebar-list">
            <li 
              onClick={onHowItWorksClick}
              style={{
                background: 'linear-gradient(135deg, #4a2c1f 0%, #6b4423 100%)',
                color: '#ffffff',
                fontWeight: 'bold',
                WebkitTextStroke: '0.5px #000000'
              }}
            >
              📺 How it Works
            </li>
            <li 
              onClick={onAboutClick}
              style={{
                background: 'linear-gradient(135deg, #4a2c1f 0%, #6b4423 100%)',
                color: '#ffffff',
                fontWeight: 'bold',
                WebkitTextStroke: '0.5px #000000'
              }}
            >
              ℹ️ About
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Top Creators</h3>
          <div className="thumbnail-grid">
            {topBrownstones.map((brownstone, index) => (
              <div
                key={brownstone.id}
                className="brownstone-thumbnail"
                onClick={() => window.location.href = `/UserBrownstone?username=${brownstone.username}`}
              >
                <div className="thumbnail-badge">#{index + 1}</div>
                
                {/* Base desaturated brownstone */}
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/130669447_brownstone_desaturated.png"
                  alt={`${brownstone.username} brownstone`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1
                  }}
                />
                
                {/* Color or Image layer with CSS MASK */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    backgroundColor: brownstone.facade_image_url ? 'transparent' : (brownstone.facade_color || '#8B5A3C'),
                    backgroundImage: brownstone.facade_image_url ? `url(${brownstone.facade_image_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitMaskImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/f1a38e8a6_brownstone_walls_only.png)',
                    maskImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/f1a38e8a6_brownstone_walls_only.png)',
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: '0 0',
                    maskPosition: '0 0',
                    opacity: (brownstone.facade_image_url ? (brownstone.facade_image_opacity || 50) : (brownstone.facade_opacity || 25)) / 100,
                    pointerEvents: 'none'
                  }}
                />
                
                <div className="thumbnail-info">
                  @{brownstone.username}
                  <div className="thumbnail-likes">❤️ {brownstone.total_likes || 0}</div>
                </div>
              </div>
            ))}
          </div>
          
          {topBrownstones.length === 0 && (
            <p style={{ color: '#f5f5dc', textAlign: 'center', padding: '20px', fontSize: '0.9rem' }}>
              No creators yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </>
  );
}