import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search as SearchIcon, 
  History, 
  TrendingUp, 
  Mic, 
  X,
  Play,
  MoreVertical,
  Plus
} from 'lucide-react';
import { apiService } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { Track, Source } from '../types';
import { cn } from '../utils/cn';

const SOURCES: { id: Source; label: string; color: string }[] = [
  { id: 'spotify', label: 'Spotify', color: 'bg-[#1DB954]' },
  { id: 'youtube', label: 'YouTube', color: 'bg-[#FF0000]' },
  { id: 'soundcloud', label: 'SoundCloud', color: 'bg-[#FF5500]' },
  { id: 'local', label: 'Local', color: 'bg-[#A855F7]' },
];

const CATEGORIES = ['All Sources', 'Songs', 'Albums', 'Playlists', 'Artists'];

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { setTrack, currentTrack, isPlaying } = usePlayerStore();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // If 'all' is selected, we'd ideally fetch from multiple or have a combined endpoint
      // For this implementation, we'll fetch from the selected source or default to youtube for 'all'
      const activeSource = selectedSource === 'all' ? 'youtube' : selectedSource;
      const data = await apiService.search(searchQuery, activeSource as Source);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSource]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const recentSearches = [
    "Cyberpunk Synthwave Mix 2024",
    "Daft Punk Discovery Full Album",
    "Lo-fi beats for coding"
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Search Bar & Voice Control --- */}
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
          <SearchIcon size={22} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-surface-container-high/40 border border-white/5 rounded-full py-4 pl-14 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-high/60 backdrop-blur-xl transition-all shadow-2xl"
        />
        <div className="absolute inset-y-0 right-5 flex items-center gap-3">
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} className="text-on-surface-variant" />
            </button>
          )}
          <div className="w-[1px] h-6 bg-white/10" />
          <button className="p-2 hover:text-primary transition-colors">
            <Mic size={22} className="text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* --- Source & Type Filters --- */}
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <button
          onClick={() => setSelectedSource('all')}
          className={cn(
            "px-6 py-2 rounded-full border text-sm font-medium transition-all",
            selectedSource === 'all' 
              ? "bg-on-surface text-surface border-transparent" 
              : "border-white/10 text-on-surface-variant hover:border-white/30 hover:bg-white/5"
          )}
        >
          All Sources
        </button>
        {SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => setSelectedSource(source.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-all",
              selectedSource === source.id 
                ? "bg-surface-bright border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                : "border-white/10 text-on-surface-variant hover:border-white/30 hover:bg-white/5"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", source.color)} />
            {source.label}
          </button>
        ))}
      </div>

      {/* --- Dynamic Content Area --- */}
      {!query ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          {/* Recent Searches */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <History size={20} className="text-primary" />
              <h2 className="text-xl font-bold">Recent Searches</h2>
            </div>
            <div className="space-y-2">
              {recentSearches.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                >
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{item}</span>
                  <History size={16} className="text-on-surface-variant/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </section>

          {/* Trending Now */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="text-xl font-bold">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="group relative flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low/50 border border-white/5 hover:bg-surface-container-high/80 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-xl bg-surface-bright overflow-hidden">
                       <div className="w-full h-full bg-gradient-to-br from-primary/20 to-surface-bright" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold">Trending Track {i}</h4>
                       <p className="text-sm text-on-surface-variant">Artist Name</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 bg-primary text-surface rounded-full shadow-lg transition-all scale-90 group-hover:scale-100">
                      <Play size={18} fill="currentColor" />
                    </button>
                 </div>
               ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <span className="text-sm text-on-surface-variant">{results.length} results found</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-white/5 animate-pulse" />
              ))
            ) : (
              results.map((track) => (
                <div 
                  key={track.id}
                  className="group relative flex flex-col p-4 rounded-3xl bg-surface-container-low/40 border border-white/5 hover:bg-surface-container-high/60 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-primary/10">
                    <img 
                      src={track.thumbnail} 
                      alt={track.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => setTrack(track)}
                        className="w-14 h-14 rounded-full bg-primary text-surface flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300"
                      >
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </button>
                    </div>
                    <div className={cn(
                      "absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-white/10",
                      track.source === 'spotify' ? "bg-[#1DB954]/80" : 
                      track.source === 'youtube' ? "bg-red-600/80" : 
                      track.source === 'soundcloud' ? "bg-orange-500/80" : "bg-purple-600/80"
                    )}>
                      {track.source}
                    </div>
                  </div>
                  
                  <div className="space-y-1 pr-8">
                    <h3 className="font-bold text-sm truncate leading-tight">{track.title}</h3>
                    <p className="text-xs text-on-surface-variant truncate">{track.artist}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                     <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                        <Plus size={18} />
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchView;
