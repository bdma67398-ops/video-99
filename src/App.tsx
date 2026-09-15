import { useState, useEffect } from 'react';
import { Film, Sparkles, ShieldCheck, Flame, Play, Info, CloudCheck, Radio } from 'lucide-react';
import { VideoItem, AdSettings } from './types';
import { INITIAL_VIDEOS, INITIAL_AD_SETTINGS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoCard } from './components/VideoCard';
import { TopBannerAd, BottomBannerAd, NativeAdsGrid, AdsterraSocialBar } from './components/AdBanners';
import { AdminPanel } from './components/AdminPanel';
import { 
  subscribeToVideos, 
  subscribeToAdSettings, 
  addVideoToFirestore, 
  deleteVideoFromFirestore, 
  saveAdSettingsToFirestore 
} from './lib/videoService';

export default function App() {
  // Live synced videos from Firestore
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('portal_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Live synced ad settings from Firestore
  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    try {
      const saved = localStorage.getItem('portal_ad_settings');
      return saved ? JSON.parse(saved) : INITIAL_AD_SETTINGS;
    } catch {
      return INITIAL_AD_SETTINGS;
    }
  });

  // Active playing video (default to first)
  const [activeVideo, setActiveVideo] = useState<VideoItem>(() => videos[0] || INITIAL_VIDEOS[0]);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // ----------------------------------------------------
  // REAL-TIME FIRESTORE SYNCHRONIZATION
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Subscribe to live videos collection
    const unsubVideos = subscribeToVideos((updatedVideos) => {
      if (updatedVideos) {
        setVideos(updatedVideos);
        setIsLiveConnected(true);

        // Keep active video in sync
        if (updatedVideos.length > 0) {
          setActiveVideo((curr) => {
            const match = updatedVideos.find((v) => v.id === curr.id);
            return match || updatedVideos[0];
          });
        }

        try {
          localStorage.setItem('portal_videos', JSON.stringify(updatedVideos));
        } catch {}
      }
    });

    // 2. Subscribe to live ad settings
    const unsubSettings = subscribeToAdSettings((updatedSettings) => {
      if (updatedSettings) {
        setAdSettings(updatedSettings);
        try {
          localStorage.setItem('portal_ad_settings', JSON.stringify(updatedSettings));
        } catch {}
      }
    });

    return () => {
      unsubVideos();
      unsubSettings();
    };
  }, []);

  // Handle Admin Login
  const handleAdminLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('admin_authenticated', 'true');
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_authenticated');
    setAdminModalOpen(false);
  };

  // Add new video to Cloud Firestore (Broadcasts immediately to all users)
  const handleAddVideo = async (newVideo: VideoItem) => {
    // Optimistic UI update
    setVideos((prev) => [newVideo, ...prev.filter((v) => v.id !== newVideo.id)]);
    setActiveVideo(newVideo);

    // Save to Firestore
    try {
      await addVideoToFirestore(newVideo);
    } catch (err) {
      console.error('Error saving video to Firestore:', err);
    }
  };

  // Delete video from Cloud Firestore
  const handleDeleteVideo = async (id: string) => {
    setVideos((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (activeVideo.id === id && remaining.length > 0) {
        setActiveVideo(remaining[0]);
      }
      return remaining;
    });

    try {
      await deleteVideoFromFirestore(id);
    } catch (err) {
      console.error('Error deleting video from Firestore:', err);
    }
  };

  // Reset to default sample videos in Firestore
  const handleResetVideos = async () => {
    for (const vid of INITIAL_VIDEOS) {
      await addVideoToFirestore(vid);
    }
    setActiveVideo(INITIAL_VIDEOS[0]);
  };

  // Update Ad Settings in Firestore
  const handleUpdateAdSettings = async (newSettings: AdSettings) => {
    setAdSettings(newSettings);
    try {
      await saveAdSettingsToFirestore(newSettings);
    } catch (err) {
      console.error('Error updating ad settings in Firestore:', err);
    }
  };

  // Filtered videos based on search
  const filteredVideos = videos.filter((v) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.title.toLowerCase().includes(term) ||
      v.description.toLowerCase().includes(term)
    );
  });

  // Recommended list (excluding active video)
  const recommendedVideos = videos.filter((v) => v.id !== activeVideo.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAdmin={isAdmin}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
        onHomeClick={() => {
          setSearchTerm('');
        }}
      />

      {/* Top Banner Ad (Adsterra Leaderboard) */}
      <TopBannerAd settings={adSettings} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Cinema Viewing Mode */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Video & Ad Player Column (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Video Player with 7s pause & 30s ad verification */}
            <VideoPlayer
              key={activeVideo.id}
              video={activeVideo}
              adSettings={adSettings}
              isAdmin={isAdmin}
              onAdTriggered={() => {
                // Optional popunder execution if enabled in adSettings
                if (adSettings.popunderEnabled && adSettings.popunderUrl) {
                  // user trigger
                }
              }}
            />

            {/* Bottom Banner Ad under the player */}
            <BottomBannerAd settings={adSettings} />

            {/* Native Ads Grid (Adsterra style recommended widgets) */}
            <NativeAdsGrid settings={adSettings} />

          </div>

          {/* Sidebar / Recommended Playlist Column (1 Col on lg) */}
          <div className="space-y-5">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                পরবর্তী ভিডিও সমূহ (Up Next)
              </h2>
              <span className="text-xs text-zinc-400">
                {recommendedVideos.length} টি ভিডিও
              </span>
            </div>

            {/* Sidebar Recommended List */}
            <div className="space-y-3">
              {recommendedVideos.slice(0, 8).map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideo(vid);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex gap-3 p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-amber-500/30 cursor-pointer transition-all"
                >
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[10px] font-mono text-white">
                      {vid.duration}
                    </span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 text-amber-400 fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-400 line-clamp-2 leading-snug transition-colors">
                      {vid.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1">
                      <span>{vid.duration}</span>
                      <span>•</span>
                      <span>{vid.views.toLocaleString()} ভিউ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Promotion Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Info className="w-4 h-4" />
                <span>এইচডি স্ট্রিমিং ও মনিটাইজেশন</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                উচ্চমানের বাফারলেস ভিডিও স্ট্রিমিং। অ্যাডস্টাররা ব্যানার ও সোশ্যাল বার বিজ্ঞাপনের মাধ্যমে সাইট মনিটাইজেশন সক্রিয় রয়েছে।
              </p>
            </div>

          </div>

        </div>

        {/* Explore All Videos Grid */}
        <section className="mt-12 pt-8 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-500" />
                এক্সপ্লোর করুন ও সব ভিডিও ({filteredVideos.length})
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                ক্লিক করে যেকোনো ভিডিও উপভোগ করুন
              </p>
            </div>

            {searchTerm && (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                সার্চ রেজাল্ট: "{searchTerm}"
              </span>
            )}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <Film className="w-12 h-12 mx-auto mb-2 text-zinc-700" />
              <p className="text-sm">কোনো ভিডিও পাওয়া যায়নি। অন্য কিছু দিয়ে সার্চ করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredVideos.map((vid) => (
                <VideoCard
                  key={vid.id}
                  video={vid}
                  isActive={activeVideo.id === vid.id}
                  onSelect={(v) => {
                    setActiveVideo(v);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Adsterra Social Bar simulation (sliding in bottom right) */}
      <AdsterraSocialBar settings={adSettings} />

      {/* Admin Panel Modal (Protected with password: mominul) */}
      <AdminPanel
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        videos={videos}
        onAddVideo={handleAddVideo}
        onDeleteVideo={handleDeleteVideo}
        onResetVideos={handleResetVideos}
        adSettings={adSettings}
        onUpdateAdSettings={handleUpdateAdSettings}
        onSelectVideoForPreview={(v) => {
          setActiveVideo(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-bold text-white">ভিডিও<span className="text-amber-500">হাব</span></span>
            <span>• অ্যাডস্টাররা ভিডিও মনিটাইজেশন পোর্টাল</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdminModalOpen(true)}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন লগইন (mominul)'}</span>
            </button>
            <span>•</span>
            <span>অ্যাডস্টাররা মনিটাইজেশন পোর্টাল</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
