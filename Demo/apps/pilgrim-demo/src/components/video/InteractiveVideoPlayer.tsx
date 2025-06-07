'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { PlayCircle, PauseCircle, Volume2, VolumeX, Maximize } from 'lucide-react';

interface InteractionPoint {
  id: string;
  timeStart: number;
  timeEnd: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  content: React.ReactNode;
  isDecision?: boolean;
}

interface InteractiveVideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  interactionPoints?: InteractionPoint[];
  onVideoEnd?: () => void;
  onDecisionMade?: (id: string, choice: string) => void;
  className?: string;
  autoPlay?: boolean;
}

const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoSrc,
  posterSrc,
  interactionPoints = [],
  onVideoEnd,
  onDecisionMade,
  className = '',
  autoPlay = false,
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeInteractions, setActiveInteractions] = useState<string[]>([]);
  const [buffering, setBuffering] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Handle video progress updates
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);

    // Check for interaction points that should be active
    const currentTime = state.playedSeconds;
    const active = interactionPoints
      .filter(point => currentTime >= point.timeStart && currentTime <= point.timeEnd)
      .map(point => point.id);

    if (JSON.stringify(active) !== JSON.stringify(activeInteractions)) {
      setActiveInteractions(active);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    setPlaying(!playing);
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Update fullscreen state based on document state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle decision button click
  const handleDecision = (interactionId: string, choice: string) => {
    if (onDecisionMade) {
      onDecisionMade(interactionId, choice);
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-black overflow-hidden ${className}`}
    >
      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={handleVideoEnd}
        onBuffer={() => setBuffering(true)}
        onBufferEnd={() => setBuffering(false)}
        config={{
          file: {
            attributes: {
              poster: posterSrc || '',
            },
          },
        }}
      />

      {/* Buffer Indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play/Pause Overlay (shows briefly when clicking) */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      >
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0' : 'opacity-100'}`}>
          <PlayCircle className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-100 transition-opacity hover:opacity-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white focus:outline-none">
              {playing ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </button>
            <button onClick={toggleMute} className="text-white focus:outline-none">
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            {/* Volume Slider */}
            <div className="hidden sm:flex items-center w-24">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-4 h-1 bg-white/20 rounded overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${played * 100}%` }}
            ></div>
          </div>

          {/* Fullscreen Button */}
          <button onClick={toggleFullscreen} className="text-white focus:outline-none">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Interaction Points */}
      {activeInteractions.map(id => {
        const interaction = interactionPoints.find(point => point.id === id);
        if (!interaction) return null;

        let positionClass = '';
        switch (interaction.position) {
          case 'top-left':
            positionClass = 'top-8 left-8';
            break;
          case 'top-right':
            positionClass = 'top-8 right-8';
            break;
          case 'bottom-left':
            positionClass = 'bottom-16 left-8';
            break;
          case 'bottom-right':
            positionClass = 'bottom-16 right-8';
            break;
          case 'center':
          default:
            positionClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            break;
        }

        return (
          <div
            key={id}
            className={`absolute ${positionClass} transition-all duration-300 ease-in-out z-30`}
          >
            {interaction.content}
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveVideoPlayer;
