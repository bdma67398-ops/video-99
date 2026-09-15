import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { VideoItem, AdSettings } from '../types';
import { sanitizeVideoUrl } from '../lib/videoService';

interface VideoPlayerProps {
  key?: React.Key;
  video: VideoItem;
  adSettings: AdSettings;
  isAdmin?: boolean;
  onAdTriggered?: () => void;
  onVideoEnd?: () => void;
}

export function VideoPlayer({
  video,
  adSettings,
  onAdTriggered,
  onVideoEnd
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------------------
  // 7-SECOND AD PAUSE & 30-SECOND AD VERIFICATION STATES
  // -------------------------------------------------------------
  const [isAdPaused, setIsAdPaused] = useState(false);
  const [hasAdTriggeredForThisVideo, setHasAdTriggeredForThisVideo] = useState(false);
  const [isAdUnlocked, setIsAdUnlocked] = useState(false);

  // Timer states for the 30-second ad countdown
  const [adWatchStarted, setAdWatchStarted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [adCompleted, setAdCompleted] = useState(false);

  const countdownIntervalRef = useRef<number | null>(null);

  // Reset player and ad states whenever the video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsAdPaused(false);
    setHasAdTriggeredForThisVideo(false);
    setIsAdUnlocked(false);
    setAdWatchStarted(false);
    setSecondsRemaining(30);
    setAdCompleted(false);
    setVideoError(null);
    setIsLoading(false);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      videoRef.current.load();
    }
  }, [video.id, video.videoUrl]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Time update listener: Triggers the Ad Lock exactly at 7 seconds
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // If 7 seconds reached and ad hasn't been triggered or unlocked yet
    if (curr >= 7 && !hasAdTriggeredForThisVideo && !isAdUnlocked) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsAdPaused(true);
      setHasAdTriggeredForThisVideo(true);

      if (onAdTriggered) {
        onAdTriggered();
      }
    }
  };

  const handleLoadedMetadata = () => {
    setIsLoading(false);
    setVideoError(null);
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    console.error('Video failed to load:', video.videoUrl);
    setVideoError('ভিডিও লিঙ্কটি লোড করা যাচ্ছে না। দয়া করে লিঙ্কটি সঠিক সরাসরি (.mp4) ভিডিও কি না পরীক্ষা করুন অথবা অন্য ভিডিও নির্বাচন করুন।');
  };

  const handleRetryVideo = () => {
    setVideoError(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsLoading(false);
      });
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    // If locked by 7-second ad modal, forbid playing until unlocked
    if (isAdPaused && !isAdUnlocked) {
      return;
    }

    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Seek bar handler: Prevent seeking past 7 seconds if ad hasn't been watched
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (!isAdUnlocked && targetTime >= 7) {
      // Lock and show ad immediately
      if (videoRef.current) {
        videoRef.current.currentTime = 7;
        setCurrentTime(7);
        videoRef.current.pause();
        setIsPlaying(false);
        setIsAdPaused(true);
        setHasAdTriggeredForThisVideo(true);
      }
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // USER CLICKS "অ্যাড দেখুন" (VIEW AD)
  // -------------------------------------------------------------
  const handleWatchAdClick = () => {
    // Open the sponsor/Adsterra Direct Link in a new tab
    const adUrl = adSettings.adsterraDirectLink || adSettings.pauseAdBannerLink || 'https://www.google.com';
    try {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
      window.location.href = adUrl;
    }

    // Start 30 seconds countdown
    if (!adWatchStarted) {
      setAdWatchStarted(true);
      setSecondsRemaining(30);

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setAdCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // -------------------------------------------------------------
  // USER CLICKS "এখন ভিডিও দেখুন" (RESUME VIDEO AFTER 30S AD)
  // -------------------------------------------------------------
  const handleResumeVideo = () => {
    setIsAdUnlocked(true);
    setIsAdPaused(false);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Resume video playback smoothly
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const playableUrl = sanitizeVideoUrl(video.videoUrl);

  return (
    <div className="w-full">
      {/* Video Cinema Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 group select-none"
      >
        <video
          ref={videoRef}
          src={playableUrl}
          poster={video.thumbnailUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => {
            setIsLoading(false);
            setVideoError(null);
          }}
          onError={handleVideoError}
          onEnded={() => {
            setIsPlaying(false);
            if (onVideoEnd) onVideoEnd();
          }}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Video Error Message Overlay */}
        {videoError && (
          <div className="absolute inset-0 z-35 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="max-w-md bg-zinc-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">ভিডিও প্লে করা যাচ্ছে না</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {videoError}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleRetryVideo}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> পুনরায় চেষ্টা করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Big Center Play Icon (before first play and when ad is not active and no error) */}
        {!isPlaying && !isAdPaused && !videoError && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-amber-500/90 hover:bg-amber-400 text-zinc-950 flex items-center justify-center pl-1 shadow-2xl transform hover:scale-110 transition-all duration-200">
              <Play className="w-10 h-10 fill-current" />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 7-SECOND AD MODAL OVERLAY (LOCK SCREEN)                       */}
        {/* ------------------------------------------------------------- */}
        {isAdPaused && !isAdUnlocked && (
          <div className="absolute inset-0 z-30 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-zinc-900/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden">
              
              {/* Top Warning Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>ভিডিও লক করা হয়েছে • স্পন্সর এড</span>
              </div>

              {/* Title & Prompt */}
              <h3 className="text-base sm:text-xl font-bold text-white mb-2 leading-snug">
                ফুল ভিডিও দেখতে হলে ৩০ সেকেন্ড এড দেখতে হবে
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed">
                নিচের <strong>"এড দেখুন"</strong> বাটনে ক্লিক করে স্পন্সর সাইটে ৩০ সেকেন্ড সময় দিন। সময় শেষ হলে <strong>"এখন ভিডিও দেখুন"</strong> বাটন দিয়ে সম্পূর্ণ ভিডিও আনলক হয়ে যাবে!
              </p>

              {/* Progress & Countdown Area */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 mb-5">
                {!adWatchStarted ? (
                  <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs sm:text-sm">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>প্রথমে নিচের <strong>"এড দেখুন"</strong> বাটনে ক্লিক করুন</span>
                  </div>
                ) : !adCompleted ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        বিজ্ঞাপন দেখা চলছে...
                      </span>
                      <span className="font-mono text-white text-sm">
                        {secondsRemaining} সেকেন্ড বাকি
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      বিজ্ঞাপনটি নতুন ট্যাবে খোলা হয়েছে, ৩০ সেকেন্ড সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করুন
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>বিজ্ঞাপন দেখা সম্পন্ন হয়েছে! সম্পূর্ণ ভিডিও আনলকড</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1. "এড দেখুন" বাটন */}
                <button
                  type="button"
                  onClick={handleWatchAdClick}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    !adWatchStarted 
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20 scale-105 animate-pulse'
                      : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{adWatchStarted ? 'আবার এড ওপেন করুন' : 'এড দেখুন'}</span>
                </button>

                {/* 2. "এখন ভিডিও দেখুন" বাটন */}
                {adCompleted ? (
                  <button
                    type="button"
                    onClick={handleResumeVideo}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 scale-105 animate-bounce transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>এখন ভিডিও দেখুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-zinc-800/60 text-zinc-500 flex items-center justify-center gap-2 cursor-not-allowed border border-zinc-800"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {adWatchStarted ? `অপেক্ষা করুন (${secondsRemaining}s)` : 'এখন ভিডিও দেখুন (লকড)'}
                    </span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PLAYER BOTTOM CONTROLS                                        */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          
          {/* Progress Seek Bar */}
          <div className="relative flex items-center mb-2.5">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-700/80 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
            {/* 7-second marker on seekbar to show user where the ad triggers */}
            {duration > 0 && !isAdUnlocked && (
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-amber-400 rounded-sm pointer-events-none"
                style={{ left: `${Math.min(100, (7 / duration) * 100)}%` }}
                title="৭ম সেকেন্ডে স্পন্সর এড"
              />
            )}
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 hover:text-amber-400 rounded-md transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={() => {
                    if (!videoRef.current) return;
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 hover:text-amber-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    setIsMuted(val === 0);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      videoRef.current.muted = val === 0;
                    }
                  }}
                  className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hidden sm:block"
                />
              </div>

              <span className="font-mono text-zinc-300 text-[11px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReplay}
                className="p-1.5 hover:text-amber-400 transition-colors"
                title="শুরু থেকে দেখুন (Replay)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:text-amber-400 transition-colors"
                title="ফুলস্ক্রিন"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Information Header Below Player */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{video.uploadDate}</span>
          <span className="text-xs text-zinc-400">• {video.views.toLocaleString()} বার দেখা হয়েছে</span>
          {isAdUnlocked && (
            <span className="text-[11px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> এড ভেরিফাইড
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          {video.title}
        </h1>

        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
}
