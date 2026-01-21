import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef();

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Start hide timer when entering fullscreen
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [isFullscreen]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePlaybackRateChange = (e) => {
    const rate = Number(e.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  // Sync volume and playback rate on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.muted = isMuted;
    }
  }, [volume, playbackRate, isMuted]);

  // Keyboard shortcuts like YouTube
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration);
          break;
        case 'ArrowLeft':
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
          break;
        case 'ArrowUp':
          setVolume((v) => Math.min(v + 0.05, 1));
          break;
        case 'ArrowDown':
          setVolume((v) => Math.max(v - 0.05, 0));
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, togglePlayPause, toggleMute, toggleFullscreen]);

  // Double-click to toggle fullscreen
  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg ${isFullscreen ? 'fullscreen-video' : ''}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        onDoubleClick={handleDoubleClick}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Video Controls BELOW the video, auto-hide in fullscreen */}
      <div
        className={`w-full bg-gradient-to-t from-black/90 to-black/60 p-4 flex flex-col gap-3 transition-opacity duration-300
          ${isFullscreen ? 'fixed left-0 right-0 bottom-0 z-50' : ''}
          ${isFullscreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <div className="flex items-center gap-4 justify-center">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="rounded-full bg-white/10 hover:bg-blue-600 text-white p-3 transition duration-200 shadow-lg"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="rounded-full bg-white/10 hover:bg-blue-600 text-white p-3 transition duration-200 shadow-lg"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="accent-blue-500 h-2 w-24 rounded-lg"
            />
          </div>

          {/* Playback Speed Selector */}
          <select
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            className="bg-black/70 text-white rounded px-2 py-1 border border-blue-500 focus:outline-none"
            aria-label="Playback Speed"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>

          {/* Fullscreen/Minimize Button (in the same row) */}
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-white/10 hover:bg-blue-600 text-white p-3 transition duration-200 shadow-lg"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={24}/> : <Maximize2 size={24}/>}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full mt-2 gap-2">
          <span className="text-white text-xs font-mono">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="accent-blue-500 h-2 flex-1 rounded-lg"
          />
          <span className="text-white text-xs font-mono">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editorial;