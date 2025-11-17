import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Edit3, Home, Users, Shield, Library, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [user, setUser] = useState(null);
  const [hasBrownstone, setHasBrownstone] = useState(false);
  const [brownstoneUsername, setBrownstoneUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const brownstones = await base44.entities.Brownstone.filter({ user_email: currentUser.email });
        if (brownstones.length > 0) {
          setHasBrownstone(true);
          setBrownstoneUsername(brownstones[0].username);
        }
      } catch (err) {
        setUser(null);
        setHasBrownstone(false);
      }
    }
    checkUser();
    
    setCurrentPage(window.location.pathname);
  }, []);

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const isViewingOtherBrownstone = currentPage.includes('UserBrownstone');
  const showEditButton = user && hasBrownstone && !isViewingOtherBrownstone;
  const showCreateButton = user && !hasBrownstone && !isViewingOtherBrownstone;
  const showAdminButton = user && user.role === 'admin';

  return (
    <>
      <style jsx>{`
        .header-module {
          background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
          padding: 20px;
          border-bottom: 3px solid #d4af37;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          width: 100%;
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
        }

        .affiliate-left {
          width: 150px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px dashed rgba(212, 175, 55, 0.3);
          borderRadius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(212, 175, 55, 0.5);
          font-size: 0.75rem;
        }
        
        .header-title {
          text-align: center;
        }
        
        .header-title h1 {
          color: #d4af37;
          font-size: 2.5rem;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .header-title p {
          color: #f5f5dc;
          font-size: 1rem;
          margin-top: 5px;
        }

        .user-auth-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          width: 150px;
        }

        .user-info {
          color: #d4af37;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: right;
        }

        .auth-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .header-nav {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .affiliate-left {
            display: none;
          }
          .user-auth-section {
            width: auto;
            align-items: center;
          }
          .header-top {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
      
      <header className="header-module">
        <div className="header-top">
          <div className="affiliate-left">Affiliate</div>
          
          <div className="header-title">
            <h1>🏛️ CityBlocks</h1>
            <p>Where Pure Creativity Resides</p>
          </div>

          <div className="user-auth-section">
            {user ? (
              <>
                <div className="user-info">
                  {user.full_name || user.email}
                </div>
                <div className="auth-buttons">
                  {hasBrownstone && (
                    <Link to={`${createPageUrl('UserBrownstone')}?username=${brownstoneUsername}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" size="sm">
                        <User className="w-4 h-4 mr-1" />
                        My Brownstone
                      </Button>
                    </Link>
                  )}
                  <Button 
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ width: '150px' }} />
            )}
          </div>
        </div>

        <div className="header-nav">
          <Link to={createPageUrl('Home')}>
            <Button className="bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>

          <Link to={createPageUrl('Directory')}>
            <Button className="bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Directory
            </Button>
          </Link>

          <Link to={createPageUrl('CommunityLibrary')}>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              <Library className="w-4 h-4 mr-2" />
              Library
            </Button>
          </Link>

          {!user && (
            <Button 
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}

          {showEditButton && (
            <Link to={createPageUrl('Customize')}>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit My Brownstone
              </Button>
            </Link>
          )}

          {showCreateButton && (
            <Link to={createPageUrl('Customize')}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                <Edit3 className="w-4 h-4 mr-2" />
                Claim Your Brownstone
              </Button>
            </Link>
          )}

          {showAdminButton && (
            <Link to={createPageUrl('AdminDashboard')}>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}