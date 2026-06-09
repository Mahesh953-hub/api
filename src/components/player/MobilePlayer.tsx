import React from 'react';
import { 
  ChevronDown, 
  MoreVertical, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Heart, 
  Share2,
  ListMusic
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { cn } from '../../utils/cn';

const MobilePlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.15)_0%,_transparent_50%)] animate-pulse" />
        <img 
          src={currentTrack.thumbnail} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[100px] scale-150"
          alt="Ambient Background"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8 flex items-center justify-between">
        <button className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:scale-90 transition-transform">
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Playing From</p>
          <h3 className="text-sm font-bold truncate max-w-[200px]">Cyberwave Essentials</h3>
        </div>
        <button className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:scale-90 transition-transform">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Album Art Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative w-full aspect-square max-w-[340px] group">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
          <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-700">
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="w-full mt-12 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h1 className="text-3xl font-black tracking-tight mb-1 truncate">
              {currentTrack.title}
            </h1>
            <p className="text-lg text-primary font-medium flex items-center gap-2">
              {currentTrack.artist}
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-on-surface-variant text-sm font-normal">Original Mix</span>
            </p>
          </div>
          <button className="p-3 text-on-surface-variant hover:text-primary active:scale-125 transition-all">
            <Heart size={28} />
          </button>
        </div>
      </main>

      {/* Controls & Progress */}
      <footer className="relative z-10 p-8 pt-0 space-y-10">
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-primary shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-on-surface-variant tracking-wider">
            <span>1:24</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Main Transport */}
        <div className="flex items-center justify-between">
          <button className="text-on-surface-variant active:text-primary transition-colors">
            <Shuffle size={24} />
          </button>
          
          <div className="flex items-center gap-8">
            <button className="text-on-surface active:scale-90 transition-transform">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="h-20 w-20 rounded-full bg-white text-surface flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-on-surface active:scale-90 transition-transform">
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>

          <button className="text-on-surface-variant active:text-primary transition-colors">
            <Repeat size={24} />
          </button>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-white/5">
           <button className="flex items-center gap-3 text-[11px] font-bold text-on-surface-variant bg-white/5 px-4 py-2 rounded-xl border border-white/10">
             <ListMusic size={16} /> Studio Pro 1
           </button>
           <div className="flex items-center gap-6 text-on-surface-variant">
             <Share2 size={20} />
             <ListMusic size={20} />
           </div>
        </div>
      </footer>
    </div>
  );
};

export default MobilePlayer;
