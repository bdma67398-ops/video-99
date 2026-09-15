import React from 'react';
import { Play, Eye, Clock } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoCardProps {
  key?: React.Key;
  video: VideoItem;
  isActive?: boolean;
  onSelect: (video: VideoItem) => void;
}

export function VideoCard({ video, isActive, onSelect }: VideoCardProps) {
  return (
    <div
      id={`video-card-${video.id}`}
      onClick={() => onSelect(video)}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col bg-zinc-900/40 hover:bg-zinc-900 ${
        isActive 
          ? 'border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500' 
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono font-medium text-white flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {video.duration}
        </div>

        {/* Hover play icon overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center pl-0.5 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 line-clamp-2 leading-snug transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-zinc-500" />
            {video.views.toLocaleString()} ভিউ
          </span>
          <span>{video.uploadDate}</span>
        </div>
      </div>
    </div>
  );
}
