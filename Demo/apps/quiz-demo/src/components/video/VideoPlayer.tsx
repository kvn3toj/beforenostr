import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  posterSrc,
  muted = true,
  loop = true,
  autoPlay = true,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      // Set up event listeners
      const video = videoRef.current;

      const onLoadedData = () => {
        setIsLoading(false);
      };

      const onPlay = () => {
        setIsLoading(false);
      };

      const onWaiting = () => {
        setIsLoading(true);
      };

      // Add event listeners
      video.addEventListener('loadeddata', onLoadedData);
      video.addEventListener('play', onPlay);
      video.addEventListener('waiting', onWaiting);

      // Ensure video playback when component mounts
      const playVideo = async () => {
        try {
          if (autoPlay) {
            await video.play();
          }
        } catch (error) {
          console.error('Video playback failed:', error);
          // If autoplay fails, we'll show the play button
          setIsLoading(false);
        }
      };

      playVideo();

      // Clean up
      return () => {
        video.removeEventListener('loadeddata', onLoadedData);
        video.removeEventListener('play', onPlay);
        video.removeEventListener('waiting', onWaiting);
      };
    }
  }, [autoPlay]);

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        loop={loop}
        muted={muted}
        autoPlay={autoPlay}
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
