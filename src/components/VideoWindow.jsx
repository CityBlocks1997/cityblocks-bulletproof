import React, { useRef, useEffect } from 'react';

export default function VideoWindow({ 
  video, 
  position, 
  isPlaying, 
  isBuskerPlaying,
  isMuted, 
  volume = 1.0,
  onEnded,
  onWindowClick 
}) {
  const videoRef = useRef(null);

  useEffect(() => {
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
      className={`absolute overflow-hidden rounded cursor-pointer transition-all duration-300 ${
        (isPlaying || isBuskerPlaying) ? 'ring-4 ring-[#d4af37] shadow-2xl scale-105' : ''
      }`}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
      }}
      onClick={onWindowClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        loop={isBuskerPlaying}
        playsInline
        onEnded={handleEnded}
      >
        <source src={video.video_url} type="video/mp4" />
      </video>
      {/* Window number badge */}
      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {video.window_position}
      </div>
    </div>
  );
}