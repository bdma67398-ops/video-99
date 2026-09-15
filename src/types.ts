export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  uploadDate: string;
  category?: string;
  isLocal?: boolean;
}

export interface AdSettings {
  adsterraDirectLink: string;
  triggerSeconds?: number;
  requiredAdSeconds?: number;
  
  // Pause Ad screen settings
  pauseAdTitle: string;
  pauseAdDescription: string;
  pauseAdBannerImg: string;
  pauseAdBannerLink: string;

  // Social Bar (Adsterra style)
  socialBarEnabled: boolean;
  socialBarTitle: string;
  socialBarMessage: string;
  socialBarLink: string;
  socialBarIcon: string;

  // Popunder
  popunderEnabled: boolean;
  popunderUrl: string;

  // Banners
  bannerTopEnabled: boolean;
  bannerTopHtml: string;
  bannerTopLink: string;
  bannerTopImage: string;

  bannerBottomEnabled: boolean;
  bannerBottomHtml: string;
  bannerBottomLink: string;
  bannerBottomImage: string;

  nativeBannerEnabled: boolean;
  nativeBannerHtml: string;

  // Custom Raw Script (Adsterra JS tags)
  customScriptCode: string;
}
