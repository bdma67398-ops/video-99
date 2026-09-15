import { VideoItem, AdSettings } from '../types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'সমুদ্র ও নীল দিগন্তের মায়াবী তরঙ্গ | Oceans 4K Cinematic',
    description: 'শান্ত ও মনোরম সমুদ্রের গভীর নীল ঢেউ ও উপকূলীয় সৌন্দর্য। সম্পূর্ণ হাই কোয়ালিটি 4K ফুটেজ। ৭ সেকেন্ড পর বিশেষ প্রমোশন চালু হবে।',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    duration: '0:46',
    views: 45200,
    uploadDate: '২ দিন আগে',
  },
  {
    id: 'vid-2',
    title: 'অ্যাডভেঞ্চার ও রোমাঞ্চকর স্নোবোর্ডিং ট্রেলার | Blue Moon Trailer',
    description: 'পর্বতের চূড়া থেকে শ্বাসরুদ্ধকর স্নোবোর্ডিং ও অসাধারণ ল্যান্ডস্কেপ ফুটেজ। মনোরম সিনেমাটিক ট্রেলার।',
    videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=80',
    duration: '2:12',
    views: 128900,
    uploadDate: '৫ দিন আগে',
  },
  {
    id: 'vid-3',
    title: 'প্রকৃতির অপরূপ সৌন্দর্য ও খরগোশের রোমাঞ্চ | Big Buck Bunny',
    description: 'আন্তর্জাতিকভাবে স্বীকৃত জনপ্রিয় অ্যানিমেশন ক্লিপ। বনের সবুজ পরিবেশ এবং আনন্দঘন রোমাঞ্চ।',
    videoUrl: 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master/big_buck_bunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    duration: '10:34',
    views: 89400,
    uploadDate: '১ সপ্তাহ আগে',
  },
  {
    id: 'vid-4',
    title: 'রোমাঞ্চকর সাই-ফাই এনিমেশন | Sintel Open Movie Trailer',
    description: 'ড্রাগন এবং এক দুঃসাহসী যোদ্ধার কল্পকাহিনী নিয়ে বিশ্ববিখ্যাত ওপেন সোর্স সিনেমা ট্রেলার।',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    duration: '0:52',
    views: 31200,
    uploadDate: '২ সপ্তাহ আগে',
  },
  {
    id: 'vid-5',
    title: 'সঙ্গীত ও ডিজিটাল মেলোডি ভিজ্যুয়াল | Echoes Sound Track',
    description: 'ডিজিটাল সাউন্ডস্কেপ ও দারুণ ব্যাকগ্রাউন্ড মিউজিক ট্র্যাক। সম্পূর্ণ অডিও-ভিজ্যুয়াল অভিজ্ঞতা।',
    videoUrl: 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master/echo-hereweare.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    duration: '0:45',
    views: 64100,
    uploadDate: '৩ সপ্তাহ আগে',
  }
];

export const INITIAL_AD_SETTINGS: AdSettings = {
  // Direct link for Adsterra (Default destination when user clicks "অ্যাড দেখুন")
  adsterraDirectLink: 'https://www.google.com', // user can replace with their Adsterra direct link
  triggerSeconds: 7,       // 7 seconds into video playback
  requiredAdSeconds: 30,   // 30 seconds ad watch requirement
  
  pauseAdTitle: '🔥 বিশেষ আকর্ষণীয় অফার ও স্পন্সর বিজ্ঞাপন',
  pauseAdDescription: 'সম্পূর্ণ ভিডিওটি আনলক করতে স্পনসর সাইটে ৩০ সেকেন্ড সময় দিন। এরপর সাথে সাথে ভিডিও চালু হবে!',
  pauseAdBannerImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
  pauseAdBannerLink: 'https://www.google.com',

  socialBarEnabled: true,
  socialBarTitle: '🔔 নতুন স্পেশাল অফার!',
  socialBarMessage: 'ক্লিক করে দেখে নিন আজকের সেরা ডিল ও বোনাস।',
  socialBarLink: 'https://www.google.com',
  socialBarIcon: '🎁',

  popunderEnabled: true,
  popunderUrl: 'https://www.google.com',

  bannerTopEnabled: true,
  bannerTopHtml: '',
  bannerTopImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
  bannerTopLink: 'https://www.google.com',

  bannerBottomEnabled: true,
  bannerBottomHtml: '',
  bannerBottomImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
  bannerBottomLink: 'https://www.google.com',

  nativeBannerEnabled: true,
  nativeBannerHtml: '',

  customScriptCode: '<!-- Adsterra script codes can be pasted here in the Admin Panel -->'
};
