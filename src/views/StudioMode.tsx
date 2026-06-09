import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Waves, 
  Activity, 
  Sliders, 
  Maximize2, 
  Volume2, 
  Settings, 
  Share2, 
  Mic2,
  Disc,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils/cn';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';

/**
 * StudioMode: Audio Mastering Suite
 * Provides high-level abstractions for Web Audio API nodes:
 * - BiquadFilterNode (EQ)
 * - DynamicsCompressorNode (Dynamics)
 * - StereoPannerNode (Imaging)
 */
const StudioMode: React.FC = () => {
  const [eqGains, setEqGains] = useState([0, 2, 4, 1, -2]); // Low to High
  const [compression, setCompression] = useState(70);
  const [isLive, setIsLive] = useState(true);

  const bands = ['Sub', 'Low', 'Mid', 'High', 'Air'];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex items-end justify-between">
        <div className="flex items-center gap-6">
           <div className="h-24 w-24 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(0,240,255,0.1)]">
              <Mic2 size={40} />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-primary text-surface text-[10px] font-black uppercase tracking-widest">Host Mode</span>
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                  <Activity size={14} className="text-red-500 animate-pulse" /> 124 Listeners
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter">Studio Mastering</h1>
              <p className="text-on-surface-variant font-medium">Fine-tune the resonance of your live ecosystem.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <NeonButton variant="secondary" className="border-white/5">
             <Share2 size={18} /> BROADCAST PRESET
           </NeonButton>
           <NeonButton>
             <Zap size={18} fill="currentColor" /> GO LIVE
           </NeonButton>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* --- Parametric EQ Visualizer --- */}
        <GlassCard className="col-span-8 p-8 space-y-8 min-h-[400px] flex flex-col">
           <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Waves size={18} className="text-primary" /> Multi-Band Equalizer
              </h3>
              <div className="flex gap-2">
                {['Linear', 'Analogue', 'Clean'].map(mode => (
                  <button key={mode} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-on-surface-variant border border-white/5 hover:text-primary transition-colors">
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
           </div>

           {/* Visual EQ Curve Placeholder */}
           <div className="flex-1 relative bg-surface-container-lowest/50 rounded-2xl border border-white/5 overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-around px-12 pointer-events-none opacity-20">
                 {Array.from({ length: 40 }).map((_, i) => (
                   <div key={i} className="w-[1px] h-full bg-white/10" />
                 ))}
              </div>
              
              {/* Dynamic SVG Curve */}
              <svg className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
                 <path 
                   d={`M 0 150 Q 200 ${150 - eqGains[0]*10}, 400 ${150 - eqGains[2]*10} T 800 150`} 
                   fill="none" 
                   stroke="url(#eq-gradient)" 
                   strokeWidth="4"
                   className="transition-all duration-500"
                 />
                 <defs>
                   <linearGradient id="eq-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#00f0ff" />
                     <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
                   </linearGradient>
                 </defs>
              </svg>

              {/* EQ Points */}
              <div className="absolute inset-0 flex items-center justify-around px-12">
                 {eqGains.map((gain, i) => (
                   <div key={i} className="relative flex flex-col items-center group/point">
                      <div 
                        className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-ns-resize transition-transform hover:scale-150 active:scale-95"
                        style={{ transform: `translateY(${-gain * 8}px)` }}
                      />
                      <span className="absolute -bottom-8 text-[10px] font-bold text-on-surface-variant group-hover/point:text-primary transition-colors">
                        {bands[i]}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </GlassCard>

        {/* --- Dynamics & Imaging --- */}
        <div className="col-span-4 space-y-8">
           <GlassCard className="p-8 space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Activity size={18} className="text-primary" /> Dynamics Control
              </h3>
              
              <div className="space-y-8 pt-4">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-on-surface-variant uppercase tracking-widest">Compression</span>
                       <span className="text-primary font-mono">{compression}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={compression}
                      onChange={(e) => setCompression(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                       <p className="text-[10px] font-black text-on-surface-variant tracking-widest uppercase">Ratio</p>
                       <p className="text-xl font-black">4:1</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                       <p className="text-[10px] font-black text-on-surface-variant tracking-widest uppercase">Attack</p>
                       <p className="text-xl font-black">5ms</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard className="p-8 space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Maximize2 size={18} className="text-primary" /> Stereo Imager
              </h3>
              
              <div className="relative h-32 w-full flex items-center justify-center">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,240,255,0.05)_0%,_transparent_70%)] rounded-full" />
                 <div className="w-full h-[1px] bg-white/10" />
                 <div className="h-full w-[1px] bg-white/10" />
                 
                 <div className="absolute h-12 w-32 border-2 border-primary/20 rounded-full animate-pulse" />
                 <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_15px_#00f0ff]" />
                 
                 <span className="absolute left-0 text-[10px] font-black text-on-surface-variant">LEFT</span>
                 <span className="absolute right-0 text-[10px] font-black text-on-surface-variant">RIGHT</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                 <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Width Expansion</p>
                 <div className="h-6 w-12 rounded-full bg-primary p-1 flex justify-end cursor-pointer">
                    <div className="h-4 w-4 rounded-full bg-surface" />
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* --- Active Mastering Profiles --- */}
      <section className="space-y-6">
         <h2 className="text-2xl font-black flex items-center gap-3">
           <Sliders size={24} className="text-primary" /> Mastering Presets
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Pure Clarity', tags: ['VOCAL', 'CLEAN'] },
              { name: 'Deep Bass Boost', tags: ['TECHNO', 'SUB'] },
              { name: 'Cinematic Wide', tags: ['AMBIENT', 'WIDTH'] },
              { name: 'Lo-Fi Warmth', tags: ['VINTAGE', 'TAPE'] },
            ].map((preset, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-[32px] bg-surface-container-low/40 border border-white/5 hover:border-primary/50 transition-all group cursor-pointer"
              >
                 <div className="flex items-center justify-between mb-4">
                    <Disc size={20} className="text-on-surface-variant group-hover:text-primary transition-colors group-hover:animate-spin-slow" />
                    <ArrowRight size={16} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                 </div>
                 <h4 className="font-bold mb-3">{preset.name}</h4>
                 <div className="flex gap-2">
                    {preset.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded border border-white/5 text-on-surface-variant uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default StudioMode;
