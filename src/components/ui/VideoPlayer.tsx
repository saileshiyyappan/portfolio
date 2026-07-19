'use client';

import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  X,
  Loader2,
  PictureInPicture,
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerContent = memo(function VideoPlayerContent({
  src,
  poster,
  title,
  isOpen,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { openModal, closeModal } = useModal();

  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    hideControls();
  }, [hideControls]);

  useEffect(() => {
    if (isOpen) {
      openModal();
      setShowControls(true);
      setIsLoading(true);
    }
    return () => {
      closeModal();
    };
  }, [isOpen, openModal, closeModal]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => { setDuration(video.duration); setIsLoading(false); };
    const onLoadedData = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onVolumeChange = () => { setIsMuted(video.muted); setVolume(video.volume); };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('volumechange', onVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, [isOpen]);

  useEffect(() => {
    hideControls();
    return () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); };
  }, [isPlaying, hideControls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const video = videoRef.current;
      if (!video) return;
      switch (e.key) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); break;
        case 'ArrowRight': e.preventDefault(); video.currentTime = Math.min(duration, video.currentTime + 5); break;
        case 'm': case 'M': e.preventDefault(); toggleMute(); break;
        case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
        case 'Escape': e.preventDefault(); onClose(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, duration]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = parseFloat(e.target.value);
    video.volume = v;
    video.muted = v === 0;
    setVolume(v);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
    setCurrentTime(video.currentTime);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // fullscreen not supported
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP not supported
    }
  }, []);

  const formatTime = useCallback((t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-void/95 backdrop-blur-xl flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top-right Close Button - always visible */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[210] flex items-center gap-2 px-4 py-2.5 rounded-full glass hover:bg-white/10 transition-colors"
        aria-label="Close video"
      >
        <X size={16} className="text-white" />
        <span className="font-body text-sm text-white hidden sm:inline">Close</span>
      </button>

      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-4 aspect-video rounded-2xl overflow-hidden bg-void"
        onMouseMove={handleMouseMove}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          muted={isMuted}
          playsInline
          preload="metadata"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none bg-void/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 size={40} className="text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Play/Pause Button */}
        <AnimatePresence>
          {!isPlaying && !isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div
                className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              >
                <Play size={36} className="text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-between pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top */}
              <div className="p-4 bg-gradient-to-b from-void/60 to-transparent pointer-events-auto">
                {title && <h3 className="font-heading text-white text-lg">{title}</h3>}
              </div>

              {/* Bottom Controls */}
              <div className="p-4 bg-gradient-to-t from-void/80 to-transparent pointer-events-auto">
                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#06b6d4' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
                    </button>

                    {/* Volume with slider */}
                    <div
                      className="relative flex items-center"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
                      </button>
                      <AnimatePresence>
                        {showVolumeSlider && (
                          <motion.div
                            className="absolute left-10 top-1/2 -translate-y-1/2 glass rounded-full px-3 py-1.5"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                          >
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                              style={{ accentColor: '#06b6d4' }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="font-body text-xs text-white/70 hidden sm:inline whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    {/* Playback Speed */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                        className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Playback speed"
                      >
                        <Settings size={14} className="text-white" />
                      </button>
                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            className="absolute bottom-12 right-0 glass rounded-xl p-2 space-y-1 z-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {rates.map((rate) => (
                              <button
                                key={rate}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlaybackRate(rate);
                                  if (videoRef.current) videoRef.current.playbackRate = rate;
                                  setShowSettings(false);
                                }}
                                className={`block w-full text-left px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${
                                  playbackRate === rate ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white hover:bg-white/10'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* PiP */}
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePiP(); }}
                      className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors hidden sm:flex"
                      aria-label="Picture in picture"
                    >
                      <PictureInPicture size={14} className="text-white" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                      className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Fullscreen"
                    >
                      {isFullscreen ? <Minimize size={16} className="text-white" /> : <Maximize size={16} className="text-white" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default function VideoPlayer(props: VideoPlayerProps) {
  return <VideoPlayerContent {...props} />;
}
