
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Youtube, Music, Video, Check, Eye, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WindowContentSelector from '../components/WindowContentSelector';
import AdobeStyleControls from '../components/AdobeStyleControls';

export default function Customize() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  const [facadeColor, setFacadeColor] = useState('#8B5A3C');
  const [facadeOpacity, setFacadeOpacity] = useState(25);
  const [facadeImage, setFacadeImage] = useState(null);
  const [facadeImageOpacity, setFacadeImageOpacity] = useState(50);
  const [windows, setWindows] = useState({});
  const [windowTitles, setWindowTitles] = useState({});
  const [windowDelays, setWindowDelays] = useState({});
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('');
  const [welcomeVideoType, setWelcomeVideoType] = useState('video');
  const [collaborateText, setCollaborateText] = useState('');
  const [forHireText, setForHireText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();

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

  const { data: existingBrownstone } = useQuery({
    queryKey: ['my-brownstone', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const result = await base44.entities.Brownstone.filter({ user_email: user.email });
      return result.length > 0 ? result[0] : null;
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (existingBrownstone) {
      setIsEditMode(true);
      setUsername(existingBrownstone.username || '');
      setDisplayName(existingBrownstone.display_name || '');
      setCategory(existingBrownstone.category || '');
      setBio(existingBrownstone.bio || '');
      setFacadeColor(existingBrownstone.facade_color || '#8B5A3C');
      setFacadeOpacity(existingBrownstone.facade_opacity !== undefined ? existingBrownstone.facade_opacity : 25);
      setFacadeImage(existingBrownstone.facade_image_url || null);
      setFacadeImageOpacity(existingBrownstone.facade_image_opacity !== undefined ? existingBrownstone.facade_image_opacity : 50);
      setWelcomeVideoUrl(existingBrownstone.welcome_video_url || '');
      setWelcomeVideoType(existingBrownstone.welcome_video_type || 'video');
      setCollaborateText(existingBrownstone.collaborate_text || '');
      setForHireText(existingBrownstone.for_hire_text || '');
      
      const loadedWindows = {};
      const loadedTitles = {};
      const loadedDelays = {};
      for (let i = 1; i <= 12; i++) {
        if (existingBrownstone[`window_${i}_url`]) {
          loadedWindows[i] = {
            url: existingBrownstone[`window_${i}_url`],
            type: existingBrownstone[`window_${i}_type`]
          };
          loadedTitles[i] = existingBrownstone[`window_${i}_title`] || '';
          loadedDelays[i] = existingBrownstone[`window_${i}_delay`] || 0;
        }
      }
      setWindows(loadedWindows);
      setWindowTitles(loadedTitles);
      setWindowDelays(loadedDelays);
    }
  }, [existingBrownstone]);

  const saveBrownstone = useMutation({
    mutationFn: async (publishNow = false) => {
      const brownstoneData = {
        user_email: user.email,
        username,
        display_name: displayName,
        category,
        bio,
        facade_color: facadeColor,
        facade_opacity: facadeOpacity,
        facade_image_url: facadeImage,
        facade_image_opacity: facadeImageOpacity,
        welcome_video_url: welcomeVideoUrl,
        welcome_video_type: welcomeVideoType,
        collaborate_text: collaborateText,
        for_hire_text: forHireText,
        is_published: publishNow,
        ...Object.fromEntries(
          Object.entries(windows).flatMap(([windowNum, data]) => [
            [`window_${windowNum}_url`, data.url],
            [`window_${windowNum}_type`, data.type],
            [`window_${windowNum}_title`, windowTitles[windowNum] || ''],
            [`window_${windowNum}_delay`, windowDelays[windowNum] || 0]
          ])
        )
      };

      if (existingBrownstone) {
        return await base44.entities.Brownstone.update(existingBrownstone.id, brownstoneData);
      } else {
        return await base44.entities.Brownstone.create(brownstoneData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-brownstone']);
      queryClient.invalidateQueries(['top-brownstones']);
      queryClient.invalidateQueries(['directory']);
      queryClient.invalidateQueries(['homepage-config']);
    }
  });

  const handleFileUpload = async (file, windowNum) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const fileType = file.type.startsWith('video/') ? 'video' : 'audio';
      
      setWindows(prev => ({
        ...prev,
        [windowNum]: { url: file_url, type: fileType }
      }));
      return { url: file_url, type: fileType };
    } catch (err) {
      alert('Upload failed: ' + err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFacadeImageUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFacadeImage(file_url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentSelect = (windowNum, content) => {
    setWindows(prev => ({
      ...prev,
      [windowNum]: content
    }));
  };

  const handlePublish = async () => {
    if (!username || !displayName || !category) {
      alert('Please complete all required fields');
      return;
    }
    
    await saveBrownstone.mutateAsync(true);
    alert(`🎉 Your Brownstone is now LIVE!`);
    window.location.href = `/UserBrownstone?username=${username}`;
  };

  const categories = [
    'Animators',
    'Illustrators',
    'Motion Graphics Artists',
    '3D Artists',
    'Photographers',
    'Video Editors',
    'Filmmakers',
    'Musicians',
    'Voice Actors',
    'Writers',
    'Game Developers',
    'UX/UI Designers'
  ];

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

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {isEditMode && (
          <div style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            ✏️ EDIT MODE - Updating @{username}'s Brownstone
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '20px' }}>
          {['Basic Info', 'Facade Design', 'Windows & Modals', 'Preview'].map((label, idx) => (
            <div key={idx} style={{
              padding: '12px 24px',
              background: step === idx + 1 ? 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)' : 'rgba(139, 90, 60, 0.3)',
              color: step === idx + 1 ? '#2d5016' : '#4a2c1f',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }} onClick={() => setStep(idx + 1)}>
              {idx + 1}. {label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{ color: '#4a2c1f', marginBottom: '30px', fontSize: '2rem' }}>
              {isEditMode ? '✏️ Edit Your Brownstone' : '🏛️ Claim Your Brownstone'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#4a2c1f' }}>
                  Username (for your URL: cityblocks.com/yourname)
                </label>
                <Input
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  className="h-12 text-base"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
                    Username cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#4a2c1f' }}>
                  Display Name
                </label>
                <Input
                  placeholder="Your Name or Brand"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#4a2c1f' }}>
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choose your category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#4a2c1f' }}>
                  Bio (Optional)
                </label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-24 text-base"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="h-14 bg-gradient-to-r from-[#d4af37] to-[#f5c842] hover:from-[#f5c842] hover:to-[#d4af37] text-[#2d5016] font-bold text-lg"
              >
                Next: Facade Design →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{
              flex: '0 0 450px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '40px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ color: '#4a2c1f', marginBottom: '30px', fontSize: '2rem' }}>🎨 Facade Design</h2>
              
              <AdobeStyleControls
                facadeColor={facadeColor}
                setFacadeColor={setFacadeColor}
                facadeOpacity={facadeOpacity}
                setFacadeOpacity={setFacadeOpacity}
                facadeImage={facadeImage}
                setFacadeImage={setFacadeImage}
                facadeImageOpacity={facadeImageOpacity}
                setFacadeImageOpacity={setFacadeImageOpacity}
                isUploading={isUploading}
                onImageUpload={handleFacadeImageUpload}
              />

              <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-14 text-lg"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 h-14 bg-gradient-to-r from-[#d4af37] to-[#f5c842] hover:from-[#f5c842] hover:to-[#d4af37] text-[#2d5016] font-bold text-lg"
                >
                  Next: Content →
                </Button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  maxWidth: 416,
                  aspectRatio: '832 / 1500',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/130669447_brownstone_desaturated.png"
                  alt="Brownstone Base"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    backgroundColor: facadeImage ? 'transparent' : facadeColor,
                    backgroundImage: facadeImage ? `url(${facadeImage})` : 'none',
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
                    opacity: (facadeImage ? facadeImageOpacity : facadeOpacity) / 100,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{ color: '#4a2c1f', marginBottom: '30px', fontSize: '2rem' }}>
              🎬 Windows & Interactive Modals
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              {[...Array(12)].map((_, idx) => {
                const windowNum = idx + 1;
                const windowData = windows[windowNum];
                
                return (
                  <div key={windowNum} style={{
                    background: 'rgba(139, 90, 60, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid #d4af37'
                  }}>
                    <h3 style={{ color: '#4a2c1f', marginBottom: '15px', fontWeight: 'bold' }}>
                      Window {windowNum}
                    </h3>
                    
                    {windowData ? (
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '8px' }}>
                          <Check className="inline w-5 h-5 mr-2" />
                          {windowData.type === 'youtube' ? '📺 YouTube' : windowData.type === 'audio' ? '🎵 Audio' : '🎬 Video'}
                        </div>
                        <Input
                          placeholder="Custom title (optional)"
                          value={windowTitles[windowNum] || ''}
                          onChange={(e) => setWindowTitles(prev => ({ ...prev, [windowNum]: e.target.value }))}
                          className="mb-2 text-sm"
                        />
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '4px' }}>
                            ⏱️ Delay (seconds):
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="0"
                            value={windowDelays[windowNum] || 0}
                            onChange={(e) => setWindowDelays(prev => ({ ...prev, [windowNum]: parseFloat(e.target.value) || 0 }))}
                            className="text-sm"
                          />
                          <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                            Pause before playing (for rhythm)
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setWindows(prev => { const newW = {...prev}; delete newW[windowNum]; return newW; });
                            setWindowTitles(prev => { const newT = {...prev}; delete newT[windowNum]; return newT; });
                            setWindowDelays(prev => { const newD = {...prev}; delete newD[windowNum]; return newD; });
                          }}
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <WindowContentSelector
                        windowNum={windowNum}
                        onSelect={(content) => handleContentSelect(windowNum, content)}
                        isUploading={isUploading}
                        onUpload={handleFileUpload}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid #d4af37',
              borderRadius: '12px',
              padding: '30px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginBottom: '20px' }}>
                🚪 Welcome Door Video (Optional)
              </h3>
              <Input
                placeholder="YouTube URL or upload video"
                value={welcomeVideoUrl}
                onChange={(e) => setWelcomeVideoUrl(e.target.value)}
                className="mb-3 h-12"
              />

              <h3 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginTop: '25px', marginBottom: '20px' }}>
                📧 Let's Collaborate Modal (Optional)
              </h3>
              <Textarea
                placeholder="How people can collaborate with you..."
                value={collaborateText}
                onChange={(e) => setCollaborateText(e.target.value)}
                className="mb-3 min-h-24"
              />

              <h3 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginTop: '25px', marginBottom: '20px' }}>
                💼 For Hire Modal (Optional)
              </h3>
              <Textarea
                placeholder="Your services and rates..."
                value={forHireText}
                onChange={(e) => setForHireText(e.target.value)}
                className="min-h-24"
              />
            </div>

            {isUploading && (
              <div style={{ textAlign: 'center', color: '#d4af37', fontWeight: 'bold', marginBottom: '20px' }}>
                Uploading...
              </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-14 text-lg"
              >
                ← Back
              </Button>
              <Button
                onClick={async () => {
                  await saveBrownstone.mutateAsync(false);
                  setStep(4);
                }}
                className="flex-1 h-14 bg-gradient-to-r from-[#d4af37] to-[#f5c842] hover:from-[#f5c842] hover:to-[#d4af37] text-[#2d5016] font-bold text-lg"
              >
                Preview & Publish →
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#4a2c1f', marginBottom: '30px', fontSize: '2rem' }}>
              🎉 Ready to Publish?
            </h2>
            
            <div style={{ marginBottom: '30px', textAlign: 'left', maxWidth: '600px', margin: '0 auto 30px' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                <strong>Your Brownstone Details:</strong>
              </p>
              <ul style={{ lineHeight: '2' }}>
                <li>Username: <strong>{username}</strong></li>
                <li>Display Name: <strong>{displayName}</strong></li>
                <li>Category: <strong>{category}</strong></li>
                <li>Windows Filled: <strong>{Object.keys(windows).length}/12</strong></li>
              </ul>
            </div>

            <p style={{ fontSize: '1rem', marginBottom: '30px', color: '#666' }}>
              When you publish, your Brownstone will be <strong style={{ color: '#d4af37' }}>live</strong> in the "{category}" category!
            </p>

            <div style={{ display: 'flex', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 h-14 text-lg"
              >
                ← Back to Edit
              </Button>
              <Button
                onClick={handlePublish}
                disabled={saveBrownstone.isPending}
                className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg"
              >
                🚀 Publish Now!
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
