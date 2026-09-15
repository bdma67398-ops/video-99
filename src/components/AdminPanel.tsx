import React, { useState, useRef } from 'react';
import { 
  X, ShieldCheck, Lock, Upload, Plus, Trash2, Check, RefreshCw, 
  Eye, Film, ExternalLink, Sparkles, LogOut, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { VideoItem, AdSettings } from '../types';
import { convertGoogleDriveUrl } from '../lib/videoService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  videos: VideoItem[];
  onAddVideo: (video: VideoItem) => Promise<void> | void;
  onDeleteVideo: (id: string) => Promise<void> | void;
  onResetVideos: () => Promise<void> | void;
  adSettings: AdSettings;
  onUpdateAdSettings: (newSettings: AdSettings) => Promise<void> | void;
  onSelectVideoForPreview: (video: VideoItem) => void;
  isSaving?: boolean;
}

export function AdminPanel({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  videos,
  onAddVideo,
  onDeleteVideo,
  onResetVideos,
  adSettings,
  onUpdateAdSettings,
  onSelectVideoForPreview
}: AdminPanelProps) {
  // Tabs: 'videos' (Upload & List), 'ads' (Adsterra & Banners)
  const [activeTab, setActiveTab] = useState<'videos' | 'ads'>('videos');

  // Login PIN
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('10:00');
  const [description, setDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videoFileLoading, setVideoFileLoading] = useState(false);

  // File input refs
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbFileInputRef = useRef<HTMLInputElement | null>(null);

  // Local AdSettings editable copy
  const [localAds, setLocalAds] = useState<AdSettings>(adSettings);
  const [adSavedNotice, setAdSavedNotice] = useState(false);
  const [adminVideoSearch, setAdminVideoSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<VideoItem | null>(null);

  if (!isOpen) return null;

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'mominul') {
      onLogin();
      setPinError(false);
      setPin('');
    } else {
      setPinError(true);
    }
  };

  // Quick preset sample video selector for convenience
  const handleSelectSample = (sample: { title: string; url: string; thumb: string; dur: string }) => {
    setTitle(sample.title);
    setVideoUrl(sample.url);
    setThumbnailUrl(sample.thumb);
    setDuration(sample.dur);
    setDescription('উচ্চমানের সিনেমাটিক ভিডিও যা সরাসরি অনলাইন স্ট্রিম থেকে প্লে হবে।');
  };

  // Local Video File Upload handler (creates local object URL)
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFileLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    setDuration('05:00');
    setVideoFileLoading(false);
  };

  // Local Thumbnail Upload handler
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setThumbnailUrl(objectUrl);
  };

  // Submit new video
  const handleAddNewVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      alert('ভিডিও টাইটেল এবং ভিডিওর লিংক অথবা ফাইল সিলেক্ট করুন।');
      return;
    }

    const cleanUrl = convertGoogleDriveUrl(videoUrl.trim());

    const newVid: VideoItem = {
      id: 'vid-' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'নতুন আপলোড করা ভিডিও।',
      videoUrl: cleanUrl,
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      duration: duration.trim() || '05:00',
      views: 1,
      uploadDate: 'এইমাত্র',
      category: 'নতুন',
      isLocal: cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')
    };

    try {
      await onAddVideo(newVid);
      setUploadSuccess(true);

      // Reset form fields
      setTitle('');
      setVideoUrl('');
      setThumbnailUrl('');
      setDescription('');
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      if (thumbFileInputRef.current) thumbFileInputRef.current.value = '';

      setTimeout(() => {
        setUploadSuccess(false);
      }, 4000);
    } catch {
      alert('ভিডিও আপলোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
    }
  };

  // Confirm and delete video
  const executeDeleteVideo = async (vid: VideoItem) => {
    setDeletingId(vid.id);
    try {
      await onDeleteVideo(vid.id);
      setDeleteConfirmVideo(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('ভিডিও ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setDeletingId(null);
    }
  };

  // Save Ad Settings
  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateAdSettings(localAds);
      setAdSavedNotice(true);
      setTimeout(() => setAdSavedNotice(false), 3500);
    } catch {
      alert('অ্যাড সেটিংস সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="admin-panel-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-zinc-900 border border-zinc-750 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-zinc-800 bg-zinc-950/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                এডমিন কন্ট্রোল প্যানেল
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {isAdmin ? 'লগইন স্ট্যাটাস: সক্রিয়' : 'লকড'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">ভিডিও আপলোড, ডিলিট এবং অ্যাডস্টাররা বিজ্ঞাপন নিয়ন্ত্রণ</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 rounded-xl transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* 1. If NOT logged in -> Show PIN form */}
          {!isAdmin ? (
            <div className="max-w-md mx-auto py-10 sm:py-14 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1">এডমিন পাসওয়ার্ড দিন</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ভিডিও যোগ, ডিলিট এবং অ্যাডস্টাররা সেটিংস পরিবর্তনের জন্য এডমিন পাসওয়ার্ড প্রদান করুন।
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3 pt-2">
                <div>
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড লিখুন (mominul)"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setPinError(false);
                    }}
                    autoFocus
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm tracking-wider"
                  />
                  {pinError && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center justify-center gap-1">
                      ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  লগইন করুন
                </button>
              </form>

              <div className="pt-3 border-t border-zinc-800/80">
                <p className="text-[11px] text-zinc-500">
                  ডিফল্ট পাসওয়ার্ড: <span className="text-amber-400 font-mono">mominul</span>
                </p>
              </div>
            </div>
          ) : (
            /* 2. Logged In View */
            <div className="space-y-6">

              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800 gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === 'videos'
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>ভিডিও আপলোড ও ম্যানেজমেন্ট ({videos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ads')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === 'ads'
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>বিজ্ঞাপন ও মনিটাইজেশন সেটিংস</span>
                </button>
              </div>

              {/* TAB 1: VIDEO UPLOAD & MANAGEMENT */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  
                  {/* Upload Form Box */}
                  <form onSubmit={handleAddNewVideo} className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Plus className="w-4 h-4 text-amber-500" />
                        নতুন ভিডিও আপলোড করুন
                      </h4>
                      <span className="text-[11px] text-zinc-400">
                        সরাসরি ক্লাউড ডাটাবেজে যুক্ত হবে
                      </span>
                    </div>

                    {uploadSuccess && (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                        <Check className="w-4 h-4 text-emerald-400" />
                        ভিডিওটি সফলভাবে পাবলিশ হয়েছে এবং সকল ইউজার দেখতে পাচ্ছেন!
                      </div>
                    )}

                    {/* Quick Preset Buttons for Instant Testing */}
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 space-y-2">
                      <span className="text-[11px] text-zinc-400 block font-medium">
                        ⚡ কুইক স্যাম্পল (১-ক্লিকে ফিল করুন):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectSample({
                            title: 'সমুদ্র ও নীল দিগন্তের মায়াবী তরঙ্গ | Oceans 4K',
                            url: 'https://vjs.zencdn.net/v/oceans.mp4',
                            thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                            dur: '00:46'
                          })}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                        >
                          + সমুদ্রের ঢেউ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectSample({
                            title: 'অ্যাডভেঞ্চার স্নোবোর্ডিং ট্রেলার | Blue Moon',
                            url: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
                            thumb: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=80',
                            dur: '02:12'
                          })}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                        >
                          + স্নোবোর্ডিং অ্যাডভেঞ্চার
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectSample({
                            title: 'প্রকৃতি ও খরগোশের অ্যানিমেশন | Big Buck Bunny',
                            url: 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master/big_buck_bunny.mp4',
                            thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
                            dur: '10:34'
                          })}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                        >
                          + খরগোশের অ্যানিমেশন
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Video Title */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          ভিডিও টাইটেল *
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: সেরা অ্যাকশন সিনেমা ক্লিপ ২০২৬"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Video Source: Online MP4 or Device file */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          ভিডিও সোর্স (অনলাইন MP4 ডিরেক্ট লিংক) *
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: https://vjs.zencdn.net/v/oceans.mp4 অথবা Google Drive লিংক"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500 mb-2 font-mono"
                        />

                        {videoUrl.includes('drive.google.com') && (
                          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              গুগল ড্রাইভ লিংক চিহ্নিত করা হয়েছে! এটি স্বয়ংক্রিয়ভাবে ভিডিও স্ট্রিমিং মোডে প্লে হবে (ড্রাইভের ফাইলটি <strong>'Anyone with the link'</strong> শেয়ার করা নিশ্চিত করুন)।
                            </span>
                          </div>
                        )}
                        
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5 text-xs text-zinc-300">
                          <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                            📌 ইউজারদের ভিডিও দেখাতে করণীয়:
                          </p>
                          <p className="leading-relaxed">
                            আপনি যখন কোনো অনলাইন ভিডিওর <strong>সরাসরি MP4 লিংক</strong> এখানে দিয়ে পাবলিশ করবেন, তখন বিশ্বের যেকোনো ইউজার তার মোবাইল বা কম্পিউটার থেকে সাইটটি ওপেন করলেই সেই ভিডিও দেখতে পারবেন।
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            💡 <strong>সহজ টিপস:</strong> নিজের কোনো ভিডিও দেখাতে চাইলে তা যেকোনো ফ্রি ভিডিও হোস্টিং (যেমন Catbox.moe, Discord, Google Drive/Firebase স্টোরেজ) এ আপলোড করে সেই ডিরেক্ট MP4 লিংকটি এখানে পেস্ট করুন। অথবা দ্রুত টেস্ট করার জন্য ওপরের <strong>"কুইক স্যাম্পল"</strong> বাটনে ক্লিক করে সাথে সাথে নতুন ভিডিও পাবলিশ করে দেখতে পারেন!
                          </p>
                        </div>
                      </div>

                      {/* Video Duration */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          ভিডিও ব্যাপ্তিকাল (Duration)
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: 08:45"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Thumbnail URL / File */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          থাম্বনেইল ইমেজ (URL বা ফাইল)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://example.com/thumb.jpg"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={thumbFileInputRef}
                            onChange={handleThumbnailFileChange}
                            className="hidden"
                            id="admin-thumb-file-picker"
                          />
                          <label
                            htmlFor="admin-thumb-file-picker"
                            className="px-2.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white cursor-pointer transition-colors border border-zinc-700/60 flex items-center justify-center flex-shrink-0"
                            title="থাম্বনেইল ফাইল আপলোড"
                          >
                            <Upload className="w-4 h-4" />
                          </label>
                        </div>
                      </div>

                      {/* Video Description */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          ভিডিও বিবরণ (Description)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        ভিডিও পাবলিশ করুন
                      </button>
                    </div>
                  </form>

                  {/* Existing Videos List */}
                  <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>সাইটে বিদ্যমান ভিডিও তালিকা</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                            {videos.length} টি ভিডিও
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          এখান থেকে যেকোনো ভিডিও এক ক্লিকেই মুছে (Delete) ফেলতে পারবেন
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onResetVideos();
                          }}
                          className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          ডিফল্ট ভিডিও রিস্টোর
                        </button>
                      </div>
                    </div>

                    {/* Search inside admin videos if more than 3 videos */}
                    {videos.length > 3 && (
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="ভিডিও তালিকায় খুঁজুন..."
                          value={adminVideoSearch}
                          onChange={(e) => setAdminVideoSearch(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    {videos.length === 0 ? (
                      <div className="py-8 text-center text-zinc-500 text-xs">
                        কোনো ভিডিও পাওয়া যায়নি। উপরে থেকে নতুন ভিডিও যোগ করুন।
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-850 max-h-[380px] overflow-y-auto pr-1">
                        {videos
                          .filter((v) => !adminVideoSearch || v.title.toLowerCase().includes(adminVideoSearch.toLowerCase()))
                          .map((vid) => (
                            <div key={vid.id} className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-900/30 px-2 rounded-xl transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&auto=format&fit=crop&q=80'}
                                  alt={vid.title}
                                  className="w-16 h-10 object-cover rounded-lg bg-zinc-900 flex-shrink-0 border border-zinc-800"
                                />
                                <div className="min-w-0">
                                  <h5 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                                    {vid.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                                    <span className="text-zinc-500">{vid.duration}</span>
                                    <span>• {vid.views.toLocaleString()} ভিউ</span>
                                    <span className="text-zinc-500">• {vid.uploadDate}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectVideoForPreview(vid);
                                    onClose();
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors border border-zinc-750"
                                  title="প্লে করুন"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">প্রিভিউ</span>
                                </button>

                                {/* Direct Click triggers in-modal confirmation card */}
                                <button
                                  type="button"
                                  disabled={deletingId === vid.id}
                                  onClick={() => setDeleteConfirmVideo(vid)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                  title="ভিডিও ডিলিট করুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">
                                    {deletingId === vid.id ? 'মুছে ফেলা হচ্ছে...' : 'ডিলিট'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: ADSTERRA & AD MONETIZATION SETTINGS */}
              {activeTab === 'ads' && (
                <form onSubmit={handleSaveAds} className="space-y-6">
                  
                  {adSavedNotice && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-400" />
                      অ্যাড সেটিংস সফলভাবে সেভ হয়েছে!
                    </div>
                  )}

                  {/* Adsterra Direct Link */}
                  <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-amber-500" />
                        অ্যাডস্টাররা ডিরেক্ট লিংক (Adsterra Direct Link)
                      </h4>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                        High CPM Link
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      ভিডিওর ৭ম সেকেন্ডে স্বয়ংক্রিয়ভাবে ভিডিও পজ হয়ে যে <strong>"এড দেখুন"</strong> বাটন আসবে, ইউজার ক্লিক করলে আপনার দেওয়া এই লিংকে রিডাইরেক্ট হবে।
                    </p>
                    <input
                      type="url"
                      placeholder="https://www.highcpmgate.com/..."
                      value={localAds.adsterraDirectLink}
                      onChange={(e) => setLocalAds({ ...localAds, adsterraDirectLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[11px] text-amber-300/90 leading-relaxed">
                      💡 <strong>৭ সেকেন্ড এড লক ও ৩০ সেকেন্ড কাউন্টডাউন নিয়ম:</strong> ইউজার ভিডিও প্লে করলে ঠিক ৭ সেকেন্ড চলার পর ভিডিও থেমে লক হয়ে যাবে। এরপর <strong>"এড দেখুন"</strong> বাটনে ক্লিক করলে নতুন ট্যাবে আপনার এই লিংক খুলবে এবং ৩০ সেকেন্ড কাউন্টডাউন শুরু হবে। ৩০ সেকেন্ড শেষ হলে <strong>"এখন ভিডিও দেখুন"</strong> বাটন দিয়ে সম্পূর্ণ ভিডিও আনলক হয়ে প্লে হবে।
                    </div>
                  </div>

                  {/* Adsterra Social Bar & Popunder */}
                  <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      অ্যাডস্টাররা সোশ্যাল বার (Social Bar / In-Page Push)
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="check-social-bar"
                        checked={localAds.socialBarEnabled}
                        onChange={(e) => setLocalAds({ ...localAds, socialBarEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 accent-amber-500"
                      />
                      <label htmlFor="check-social-bar" className="text-xs font-medium text-zinc-200">
                        স্ক্রিনের নিচের ডান কোণায় সোশ্যাল বার নোটিফিকেশন চালু রাখুন
                      </label>
                    </div>

                    {localAds.socialBarEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">সোশ্যাল বার টাইটেল</label>
                          <input
                            type="text"
                            value={localAds.socialBarTitle}
                            onChange={(e) => setLocalAds({ ...localAds, socialBarTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">মেসেজ টেক্সট</label>
                          <input
                            type="text"
                            value={localAds.socialBarMessage}
                            onChange={(e) => setLocalAds({ ...localAds, socialBarMessage: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-zinc-400 mb-1">সোশ্যাল বার ক্লিক লিংক</label>
                          <input
                            type="url"
                            value={localAds.socialBarLink}
                            onChange={(e) => setLocalAds({ ...localAds, socialBarLink: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Banners & Raw Code Snippets */}
                  <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-sm font-bold text-white">
                      ব্যানার বিজ্ঞাপন ও অফিসিয়াল অ্যাডস্টাররা কোড (Banners & Scripts)
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="check-top-banner"
                          checked={localAds.bannerTopEnabled}
                          onChange={(e) => setLocalAds({ ...localAds, bannerTopEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 accent-amber-500"
                        />
                        <label htmlFor="check-top-banner" className="text-xs font-medium text-zinc-200">
                          টপ ব্যানার বিজ্ঞাপন চালু রাখুন (728x90 Top Leaderboard)
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="check-bottom-banner"
                          checked={localAds.bannerBottomEnabled}
                          onChange={(e) => setLocalAds({ ...localAds, bannerBottomEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 accent-amber-500"
                        />
                        <label htmlFor="check-bottom-banner" className="text-xs font-medium text-zinc-200">
                          প্লেয়ারের নিচে ব্যানার বিজ্ঞাপন চালু রাখুন (Bottom Banner)
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="check-native-banner"
                          checked={localAds.nativeBannerEnabled}
                          onChange={(e) => setLocalAds({ ...localAds, nativeBannerEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 accent-amber-500"
                        />
                        <label htmlFor="check-native-banner" className="text-xs font-medium text-zinc-200">
                          নেটিভ অ্যাড গ্রিড (Native Ads) চালু রাখুন
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        কাস্টম Adsterra স্ক্রিপ্ট কোড (ঐচ্ছিক - HTML / Script Code):
                      </label>
                      <textarea
                        rows={3}
                        placeholder="<!-- Adsterra script tags... -->"
                        value={localAds.customScriptCode}
                        onChange={(e) => setLocalAds({ ...localAds, customScriptCode: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 text-xs font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      অ্যাড সেটিংস সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

        {/* ------------------------------------------------------------- */}
        {/* IN-MODAL DELETE CONFIRMATION POPUP (Bypasses iframe blocking)  */}
        {/* ------------------------------------------------------------- */}
        {deleteConfirmVideo && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-red-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-1">ভিডিওটি ডিলিট করতে চান?</h4>
                <p className="text-xs text-zinc-300 line-clamp-2 px-2">
                  "{deleteConfirmVideo.title}"
                </p>
                <p className="text-[11px] text-red-400/90 mt-1">
                  এটি ডাটাবেজ এবং ওয়েবসাইট থেকে স্থায়ীভাবে মুছে যাবে।
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={deletingId === deleteConfirmVideo.id}
                  onClick={() => setDeleteConfirmVideo(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={deletingId === deleteConfirmVideo.id}
                  onClick={() => executeDeleteVideo(deleteConfirmVideo)}
                  className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deletingId === deleteConfirmVideo.id ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, ডিলিট করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
