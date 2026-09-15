import { useState } from 'react';
import { Search, ShieldAlert, Film, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
  onHomeClick: () => void;
}

export function Navbar({
  searchTerm,
  setSearchTerm,
  isAdmin,
  onOpenAdmin,
  onLogoutAdmin,
  onHomeClick
}: NavbarProps) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={onHomeClick}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-950/40 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  ভিডিও<span className="text-amber-500">হাব</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  HD
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 -mt-0.5 hidden sm:block">
                প্রিমিয়াম ভিডিও ও বিনোদন
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-desktop"
                type="text"
                placeholder="ভিডিও খুঁজুন (নাম বা বিষয়)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Cloud Sync Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>লাইভ ক্লাউড সিঙ্ক</span>
            </div>

            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="p-2 text-zinc-400 hover:text-zinc-200 md:hidden rounded-lg hover:bg-zinc-900"
              title="সার্চ করুন"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Badge / Login button */}
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <button
                  id="btn-admin-dashboard"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>এডমিন প্যানেল</span>
                </button>
                <div className="w-px h-3.5 bg-emerald-500/30" />
                <button
                  id="btn-admin-logout"
                  onClick={onLogoutAdmin}
                  title="লগআউট করুন"
                  className="text-zinc-400 hover:text-red-400 p-0.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-admin-login-discrete"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border border-zinc-800/80 transition-all"
                title="এডমিন প্যানেল লগইন (পাসওয়ার্ড: mominul)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400" />
                <span className="hidden sm:inline">এডমিন প্রবেশ</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input dropdown */}
        {showSearchMobile && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-mobile"
                type="text"
                placeholder="ভিডিও খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
