
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, FileText, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  const [user, setUser] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToCopyright, setAgreedToCopyright] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        base44.auth.redirectToLogin(window.location.href);
      }
    }
    getUser();
  }, []);

  const handleAccept = () => {
    if (agreedToTerms && agreedToCopyright) {
      window.location.href = createPageUrl('Customize');
    }
  };

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', background: '#F5F1E8' }}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(245, 241, 232, 0.55), rgba(245, 241, 232, 0.55)),
            url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/94109f1f8_city-street-background.jpg)
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />

      <Header />

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <FileText className="inline-block w-16 h-16 text-[#d4af37] mb-4" />
            <h1 style={{ color: '#4a2c1f', fontSize: '2.5rem', marginBottom: '10px' }}>
              Terms of Service & Copyright Guidelines
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Please read and accept before creating your Brownstone
            </p>
          </div>

          {/* Copyright Warning Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '3px solid #ef4444',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '15px', fontWeight: 'bold' }}>
                  ⚠️ Copyright & Content Rules
                </h3>
                <ul style={{ lineHeight: '1.8', color: '#4a2c1f', fontSize: '1rem' }}>
                  <li style={{ marginBottom: '10px' }}>
                    ✓ <strong>Only upload content you own or have rights to use</strong>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    ✓ YouTube links are subject to YouTube's copyright policies
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    ✗ <strong>DO NOT upload copyrighted music, videos, or content without permission</strong>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    ✗ DO NOT upload offensive, illegal, or inappropriate content
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    ⚖️ <strong>Violations will result in immediate account termination</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms of Service Section */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#4a2c1f', fontSize: '1.3rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield className="w-6 h-6 text-[#d4af37]" />
              Terms of Service
            </h3>
            <div style={{ lineHeight: '1.8', color: '#4a2c1f', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>1. Acceptance of Terms</strong><br />
                By creating a Brownstone on CityBlocks.com, you agree to comply with all terms, copyright laws, and community guidelines.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>2. Content Ownership & Copyright</strong><br />
                You represent and warrant that you own all rights to the content you upload, or have obtained all necessary permissions and licenses. CityBlocks is not responsible for copyright violations by users.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>3. DMCA Compliance</strong><br />
                CityBlocks complies with the Digital Millennium Copyright Act (DMCA). We will respond to valid takedown notices and may terminate accounts of repeat infringers.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>4. Prohibited Content</strong><br />
                You may not upload content that: infringes copyright or trademark, contains hate speech, is pornographic, promotes illegal activity, or violates any laws.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>5. Account Termination</strong><br />
                CityBlocks reserves the right to suspend or terminate accounts that violate these terms, without notice or refund.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>6. User Responsibility</strong><br />
                You are solely responsible for the content you upload and any consequences that arise from publishing that content.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>7. Platform Rights</strong><br />
                By uploading content, you grant CityBlocks a non-exclusive license to display, distribute, and promote your content on our platform.
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>8. Community Library & Cross-Platform Collaboration</strong><br />
                Content posted to the Community Library becomes free-use to all CityBlocks members. By adding clips, sounds, or videos to the Community Library, you grant all community members permission to use, remix, and incorporate your contributions into their own Brownstone creations. This enables cross-platform collaboration and allows members to create unique sketches, skits, and performances using shared resources.
              </p>
              
              <p style={{ marginBottom: '0' }}>
                <strong>9. Changes to Terms</strong><br />
                CityBlocks may update these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
              </p>
            </div>
          </div>

          {/* Acceptance Checkboxes */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '20px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '10px',
              marginBottom: '15px',
              border: agreedToTerms ? '2px solid #4ade80' : '2px solid rgba(212, 175, 55, 0.3)',
              cursor: 'pointer'
            }} onClick={() => setAgreedToTerms(!agreedToTerms)}>
              <Checkbox 
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="mt-1"
              />
              <label style={{ color: '#4a2c1f', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                I have read and agree to the Terms of Service
              </label>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '10px',
              border: agreedToCopyright ? '2px solid #4ade80' : '2px solid #ef4444',
              cursor: 'pointer'
            }} onClick={() => setAgreedToCopyright(!agreedToCopyright)}>
              <Checkbox 
                checked={agreedToCopyright}
                onCheckedChange={setAgreedToCopyright}
                className="mt-1"
              />
              <label style={{ color: '#4a2c1f', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                I understand the copyright rules and will only upload content I own or have permission to use
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="h-14 px-8 text-lg"
            >
              ← Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!agreedToTerms || !agreedToCopyright}
              className="h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept & Continue to Customize →
            </Button>
          </div>

          {/* Footer Note */}
          <div style={{
            marginTop: '30px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>
              © 2025 CityBlocks Media LLC. All Rights Reserved. | EIN: 41-2485799<br />
              For legal inquiries: legal@cityblocks.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
