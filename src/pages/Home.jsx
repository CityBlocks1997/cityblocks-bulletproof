import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Square, Volume2, VolumeX, Shuffle, Layers, Eye, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CategoryModal from '../components/CategoryModal';
import WelcomeModal from '../components/WelcomeModal';
import HowItWorksModal from '../components/HowItWorksModal';
import AboutModal from '../components/AboutModal';
import CreatorModal from '../components/CreatorModal';
import CustomizeModal from '../components/CustomizeModal';
import { getGridLayout } from '../components/SequentialDimensionalGrid';

export default function Home() {
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lastBuskerSequence, setLastBuskerSequence] = useState('');
  const [windowVolumes, setWindowVolumes] = useState({});
  const [featuredWindows, setFeaturedWindows] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sequentialDimensional, setSequentialDimensional] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  // Modal states
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedCreatorNumber, setSelectedCreatorNumber] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
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

  // Fetch homepage config
  const { data: homepageConfig } = useQuery({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const configs = await base44.entities.HomepageConfig.list();
      return configs.length > 0 ? configs[0] : null;
    }
  });

  // Fetch brownstones for each window
  useEffect(() => {
    const loadBrownstones = async () => {
      setIsLoading(true);
      
      if (!homepageConfig) {
        setIsLoading(false);
        return;
      }
      
      const windows = {};
      
      for (let i = 1; i <= 12; i++) {
        const brownstoneId = homepageConfig[`window_${i}_brownstone_id`];
        if (brownstoneId) {
          try {
            const brownstones = await base44.entities.Brownstone.filter({ id: brownstoneId });
            if (brownstones.length > 0) {
              windows[i] = brownstones[0];
            }
          } catch (err) {
            console.error(`Failed to load brownstone for window ${i}:`, err);
          }
        }
      }
      
      setFeaturedWindows(windows);
      setIsLoading(false);
    };
    
    loadBrownstones();
  }, [homepageConfig]);

  // Window positions for brownstone
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
    setStatus('Playback stopped');
    setTimeout(() => setStatus(''), 2000);
  };

  const playSequential = () => {
    stopPlayback();
    setPlaybackMode('sequential');
    setPlaybackQueue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    setCurrentIndex(0);
    setStatus(sequentialDimensional ? '📐 Sequential Dimensional™ Mode Active' : 'Playing Sequential');
  };

  const playRandom = () => {
    stopPlayback();
    const shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].sort(() => Math.random() - 0.5);
    setPlaybackMode('random');
    setPlaybackQueue(shuffled);
    setCurrentIndex(0);
    setStatus(sequentialDimensional ? '📐 Random Dimensional™ Mode Active' : 'Playing Random');
  };

  const playCacophony = () => {
    stopPlayback();
    setPlaybackMode('cacophony');
    const spotlightIndex = Math.floor(Math.random() * 12);
    const volumes = {};
    for (let i = 1; i <= 12; i++) {
      volumes[i] = i === spotlightIndex + 1 ? 1.0 : 0.3 + (Math.random() * 0.3);
    }
    setWindowVolumes(volumes);
    setPlayingWindows(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    setStatus(`🎚️ Cacophony: All 12 playing!`);
  };

  const playCustomSequence = () => {
    if (!customSequence.trim()) return;
    stopPlayback();
    const numbers = customSequence.split(',').map(n => parseInt(n.trim())).filter(n => n >= 1 && n <= 12);
    if (numbers.length === 0) {
      setStatus('❌ Please enter valid numbers (1-12)');
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
      setStatus('🎸 Busker Mode Active! Use 0 for metronome clicks. Multiple 0s = longer beat spacing.');
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
    
    if (num >= 1 && num <= 12) {
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
      if (sequentialDimensional) {
        const windowsToPlay = playbackQueue.slice(0, currentIndex + 1);
        setPlayingWindows(new Set(windowsToPlay));
        
        const { label } = getGridLayout(currentIndex + 1);
        setStatus(`📐 Sequential Dimensional™: ${label} (${currentIndex + 1}/${playbackQueue.length})`);
      } else {
        const windowPos = playbackQueue[currentIndex];
        setPlayingWindows(new Set([windowPos]));
        setStatus(`Now Playing: Window ${windowPos} (${currentIndex + 1}/${playbackQueue.length})`);
      }
    }
  }, [playbackMode, currentIndex, playbackQueue, sequentialDimensional]);

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

  const handleCreatorClick = (num) => {
    setSelectedCreatorNumber(num);
    setShowCreator(true);
  };

  // Determine if Sequential Dimensional grid should be shown
  const showSeqDimGrid = sequentialDimensional && ((playingWindows.size > 0 && playbackMode) || buskerWindows.size > 0);
  const gridWindows = buskerMode ? buskerWindows : playingWindows;

  if (isLoading) {
    return (
      <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#4a2c1f', fontSize: '1.5rem' }}>
            Loading homepage content...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* City Street Background */}
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

      {/* Main Content Wrapper - 3 Column Layout */}
      <div style={{
        display: 'flex',
        flex: 1,
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '20px',
        gap: '20px',
        width: '100%'
      }}>
        {/* LEFT SIDEBAR */}
        <div style={{ flex: '0 0 250px', minWidth: '250px' }}>
          <LeftSidebar 
            onHowItWorksClick={() => setShowHowItWorks(true)}
            onAboutClick={() => setShowAbout(true)}
            onCustomizeClick={() => setShowCustomize(true)}
            onCreatorClick={handleCreatorClick}
          />
        </div>

        {/* CENTER - BROWNSTONE */}
        <div style={{ flex: 1, minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Featured Creator Info */}
          <div style={{
            width: '100%',
            maxWidth: '832px',
            background: 'linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '8px' }}>
              🏛️ Featured Creators Showcase
            </h2>
            <p style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              12 Windows • 12 Categories • Pure Creativity
            </p>
          </div>

          {/* Brownstone Container */}
          <div 
            style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: 832,
              aspectRatio: '832 / 1500',
              marginBottom: '30px'
            }}
          >
            {/* Base desaturated brownstone */}
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

            {/* Color layer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                backgroundColor: '#8B5A3C',
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

            {/* Regular brownstone windows (hidden when seq dim is active) */}
            {!showSeqDimGrid && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const position = windowPositions[num];
              const brownstone = featuredWindows[num];
              
              if (!brownstone) return null;
              
              const videoUrl = brownstone.window_1_url;
              const videoType = brownstone.window_1_type;
              
              if (!videoUrl) return null;
              
              const isPlaying = playingWindows.has(num);
              const isBuskerPlaying = buskerWindows.has(num);
              const volume = windowVolumes[num] || 1.0;
              
              return (
                <BrownstoneWindow
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
                  brownstone={brownstone}
                  isGridMode={false}
                />
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
                {Array.from(gridWindows).map((windowNum) => {
                  const brownstone = featuredWindows[windowNum];
                  if (!brownstone) return null;
                  
                  const videoUrl = brownstone.window_1_url;
                  const videoType = brownstone.window_1_type;
                  
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
                      <BrownstoneWindow
                        windowNumber={windowNum}
                        videoUrl={videoUrl}
                        videoType={videoType}
                        position={{ top: '0', left: '0', width: '100%', height: '100%' }}
                        isPlaying={playingWindows.has(windowNum)}
                        isBuskerPlaying={buskerWindows.has(windowNum)}
                        isMuted={isMuted}
                        volume={volume}
                        onEnded={() => handleVideoEnded(windowNum)}
                        brownstone={brownstone}
                        isGridMode={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Control Panel */}
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
              <Input
                placeholder="Custom Sequence (e.g., 1,12,4,7) - Press Enter to Play"
                value={customSequence}
                onChange={(e) => setCustomSequence(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && playCustomSequence()}
                className="bg-white/80 h-12 text-base"
              />
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
                Sound {isMuted ? 'OFF' : 'ON'}
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
                <Input
                  placeholder="Busker Sequence (e.g., 11,0,2,0,0,3 - 0 = metronome click)"
                  value={buskerSequence}
                  onChange={(e) => setBuskerSequence(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && playBuskerSequence()}
                  className="bg-white/80 h-12 text-base"
                />
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
            textAlign: 'center',
            marginTop: '16px',
            color: '#4a2c1f',
            fontSize: '0.875rem',
            opacity: 0.7
          }}>
            No news. No politics. No Karen videos. Just creators.
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ flex: '0 0 250px', minWidth: '250px' }}>
          <RightSidebar onCategoryClick={setSelectedCategory} />
        </div>
      </div>

      <Footer />

      {/* All Modals */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <CustomizeModal isOpen={showCustomize} onClose={() => setShowCustomize(false)} />
      <CreatorModal 
        isOpen={showCreator} 
        onClose={() => setShowCreator(false)} 
        creatorNumber={selectedCreatorNumber}
      />
      <CategoryModal 
        category={selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
      />
    </div>
  );
}

function BrownstoneWindow({ 
  windowNumber,
  videoUrl,
  videoType,
  position, 
  isPlaying, 
  isBuskerPlaying,
  isMuted, 
  volume = 1.0,
  onEnded,
  brownstone,
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
        onClick={() => !isGridMode && (window.location.href = `/UserBrownstone?username=${brownstone.username}`)}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          overflow: 'hidden',
          zIndex: isGridMode ? 1 : ((isPlaying || isBuskerPlaying) ? 10 : 2),
          boxShadow: !isGridMode && (isPlaying || isBuskerPlaying) ? '0 0 30px rgba(76, 175, 80, 0.8)' : 'none',
          cursor: isGridMode ? 'default' : 'pointer'
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
            border: 'none',
            pointerEvents: 'none'
          }}
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => !isGridMode && (window.location.href = `/UserBrownstone?username=${brownstone.username}`)}
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
        animation: !isGridMode && (isPlaying || isBuskerPlaying) ? 'glow 1.5s ease-in-out infinite' : 'none',
        cursor: isGridMode ? 'default' : 'pointer'
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
            objectFit: 'cover',
            pointerEvents: 'none'
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