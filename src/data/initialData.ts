import { VideoItem, AdSettings } from '../types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'সেরা বাংলা অ্যাকশন মুভি ট্রেলার | Action Thriller Trailer',
    description: 'সম্পূর্ণ অ্যাকশন ও সাসপেন্সে ভরপুর জমকালো নতুন ভিডিও। পুরো মুভি দেখার আগে ট্রেলারটি উপভোগ করুন। ৭ সেকেন্ড পর বিশেষ প্রমোশন চালু হবে।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    duration: '0:15',
    views: 45200,
    uploadDate: '২ দিন আগে',
  },
  {
    id: 'vid-2',
    title: 'প্রকৃতির অপরূপ সৌন্দর্য এবং বন্যপ্রাণীর জীবন | Nature & Wildlife 4K',
    description: 'শান্ত এবং মনোরম পাহাড়ি দৃশ্য ও বনের রহস্যময় জীবন। হাই কোয়ালিটি 4K কোয়ালিটিতে তৈরি এক্সক্লুসিভ ফুটেজ।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    duration: '9:56',
    views: 128900,
    uploadDate: '৫ দিন আগে',
  },
  {
    id: 'vid-3',
    title: 'রোমাঞ্চকর সাই-ফাই শর্ট ফিল্ম | Tears of Steel Sci-Fi Clip',
    description: 'ভবিষ্যতের প্রযুক্তি এবং রোবটের লড়াই নিয়ে শ্বাসরুদ্ধকর এক বিজ্ঞান কল্পকাহিনী ভিত্তিক শর্ট ফিল্ম।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    duration: '12:14',
    views: 89400,
    uploadDate: '১ সপ্তাহ আগে',
  },
  {
    id: 'vid-4',
    title: 'পাহাড় ও ঝর্ণার রোমাঞ্চকর ক্যাম্পিং অভিযান | Mountain Escape',
    description: 'অ্যাডভেঞ্চার প্রেমীদের জন্য স্পেশাল ভিডিও। রোমাঞ্চকর পাহাড়ি ট্রেইল এবং ক্যাম্পফায়ারের গল্প।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    duration: '0:15',
    views: 31200,
    uploadDate: '২ সপ্তাহ আগে',
  },
  {
    id: 'vid-5',
    title: 'স্বপ্ন ও কল্পনার অদ্ভুত অ্যানিমেশন গল্প | Elephants Dream Clip',
    description: 'একটি পরাবাস্তব ডিজিটাল মহাবিশ্বে দুই বন্ধুর পথচলা ও রোমাঞ্চ। অসাধারণ ভিজ্যুয়াল আর্ট।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    duration: '10:53',
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
