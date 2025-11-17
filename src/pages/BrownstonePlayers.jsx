import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Square, Volume2, VolumeX, Shuffle, Layers } from 'lucide-react';
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

export default function BrownstonePlayers() {
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
  const [showBusker, setShowBusker] = useState(false);
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

  // Fetch the 12 featured videos
  const { data: rawVideos = [] } = useQuery({
    queryKey: ['featured-videos'],
    queryFn: async () => {
      const result = await base44.entities.Video.filter({ is_featured: true });
      return result.map(item => ({
        id: item.id,
        ...item.data,
        window_position: Math.round(item.data.window_position)
      }));
    },
  });

  const sortedVideos = [...rawVideos].sort((a, b) => (a.window_position || 0) - (b.window_position || 0));

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
    setPlaybackQueue(sortedVideos.map(v => v.window_position));
    setCurrentIndex(0);
    setStatus('Playing Sequential');
  };

  const playRandom = () => {
    stopPlayback();
    const shuffled = [...sortedVideos].sort(() => Math.random() - 0.5);
    setPlaybackMode('random');
    setPlaybackQueue(shuffled.map(v => v.window_position));
    setCurrentIndex(0);
    setStatus('Playing Random');
  };

  const playCacophony = () => {
    stopPlayback();
    setPlaybackMode('cacophony');
    const spotlightIndex = Math.floor(Math.random() * sortedVideos.length);
    const volumes = {};
    sortedVideos.forEach((video, index) => {
      const pos = video.window_position;
      volumes[pos] = index === spotlightIndex ? 1.0 : 0.3 + (Math.random() * 0.3);
    });
    setWindowVolumes(volumes);
    setPlayingWindows(new Set(sortedVideos.map(v => v.window_position)));
    setStatus(`🎚️ Cacophony: All 12 playing! "${sortedVideos[spotlightIndex].category}" above the crowd!`);
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
    setStatus(`🎯 Playing custom sequence: ${customSequence}`);
  };

  const toggleBuskerMode = () => {
    if (buskerMode) {
      stopPlayback();
    } else {
      stopPlayback();
      setBuskerMode(true);
      setShowBusker(true);
      setStatus('🎸 Busker Mode Active! Use 0 for metronome clicks. Multiple 0s = longer beat spacing.');
      
      // Hide I. Otto Shuda after 16 seconds
      setTimeout(() => {
        setShowBusker(false);
      }, 16000);
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
      // Play metronome click for timing/rhythm
      playMetronomeClick();
      setStatus('🥁 *click* - Metronome beat');
      setTimeout(() => processSequenceWithDelays(sequence, index + 1, currentWindows), 500);
      return;
    }
    
    if (num >= 1 && num <= 12) {
      const newWindows = new Set(currentWindows);
      newWindows.add(num);
      setBuskerWindows(newWindows);
      setStatus(`🎸 Layering ${newWindows.size} window${newWindows.size !== 1 ? 's' : ''}`);
    }
    setTimeout(() => processSequenceWithDelays(sequence, index + 1, currentWindows), 100);
  };

  useEffect(() => {
    if ((playbackMode === 'sequential' || playbackMode === 'random' || playbackMode === 'custom') && currentIndex < playbackQueue.length) {
      const windowPos = playbackQueue[currentIndex];
      setPlayingWindows(new Set([windowPos]));
      const video = sortedVideos.find(v => v.window_position === windowPos);
      if (video) {
        setStatus(`Now Playing: ${video.category} (${currentIndex + 1}/${playbackQueue.length})`);
      }
    }
  }, [playbackMode, currentIndex, playbackQueue, sortedVideos]);

  const handleVideoEnded = (windowPos) => {
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
  };

  const handleWindowClick = (category) => {
    if (!buskerMode && !playbackMode) {
      setSelectedCategory(category);
    }
  };

  const handleCreatorClick = (num) => {
    setSelectedCreatorNumber(num);
    setShowCreator(true);
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* City Street Background with Cream Overlay */}
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
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/9a1f61dc1_brownstone.png"
              alt="CityBlocks Brownstone"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            {/* Video Windows */}
            {sortedVideos.slice(0, 12).map((video) => {
              const position = windowPositions[video.window_position];
              if (!position) return null;
              
              const isPlaying = playingWindows.has(video.window_position);
              const isBuskerPlaying = buskerWindows.has(video.window_position);
              const volume = windowVolumes[video.window_position] || 1.0;
              
              return (
                <VideoWindow
                  key={video.id}
                  video={video}
                  position={position}
                  isPlaying={isPlaying}
                  isBuskerPlaying={isBuskerPlaying}
                  isMuted={isMuted}
                  volume={volume}
                  onEnded={() => handleVideoEnded(video.window_position)}
                  onWindowClick={() => handleWindowClick(video.category)}
                />
              );
            })}

            {/* I. OTTO SHUDA - Dancing Busker Brownstone Mascot */}
            {showBusker && (
              <img 
                src="https://raw.githubusercontent.com/CityBlocks1997/cityblocks/main/images/Busker_Brownstone_transparent.png"
                alt="I. Otto Shuda - Busker Brownstone Mascot"
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

          {/* Control Panel */}
          <div style={{
            width: '100%',
            maxWidth: '800px',
            background: 'linear-gradient(135deg, rgba(107, 68, 35, 0.95) 0%, rgba(139, 90, 60, 0.95) 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            
            {/* Playback Modes */}
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

            {/* Custom Sequence Input */}
            <div style={{ marginBottom: '24px' }}>
              <Input
                placeholder="Custom Sequence (e.g., 1,12,4,7) - Press Enter to Play"
                value={customSequence}
                onChange={(e) => setCustomSequence(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && playCustomSequence()}
                className="bg-white/80 h-12 text-base"
              />
            </div>

            {/* Control Buttons */}
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

            {/* Busker Mode Input */}
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

          {/* Status */}
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
              maxWidth: '800px'
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

// VideoWindow Component
function VideoWindow({ 
  video, 
  position, 
  isPlaying, 
  isBuskerPlaying,
  isMuted, 
  volume = 1.0,
  onEnded,
  onWindowClick 
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

  if (!video) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: (isPlaying || isBuskerPlaying) ? 10 : 2,
        boxShadow: (isPlaying || isBuskerPlaying) ? '0 0 30px rgba(76, 175, 80, 0.8)' : 'none',
        filter: (isPlaying || isBuskerPlaying) ? 'brightness(1.15)' : 'brightness(1)',
        animation: (isPlaying || isBuskerPlaying) ? 'glow 1.5s ease-in-out infinite' : 'none'
      }}
      onClick={onWindowClick}
    >
      <style>
        {`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.8); }
            50% { box-shadow: 0 0 40px rgba(76, 175, 80, 1); }
          }
        `}
      </style>
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '80%',
          objectFit: 'contain'
        }}
        loop={isBuskerPlaying}
        playsInline
        onEnded={handleEnded}
      >
        <source src={video.video_url} type="video/mp4" />
      </video>
      {/* Window number badge */}
      <div style={{
        position: 'absolute',
        top: 4,
        left: 4,
        background: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: '4px'
      }}>
        {video.window_position}
      </div>
    </div>
  );
}