import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, X, Megaphone, CheckCircle2 } from 'lucide-react';
import { AdSettings } from '../types';

interface AdBannersProps {
  settings: AdSettings;
  onAdClick?: () => void;
}

export function TopBannerAd({ settings, onAdClick }: AdBannersProps) {
  if (!settings.bannerTopEnabled) return null;

  const handleClick = () => {
    if (onAdClick) onAdClick();
    if (settings.bannerTopLink) {
      window.open(settings.bannerTopLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-3 px-4">
      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 px-1">
        <span className="flex items-center gap-1 uppercase tracking-wider font-semibold">
          <Megaphone className="w-3 h-3 text-amber-500" />
          স্পন্সরড ব্যানার অ্যাড (Sponsored)
        </span>
        <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50">
          AD 728x90
        </span>
      </div>

      {settings.bannerTopHtml ? (
        <div 
          className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 p-2 min-h-[90px] flex items-center justify-center text-center"
          dangerouslySetInnerHTML={{ __html: settings.bannerTopHtml }}
        />
      ) : (
        <div 
          id="banner-top-ad"
          onClick={handleClick}
          className="relative group cursor-pointer overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-900 p-3 sm:p-4 shadow-lg hover:border-amber-500/60 transition-all"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-amber-500/20 border border-amber-500/30">
                <img 
                  src={settings.bannerTopImage || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80'} 
                  alt="Ad Banner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  🔥 মেগা অফার ও স্পেশাল বোনাস জিতুন!
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                    HOT
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  এখনই সাইটে সাইন-আপ করুন এবং আকর্ষণীয় ক্যাশব্যাক ও রিওয়ার্ড বুঝে নিন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex-shrink-0">
                অফার দেখুন <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BottomBannerAd({ settings, onAdClick }: AdBannersProps) {
  if (!settings.bannerBottomEnabled) return null;

  const handleClick = () => {
    if (onAdClick) onAdClick();
    if (settings.bannerBottomLink) {
      window.open(settings.bannerBottomLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 px-1">
        <span className="flex items-center gap-1 uppercase tracking-wider font-semibold">
          <Sparkles className="w-3 h-3 text-amber-500" />
          বিজ্ঞাপন (Adsterra Network)
        </span>
        <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50">
          বিজ্ঞাপন
        </span>
      </div>

      {settings.bannerBottomHtml ? (
        <div 
          className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 p-2 min-h-[90px] flex items-center justify-center text-center"
          dangerouslySetInnerHTML={{ __html: settings.bannerBottomHtml }}
        />
      ) : (
        <div
          id="banner-bottom-ad"
          onClick={handleClick}
          className="group cursor-pointer rounded-xl border border-zinc-800 hover:border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 p-4 transition-all"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-amber-400 text-sm font-bold">★ অ্যাডস্টাররা এক্সক্লুসিভ স্পন্সর</span>
                <span className="text-[10px] text-zinc-400 border border-zinc-700 px-1.5 py-0.5 rounded">
                  Sponsored Ad
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                ঘরে বসে সেরা অনলাইন সার্ভিস এবং আকর্ষণীয় অফারসমূহ এখনই এক্সপ্লোর করুন।
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-lg bg-zinc-800 group-hover:bg-amber-500 group-hover:text-zinc-950 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors flex-shrink-0">
              ভিজিট করুন <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function NativeAdsGrid({ settings }: { settings: AdSettings }) {
  if (!settings.nativeBannerEnabled) return null;

  const sponsoredItems = [
    {
      title: 'নতুন অনলাইন কাজের সুযোগ ও ডেইলি পেমেন্ট',
      desc: 'কোন অভিজ্ঞতা ছাড়াই শুরু করুন এবং বাড়তি আয় করুন।',
      image: 'https://images.unsplash.com/photo-1579226905180-636b76d96082?w=500&auto=format&fit=crop&q=80',
      sponsor: 'Earning Network'
    },
    {
      title: 'হাই স্পিড ইন্টারনেট রাউটার ৫০% ছাড়ে',
      desc: 'সীমিত সময়ের অফার, ফ্রি হোম ডেলিভারি পেতে ক্লিক করুন।',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
      sponsor: 'Tech Gadgets'
    },
    {
      title: 'সেরা মোবাইল গেম টুর্নামেন্ট ও প্রাইজ পুল',
      desc: 'বিনামূল্যে রেজিস্টার করে জিতে নিন আকর্ষণীয় পুরস্কার।',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      sponsor: 'Gaming Pro'
    }
  ];

  return (
    <div className="my-8 pt-4 border-t border-zinc-900">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          আপনার জন্য সুপারিশকৃত বিজ্ঞাপন (Native Ads)
        </h3>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">স্পন্সরড</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sponsoredItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (settings.adsterraDirectLink) {
                window.open(settings.adsterraDirectLink, '_blank', 'noopener,noreferrer');
              }
            }}
            className="group cursor-pointer rounded-xl border border-zinc-800/80 hover:border-amber-500/40 bg-zinc-900/50 p-2.5 transition-all flex flex-col justify-between"
          >
            <div className="w-full h-28 rounded-lg overflow-hidden bg-zinc-800 mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-amber-500/90">{item.sponsor}</span>
              <h4 className="text-xs font-medium text-zinc-200 group-hover:text-amber-400 line-clamp-2 mt-0.5 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">{item.desc}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 group-hover:text-zinc-300">
              <span>বিজ্ঞাপন দেখুন</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Adsterra Social Bar (In-Page Push notification popup on bottom right)
export function AdsterraSocialBar({ settings }: { settings: AdSettings }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!settings.socialBarEnabled || dismissed) return;

    // Show social bar after 4 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [settings.socialBarEnabled, dismissed]);

  if (!visible || dismissed || !settings.socialBarEnabled) return null;

  const handleClick = () => {
    const targetUrl = settings.socialBarLink || settings.adsterraDirectLink || 'https://www.google.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setVisible(false);
  };

  return (
    <div 
      id="adsterra-social-bar"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] bg-zinc-900/95 border border-amber-500/40 rounded-2xl shadow-2xl p-3.5 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
          setVisible(false);
        }}
        className="absolute top-2.5 right-2.5 p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
        title="বন্ধ করুন"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div 
        onClick={handleClick}
        className="flex items-center gap-3 cursor-pointer group pr-4"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xl flex-shrink-0 shadow-md">
          {settings.socialBarIcon || '🎁'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-1 rounded border border-amber-500/20">
              বিজ্ঞাপন (Social Bar)
            </span>
          </div>
          <h5 className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors truncate mt-0.5">
            {settings.socialBarTitle}
          </h5>
          <p className="text-[11px] text-zinc-300 line-clamp-1">
            {settings.socialBarMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
