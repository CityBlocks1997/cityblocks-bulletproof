
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Square, Volume2, VolumeX, Shuffle, Layers, Heart, Share2, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReportButton from '../components/ReportButton';
import { getGridLayout } from '../components/SequentialDimensionalGrid';

export default function UserBrownstone() {
  const [playbackMode, setPlaybackMode] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [customSequence, setCustomSequence] = useState('');
  const [buskerMode, setBuskerMode] = useState(false);
  const [buskerSequence, setBuskerSequence] = useState('');
  const [buskerWindows, setBuskerWindows] = useState(new Set());
  const [playingWindows, setPlayingWindows] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackQueue, setPlaybackQueue] = useState([]);
  const [status, setStatus] = useState('');
  const [lastBuskerSequence, setLastBuskerSequence] = useState('');
  const [windowVolumes, setWindowVolumes] = useState({});
  const [showBusker, setShowBusker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [sequentialDimensional, setSequentialDimensional] = useState(false);
  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [showForHireModal, setShowForHireModal] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username') || 'rctstudios';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    fetchUser();
    
    // Initialize Audio Context for metronome
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(ctx);
  }, []);

  // Metronome click function
  const playMetronomeClick = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000; // 1kHz click
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  const { data: brownstone, isLoading } = useQuery({
    queryKey: ['brownstone', username, currentUser?.email],
    queryFn: async () => {
      const results = await base44.entities.Brownstone.filter({ 
        username,
        is_disabled: false 
      });
      
      if (results.length === 0) return null;
      
      const brownstone = results[0];
      
      if (brownstone.is_published) return brownstone;
      
      if (currentUser && brownstone.user_email === currentUser.email) {
        return brownstone;
      }
      
      return null;
    },
    enabled: !!currentUser || username !== null,
  });

  const isOwner = currentUser && brownstone && currentUser.email === brownstone.user_email;

  useEffect(() => {
    const checkLike = async () => {
      if (!currentUser || !brownstone) return;
      const likes = await base44.entities.Like.filter({
        user_email: currentUser.email,
        brownstone_id: brownstone.id
      });
      setIsLiked(likes.length > 0);
    };
    checkLike();
  }, [currentUser, brownstone]);

  const handleLike = async () => {
    if (!currentUser || !brownstone) return;
    
    if (isLiked) {
      const likes = await base44.entities.Like.filter({
        user_email: currentUser.email,
        brownstone_id: brownstone.id
      });
      if (likes.length > 0) {
        await base44.entities.Like.delete(likes[0].id);
        await base44.entities.Brownstone.update(brownstone.id, {
          total_likes: Math.max(0, (brownstone.total_likes || 0) - 1)
        });
      }
      setIsLiked(false);
    } else {
      await base44.entities.Like.create({
        user_email: currentUser.email,
        brownstone_id: brownstone.id
      });
      await base44.entities.Brownstone.update(brownstone.id, {
        total_likes: (brownstone.total_likes || 0) + 1
      });
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setStatus('🔗 Link copied to clipboard!');
    setTimeout(() => setStatus(''), 3000);
  };

  const windowPositions = {
    1: { top: '20.80%', left: '22.16%', width: '12.02%', height: '7.67%' },
    2: { top: '20.80%', left: '44.0%', width: '12.02%', height: '7.67%' },
    3: { top: '20.74%', left: '66.24%', width: '12.02%', height: '7.67%' },
    4: { top: '34.0%', left: '22.6%', width: '11.78%', height: '9.27%' },
    5: { top: '34.0%', left: '44.35%', width: '11.78%', height: '9.27%' },
    6: { top: '34.0%', left: '66.3%', width: '11.78%', height: '9.27%' },
    7: { top: '47.87%', left: '22.7%', width: '11.78%', height: '9.27%' },
    8: { top: '47.4%', left: '44.35%', width: '11.78%', height: '9.27%' },
    9: { top: '47.87%', left: '66.4%', width: '11.78%', height: '9.27%' },
    10: { top: '63.13%', left: '22.6%', width: '11.78%', height: '9.27%' },
    11: { top: '63.73%', left: '44.47%', width: '11.78%', height: '9.27%' },
    12: { top: '63.13%', left: '66.5%', width: '11.78%', height: '9.27%' },
  };

  const toggleSound = () => setIsMuted(!isMuted);

  const stopPlayback = () => {
    setPlaybackMode(null);
    setBuskerMode(false);
    setBuskerWindows(new Set());
    setPlayingWindows(new Set());
    setPlaybackQueue([]);
    setCurrentIndex(0);
    setWindowVolumes({});
    setShowBusker(false);
    setStatus('Playback stopped');
    setTimeout(() => setStatus(''), 2000);
  };

  const playSequential = () => {
    stopPlayback();
    setPlaybackMode('sequential');
    const queue = [];
    for (let i = 1; i <= 12; i++) {
      if (brownstone[`window_${i}_url`]) queue.push(i);
    }
    setPlaybackQueue(queue);
    setCurrentIndex(0);
    setStatus(sequentialDimensional ? '📐 Sequential Dimensional™ Mode Active' : 'Playing Sequential');
  };

  const playRandom = () => {
    stopPlayback();
    const queue = [];
    for (let i = 1; i <= 12; i++) {
      if (brownstone[`window_${i}_url`]) queue.push(i);
    }
    const shuffled = queue.sort(() => Math.random() - 0.5);
    setPlaybackMode('random');
    setPlaybackQueue(shuffled);
    setCurrentIndex(0);
    setStatus(sequentialDimensional ? '📐 Random Dimensional™ Mode Active' : 'Playing Random');
  };

  const playCacophony = () => {
    stopPlayback();
    setPlaybackMode('cacophony');
    const windows = [];
    for (let i = 1; i <= 12; i++) {
      if (brownstone[`window_${i}_url`]) windows.push(i);
    }
    const spotlightIndex = Math.floor(Math.random() * windows.length);
    const volumes = {};
    windows.forEach((w, idx) => {
      volumes[w] = idx === spotlightIndex ? 1.0 : 0.3 + (Math.random() * 0.3);
    });
    setWindowVolumes(volumes);
    setPlayingWindows(new Set(windows));
    setStatus(`🎚️ Cacophony: All playing! Window ${windows[spotlightIndex]} in spotlight!`);
  };

  const playCustomSequence = () => {
    if (!customSequence.trim()) return;
    stopPlayback();
    const numbers = customSequence.split(',').map(n => parseInt(n.trim())).filter(n => n >= 1 && n <= 12 && brownstone[`window_${n}_url`]);
    if (numbers.length === 0) {
      setStatus('❌ Please enter valid window numbers');
      setTimeout(() => setStatus(''), 3000);
      return;
    }
    setPlaybackMode('custom');
    setPlaybackQueue(numbers);
    setCurrentIndex(0);
    setStatus(sequentialDimensional ? `📐 Custom Dimensional™: ${customSequence}` : `🎯 Playing custom sequence: ${customSequence}`);
  };

  const toggleBuskerMode = () => {
    if (buskerMode) {
      stopPlayback();
    } else {
      stopPlayback();
      setBuskerMode(true);
      setShowBusker(true);
      setStatus('🎸 Busker Mode Active! Use 0 for metronome clicks. Multiple 0s = longer beat spacing.');
      setTimeout(() => setShowBusker(false), 16000);
    }
  };

  const playBuskerSequence = () => {
    if (!buskerMode || !buskerSequence.trim()) return;
    setBuskerWindows(new Set());
    setLastBuskerSequence(buskerSequence);
    const numbers = buskerSequence.split(',').map(n => parseInt(n.trim()));
    processSequenceWithDelays(numbers, 0, new Set());
  };

  const processSequenceWithDelays = (sequence, index, currentWindows) => {
    if (index >= sequence.length) return;
    const num = sequence[index];
    
    if (num === 0) {
      playMetronomeClick();
      setStatus('🥁 *click* - Metronome beat');
      setTimeout(() => processSequenceWithDelays(sequence, index + 1, currentWindows), 500);
      return;
    }
    
    if (num >= 1 && num <= 12 && brownstone[`window_${num}_url`]) {
      const newWindows = new Set(currentWindows);
      newWindows.add(num);
      setBuskerWindows(newWindows);
      
      if (sequentialDimensional) {
        const { label } = getGridLayout(newWindows.size);
        setStatus(`📐 Sequential Dimensional™: ${label} (${newWindows.size} videos)`);
      } else {
        setStatus(`🎸 Layering ${newWindows.size} window${newWindows.size !== 1 ? 's' : ''}`);
      }
    }
    setTimeout(() => processSequenceWithDelays(sequence, index + 1, currentWindows), 100);
  };

  useEffect(() => {
    if ((playbackMode === 'sequential' || playbackMode === 'random' || playbackMode === 'custom') && currentIndex < playbackQueue.length) {
      const windowPos = playbackQueue[currentIndex];
      const delay = (brownstone[`window_${windowPos}_delay`] || 0) * 1000; // Convert to milliseconds
      
      setTimeout(() => {
        if (sequentialDimensional) {
          const windowsToPlay = playbackQueue.slice(0, currentIndex + 1);
          setPlayingWindows(new Set(windowsToPlay));
          
          const { label } = getGridLayout(currentIndex + 1);
          setStatus(`📐 Sequential Dimensional™: ${label} (${currentIndex + 1}/${playbackQueue.length})`);
        } else {
          setPlayingWindows(new Set([windowPos]));
          setStatus(`Now Playing: Window ${windowPos} (${currentIndex + 1}/${playbackQueue.length})`);
        }
      }, delay);
    }
  }, [playbackMode, currentIndex, playbackQueue, sequentialDimensional, brownstone]);

  const handleVideoEnded = (windowPos) => {
    if (sequentialDimensional) {
      setTimeout(() => {
        if (currentIndex < playbackQueue.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setStatus('✅ Complete!');
          setTimeout(() => {
            setPlaybackMode(null);
            setPlayingWindows(new Set());
            setStatus('');
          }, 2000);
        }
      }, 300);
    } else {
      if (playbackMode === 'sequential' || playbackMode === 'random' || playbackMode === 'custom') {
        setTimeout(() => {
          setPlayingWindows(new Set());
          if (currentIndex < playbackQueue.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setStatus('✅ Complete!');
            setTimeout(() => {
              setPlaybackMode(null);
              setStatus('');
            }, 2000);
          }
        }, 300);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#4a2c1f' }}>Loading brownstone...</div>
      </div>
    );
  }

  if (!brownstone) {
    return (
      <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: '#4a2c1f', marginBottom: '20px' }}>
              🏛️ Brownstone Not Found
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              The brownstone "@{username}" doesn't exist or hasn't been published yet.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Determine if Sequential Dimensional grid should be shown
  const showSeqDimGrid = sequentialDimensional && ((playingWindows.size > 0 && playbackMode) || buskerWindows.size > 0);
  
  // Show fullscreen overlay for single video playing in non-seq-dim mode
  const showFullscreenOverlay = !sequentialDimensional && playingWindows.size === 1 && playbackMode !== 'cacophony';
  
  const gridWindows = buskerMode ? buskerWindows : playingWindows;

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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

      <style>
        {`
          @keyframes buskerDance {
            0% { opacity: 0; transform: translateX(-50%) rotate(0deg); }
            5% { opacity: 1; transform: translateX(-50%) rotate(0deg); }
            10% { transform: translateX(-50%) rotate(-8deg); }
            15% { transform: translateX(-50%) rotate(8deg); }
            20% { transform: translateX(-50%) rotate(-8deg); }
            25% { transform: translateX(-50%) rotate(8deg); }
            30% { transform: translateX(-50%) rotate(-8deg); }
            35% { transform: translateX(-50%) rotate(8deg); }
            40% { transform: translateX(-50%) rotate(-6deg); }
            45% { transform: translateX(-50%) rotate(6deg); }
            50% { transform: translateX(-50%) rotate(-6deg); }
            55% { transform: translateX(-50%) rotate(6deg); }
            60% { transform: translateX(-50%) rotate(-4deg); }
            65% { transform: translateX(-50%) rotate(4deg); }
            70% { transform: translateX(-50%) rotate(-2deg); }
            75% { transform: translateX(-50%) rotate(2deg); }
            80% { transform: translateX(-50%) rotate(0deg); }
            85% { opacity: 1; transform: translateX(-50%) rotate(0deg); }
            100% { opacity: 0; transform: translateX(-50%) rotate(0deg); }
          }
        `}
      </style>

      <Header />

      <div style={{
        display: 'flex',
        flex: 1,
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '20px',
        gap: '20px',
        width: '100%'
      }}>
        <div style={{ flex: '0 0 250px', minWidth: '250px' }}>
          <LeftSidebar brownstone={brownstone} isOwner={isOwner} />
        </div>

        <div style={{ flex: 1, minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div 
            style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: 832,
              aspectRatio: '832 / 1500',
              marginBottom: '30px'
            }}
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/130669447_brownstone_desaturated.png"
              alt="CityBlocks Brownstone"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
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
                opacity: 0.5,
                pointerEvents: 'none'
              }}
            />

            {/* Regular brownstone windows (hidden when seq dim or fullscreen is active) */}
            {!showSeqDimGrid && !showFullscreenOverlay && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const position = windowPositions[num];
              const videoUrl = brownstone[`window_${num}_url`];
              const videoType = brownstone[`window_${num}_type`];
              
              if (!videoUrl) return null;
              
              const isPlaying = playingWindows.has(num);
              const isBuskerPlaying = buskerWindows.has(num);
              const volume = windowVolumes[num] || 1.0;
              
              return (
                <VideoWindow
                  key={num}
                  windowNumber={num}
                  videoUrl={videoUrl}
                  videoType={videoType}
                  position={position}
                  isPlaying={isPlaying}
                  isBuskerPlaying={isBuskerPlaying}
                  isMuted={isMuted}
                  volume={volume}
                  onEnded={() => handleVideoEnded(num)}
                  isGridMode={false}
                />
              );
            })}

            {/* Fullscreen Single Video Overlay */}
            {showFullscreenOverlay && Array.from(playingWindows).map((windowNum) => {
              const videoUrl = brownstone[`window_${windowNum}_url`];
              const videoType = brownstone[`window_${windowNum}_type`];
              
              if (!videoUrl) return null;
              
              const volume = windowVolumes[windowNum] || 1.0;
              
              return (
                <div
                  key={windowNum}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '18%',
                    width: '64%',
                    height: '40%',
                    zIndex: 20,
                    background: '#000',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(76, 175, 80, 0.8)',
                    border: '3px solid #4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <VideoWindow
                    windowNumber={windowNum}
                    videoUrl={videoUrl}
                    videoType={videoType}
                    position={{ top: '0', left: '0', width: '100%', height: '100%' }}
                    isPlaying={true}
                    isBuskerPlaying={false}
                    isMuted={isMuted}
                    volume={volume}
                    onEnded={() => handleVideoEnded(windowNum)}
                    isGridMode={true}
                  />
                </div>
              );
            })}

            {/* Sequential Dimensional Grid Overlay */}
            {showSeqDimGrid && (
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '22%',
                  width: '56%',
                  height: '26%',
                  zIndex: 20,
                  background: 'rgba(0, 0, 0, 0.95)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${getGridLayout(gridWindows.size).cols}, 1fr)`,
                  gridTemplateRows: `repeat(${getGridLayout(gridWindows.size).rows}, 1fr)`,
                  gap: '4px',
                  padding: '4px'
                }}
              >
                {Array.from(gridWindows).map((windowNum, index) => {
                  const videoUrl = brownstone[`window_${windowNum}_url`];
                  const videoType = brownstone[`window_${windowNum}_type`];
                  
                  if (!videoUrl) return null;
                  
                  const volume = windowVolumes[windowNum] || 1.0;
                  
                  return (
                    <div
                      key={windowNum}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#000',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 0 15px rgba(76, 175, 80, 0.8)',
                        border: '2px solid #4ade80',
                        position: 'relative'
                      }}
                    >
                      <VideoWindow
                        windowNumber={windowNum}
                        videoUrl={videoUrl}
                        videoType={videoType}
                        position={{ top: '0', left: '0', width: '100%', height: '100%' }}
                        isPlaying={playingWindows.has(windowNum)}
                        isBuskerPlaying={buskerWindows.has(windowNum)}
                        isMuted={isMuted}
                        volume={volume}
                        onEnded={() => handleVideoEnded(windowNum)}
                        isGridMode={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Left Window - Let's Collaborate */}
            <div
              onClick={() => setShowCollaborateModal(true)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              style={{
                position: 'absolute',
                bottom: '20.5%',
                left: '8%',
                width: '16%',
                height: '10%',
                cursor: 'pointer',
                zIndex: 100,
                transition: 'background-color 0.3s',
                border: '2px solid transparent'
              }}
              title="🤝 Let's Collaborate"
            />

            {/* Bottom Right Window - For Hire */}
            <div
              onClick={() => setShowForHireModal(true)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              style={{
                position: 'absolute',
                bottom: '20.5%',
                right: '8%',
                width: '16%',
                height: '10%',
                cursor: 'pointer',
                zIndex: 100,
                transition: 'background-color 0.3s',
                border: '2px solid transparent'
              }}
              title="💼 For Hire"
            />

            {/* Doorway - About */}
            <div
              onClick={() => alert(`About ${brownstone.display_name}\n\n${brownstone.bio || 'No bio available'}\n\nCategory: ${brownstone.category}`)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              style={{
                position: 'absolute',
                bottom: '4%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '14%',
                height: '16%',
                cursor: 'pointer',
                zIndex: 100,
                transition: 'background-color 0.3s',
                border: '2px solid transparent'
              }}
              title="ℹ️ About"
            />

            {showBusker && (
              <img 
                src="https://raw.githubusercontent.com/CityBlocks1997/cityblocks/main/images/Busker_Brownstone_transparent.png"
                alt="I. Otto Shuda"
                style={{
                  position: 'absolute',
                  bottom: '3%',
                  left: '50%',
                  width: '30%',
                  maxWidth: '250px',
                  height: 'auto',
                  zIndex: 15,
                  pointerEvents: 'none',
                  animation: 'buskerDance 16s ease-in-out forwards',
                  transformOrigin: 'bottom center'
                }}
              />
            )}
          </div>

          <div style={{
            width: '100%',
            maxWidth: '800px',
            background: 'linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            marginBottom: '30px'
          }}>
            
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Button
                onClick={() => setSequentialDimensional(!sequentialDimensional)}
                className={`h-16 font-bold text-lg ${
                  sequentialDimensional 
                    ? 'bg-purple-500 hover:bg-purple-600 ring-4 ring-purple-300' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(138,43,226,0.8)]'
                } text-white w-full`}
              >
                <Grid3x3 className="w-6 h-6 mr-3" />
                Sequential Dimensional™ {sequentialDimensional ? 'ON' : 'OFF'}
              </Button>
              {sequentialDimensional && (
                <p style={{ color: '#f5f5dc', fontSize: '0.9rem', marginTop: '8px' }}>
                  📐 The "William Castle Effect" - Videos appear progressively in grid layouts
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <Button
                onClick={playSequential}
                className={`h-16 font-semibold ${
                  playbackMode === 'sequential' 
                    ? 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(76,175,80,0.8)]'
                } text-[#2d5016]`}
              >
                <Play className="w-5 h-5 mr-2" />
                Sequential
              </Button>
              <Button
                onClick={playRandom}
                className={`h-16 font-semibold ${
                  playbackMode === 'random' 
                    ? 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(76,175,80,0.8)]'
                } text-[#2d5016]`}
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Random
              </Button>
              <Button
                onClick={playCacophony}
                className={`h-16 font-semibold ${
                  playbackMode === 'cacophony' 
                    ? 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(76,175,80,0.8)]'
                } text-[#2d5016]`}
              >
                <Layers className="w-5 h-5 mr-2" />
                Cacophony
              </Button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input
                  placeholder="Custom Sequence (e.g., 1,12,4,7)"
                  value={customSequence}
                  onChange={(e) => setCustomSequence(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && playCustomSequence()}
                  className="bg-white/80 h-12 text-base flex-1"
                />
                <Button
                  onClick={playCustomSequence}
                  className="h-12 bg-[rgba(222,184,135,0.8)] hover:bg-[rgba(76,175,80,0.9)] text-[#2d5016] font-semibold px-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <Button
                onClick={stopPlayback}
                className="h-14 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
              <Button
                onClick={toggleSound}
                className={`h-14 font-semibold ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                Sound {isMuted ? 'ON' : 'OFF'}
              </Button>
              <Button
                onClick={toggleBuskerMode}
                className={`h-14 font-semibold ${
                  buskerMode 
                    ? 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(76,175,80,0.8)]'
                } text-[#2d5016]`}
              >
                🎸 Busker Mode
              </Button>
            </div>

            {buskerMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input
                    placeholder="Busker Sequence (e.g., 11,0,2,0,0,3 - 0 = metronome click)"
                    value={buskerSequence}
                    onChange={(e) => setBuskerSequence(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && playBuskerSequence()}
                    className="bg-white/80 h-12 text-base flex-1"
                  />
                  <Button
                    onClick={playBuskerSequence}
                    className="h-12 bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginTop: '-4px' }}>
                  🥁 Pro Tip: Use multiple 0s for longer beat spacing (0,0,0 = 3 clicks before next layer)
                </p>
                {lastBuskerSequence && (
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                    Last sequence: {lastBuskerSequence}
                  </div>
                )}
              </div>
            )}
          </div>

          {status && (
            <div style={{
              textAlign: 'center',
              marginTop: '32px',
              color: '#4a2c1f',
              fontSize: '1.125rem',
              fontWeight: 500,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '16px',
              maxWidth: '800px',
              marginBottom: '30px'
            }}>
              {status}
            </div>
          )}

          <div style={{
            width: '100%',
            maxWidth: '832px',
            background: 'linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h1 style={{ color: '#d4af37', fontSize: '2rem', marginBottom: '10px' }}>
              @{brownstone.username}
            </h1>
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '10px' }}>
              {brownstone.display_name}
            </h2>
            <p style={{ color: '#f5f5dc', fontSize: '1rem', marginBottom: '15px' }}>
              {brownstone.category}
            </p>
            {brownstone.bio && (
              <p style={{ color: '#f5f5dc', fontSize: '1rem', lineHeight: '1.6' }}>
                {brownstone.bio}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
              <Button
                onClick={handleLike}
                disabled={!currentUser}
                className={`h-12 font-semibold ${
                  isLiked 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(255,100,100,0.8)]'
                } text-white`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {brownstone.total_likes || 0} Likes
              </Button>
              <Button
                onClick={handleShare}
                className="h-12 font-semibold bg-[rgba(222,184,135,0.6)] hover:bg-[rgba(76,175,80,0.8)] text-[#2d5016]"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              {!isOwner && <ReportButton brownstone={brownstone} currentUser={currentUser} />}
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            color: '#4a2c1f',
            fontSize: '0.875rem',
            opacity: 0.7
          }}>
            No news. No politics. No Karen videos. Just creators.
          </div>
        </div>

        <div style={{ flex: '0 0 250px', minWidth: '250px' }}>
          <RightSidebar brownstone={brownstone} isOwner={isOwner} />
        </div>
      </div>

      {/* Let's Collaborate Modal */}
      {showCollaborateModal && (
        <div
          onClick={() => setShowCollaborateModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ color: '#4a2c1f', fontSize: '1.8rem', marginBottom: '20px' }}>🤝 Let's Collaborate</h2>
            {brownstone.collaborate_text ? (
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {brownstone.collaborate_text}
              </p>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                No collaboration information available yet.
              </p>
            )}
            <Button
              onClick={() => setShowCollaborateModal(false)}
              className="mt-6 bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-bold h-12 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* For Hire Modal */}
      {showForHireModal && (
        <div
          onClick={() => setShowForHireModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ color: '#4a2c1f', fontSize: '1.8rem', marginBottom: '20px' }}>💼 For Hire</h2>
            {brownstone.for_hire_text ? (
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {brownstone.for_hire_text}
              </p>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                No hire information available yet.
              </p>
            )}
            <Button
              onClick={() => setShowForHireModal(false)}
              className="mt-6 bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-bold h-12 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function VideoWindow({ 
  windowNumber,
  videoUrl,
  videoType,
  position, 
  isPlaying, 
  isBuskerPlaying,
  isMuted, 
  volume = 1.0,
  onEnded,
  isGridMode = false
}) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying || isBuskerPlaying) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
      videoRef.current.play().catch(err => console.log('Playback prevented:', err));
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isPlaying, isBuskerPlaying, isMuted, volume]);

  const handleEnded = () => {
    if (onEnded && !isBuskerPlaying) {
      onEnded();
    }
  };

  if (videoType === 'youtube') {
    const youtubeId = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
      ? videoUrl.split('/').pop().split('?')[0]
      : videoUrl;

    return (
      <div
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          overflow: 'hidden',
          zIndex: isGridMode ? 1 : ((isPlaying || isBuskerPlaying) ? 10 : 2),
          boxShadow: !isGridMode && (isPlaying || isBuskerPlaying) ? '0 0 30px rgba(76, 175, 80, 0.8)' : 'none',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying || isBuskerPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}&rel=0&modestbranding=1`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        overflow: 'hidden',
        transition: !isGridMode ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        zIndex: isGridMode ? 1 : ((isPlaying || isBuskerPlaying) ? 10 : 2),
        boxShadow: !isGridMode && (isPlaying || isBuskerPlaying) ? '0 0 30px rgba(76, 175, 80, 0.8)' : 'none',
        filter: !isGridMode && (isPlaying || isBuskerPlaying) ? 'brightness(1.15)' : 'brightness(1)',
        animation: !isGridMode && (isPlaying || isBuskerPlaying) ? 'glow 1.5s ease-in-out infinite' : 'none'
      }}
    >
      {!isGridMode && (
        <style>
          {`
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.8); }
              50% { box-shadow: 0 0 40px rgba(76, 175, 80, 1); }
            }
          `}
        </style>
      )}
      {videoType === 'audio' ? (
        <audio
          ref={videoRef}
          loop={isBuskerPlaying}
          onEnded={handleEnded}
          style={{ display: 'none' }}
        >
          <source src={videoUrl} />
        </audio>
      ) : (
        <video
          ref={videoRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loop={isBuskerPlaying}
          playsInline
          onEnded={handleEnded}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function LeftSidebar({ brownstone, isOwner }) {
  const episodes = [];
  for (let i = 1; i <= 12; i++) {
    if (brownstone[`window_${i}_url`]) {
      episodes.push({
        number: i,
        type: brownstone[`window_${i}_type`] || 'video',
        url: brownstone[`window_${i}_url`],
        title: brownstone[`window_${i}_title`] || `Window ${i}`
      });
    }
  }

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
        color: '#ffffff',
        fontSize: '1.2rem',
        marginBottom: '15px',
        padding: '12px',
        background: 'linear-gradient(135deg, #4a2c1f 0%, #6b4423 100%)',
        border: '2px solid #4a2c1f',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
      }}>
        {isOwner ? 'My Episodes' : 'Episodes'}
      </h3>
      
      <ul style={{ listStyle: 'none' }}>
        {episodes.map((episode) => (
          <li
            key={episode.number}
            style={{
              padding: '12px 15px',
              background: 'rgba(222, 184, 135, 0.6)',
              borderRadius: '8px',
              marginBottom: '8px',
              border: '1px solid rgba(139, 90, 60, 0.3)',
              color: '#2d5016',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}
          >
            {episode.title} - {episode.type === 'youtube' ? '📺' : episode.type === 'audio' ? '🎵' : '🎬'}
          </li>
        ))}
      </ul>
      
      {episodes.length === 0 && (
        <p style={{ color: '#f5f5dc', textAlign: 'center', padding: '20px' }}>
          No episodes yet
        </p>
      )}
    </div>
  );
}

function RightSidebar({ brownstone, isOwner }) {
  if (isOwner) {
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
          color: '#ffffff',
          fontSize: '1.2rem',
          marginBottom: '15px',
          padding: '12px',
          background: 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)',
          border: '2px solid #b8941f',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 3px 10px rgba(212, 175, 55, 0.5)'
        }}>
          Window Manager
        </h3>
        
        <p style={{ color: '#f5f5dc', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>
          Go to Customize page to edit your windows
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const hasContent = brownstone[`window_${num}_url`];
            return (
              <div
                key={num}
                style={{
                  padding: '10px',
                  background: hasContent ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(139, 90, 60, 0.3)',
                  color: '#f5f5dc',
                  fontSize: '0.9rem'
                }}
              >
                Window {num}: {hasContent ? '✅' : '❌'}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
        color: '#ffffff',
        fontSize: '1.2rem',
        marginBottom: '15px',
        padding: '12px',
        background: 'linear-gradient(135deg, #4a2c1f 0%, #6b4423 100%)',
        border: '2px solid #4a2c1f',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
      }}>
        About This Creator
      </h3>
      
      <div style={{ color: '#f5f5dc', fontSize: '1rem', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#d4af37' }}>Category:</strong><br />
          {brownstone.category}
        </p>
        
        <p style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#d4af37' }}>Total Likes:</strong><br />
          ❤️ {brownstone.total_likes || 0}
        </p>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(212, 175, 55, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
            🎨 Powered by CityBlocks
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            Where Pure Creativity Resides
          </p>
        </div>
      </div>
    </div>
  );
}
