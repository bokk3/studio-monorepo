import React from 'react';
import { 
  RotateCcw, 
  Radar, 
  Target
} from 'lucide-react';
import { hotasAudio } from './hotasAudio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AttitudeHorizonProps {
  pitch: number;
  roll: number;
  yaw: number;
  hasGyro: boolean;
  onTare: () => void;
  gForce: number;
  setPitch?: (p: number) => void;
  setRoll?: (r: number) => void;
}

export const AttitudeHorizon: React.FC<AttitudeHorizonProps> = ({
  pitch,
  roll,
  yaw,
  hasGyro,
  onTare,
  gForce,
  setPitch,
  setRoll
}) => {
  // Normalize yaw to 0-359
  const heading = Math.round(((yaw % 360) + 360) % 360);

  const handleTareClick = () => {
    hotasAudio.playTareChime();
    if ('vibrate' in navigator) navigator.vibrate([30, 20, 30]);
    onTare();
  };

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-black/60 border border-neon-cyan/40 rounded-2xl select-none backdrop-blur-md shadow-[0_0_25px_rgba(0,243,255,0.08)] relative overflow-hidden">
      {/* Dynamic Heading Compass Tape */}
      <div className="border-b border-slate-800 pb-2 mb-2 font-mono">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_6px_#00F3FF]" />
            <span className="font-bold text-white tracking-widest uppercase">ADI // PRIMARY DISPLAY</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] py-0 px-2 border-slate-800">
              G-LOAD: <strong className={gForce > 3.0 ? "text-rose-400 ml-1" : "text-neon-cyan ml-1"}>{gForce.toFixed(1)}G</strong>
            </Badge>
            <span className="text-neon-cyan font-bold text-xs">{heading.toString().padStart(3, '0')}&deg; HDG</span>
          </div>
        </div>

        {/* Moving Heading Tape Bar */}
        <div className="relative h-6 bg-slate-950 rounded border border-slate-900 overflow-hidden flex items-center justify-center">
          <div 
            className="flex items-center gap-6 text-[9px] text-slate-500 font-bold transition-transform duration-100"
            style={{ transform: `translateX(${-((heading % 90) * 1.5)}px)` }}
          >
            <span>{(heading - 30 + 360) % 360}&deg;</span>
            <span className="text-slate-400">{(heading - 15 + 360) % 360}&deg;</span>
            <span className="text-neon-cyan font-black border-x border-neon-cyan/40 px-1 bg-neon-cyan/10">
              {heading}&deg;
            </span>
            <span className="text-slate-400">{(heading + 15) % 360}&deg;</span>
            <span>{(heading + 30) % 360}&deg;</span>
          </div>
          {/* Compass Lubber Line Marker */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-neon-cyan shadow-[0_0_4px_#00F3FF] pointer-events-none" />
        </div>
      </div>

      {/* Main Glass Cockpit ADI Sphere / Collimated Reticle */}
      <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
        {/* Pitch & Roll readout badges */}
        <div className="absolute top-1 left-2 font-mono text-[10px] text-slate-400 z-20 bg-black/70 px-2 py-0.5 rounded border border-slate-800">
          PITCH: <span className="text-neon-cyan font-bold">{pitch > 0 ? `+${pitch}` : pitch}&deg;</span>
        </div>
        <div className="absolute top-1 right-2 font-mono text-[10px] text-slate-400 z-20 bg-black/70 px-2 py-0.5 rounded border border-slate-800">
          ROLL: <span className="text-neon-magenta font-bold">{roll > 0 ? `+${roll}` : roll}&deg;</span>
        </div>

        {/* Circular ADI Dial */}
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-inner">
          {/* Sky / Ground artificial horizon responding to pitch and roll */}
          <div 
            className="absolute inset-0 transition-transform duration-75"
            style={{
              transform: `translateY(${pitch * 1.6}px) rotate(${roll}deg)`
            }}
          >
            {/* Sky (Upper half) */}
            <div className="h-1/2 bg-gradient-to-t from-electric-blue/25 to-transparent border-b border-neon-cyan shadow-[0_0_8px_#00F3FF]" />
            {/* Ground (Lower half) */}
            <div className="h-1/2 bg-gradient-to-b from-amber-500/15 to-transparent border-t border-amber-500/40" />
          </div>

          {/* Collimated Pitch Ladder */}
          <div 
            className="absolute flex flex-col items-center space-y-4 pointer-events-none transition-transform duration-75 z-10"
            style={{
              transform: `translateY(${pitch * 1.6}px) rotate(${roll}deg)`
            }}
          >
            <div className="w-16 h-0.5 bg-neon-cyan/70 flex justify-between text-[7px] font-mono text-neon-cyan px-0.5">
              <span>+30</span>
              <span>+30</span>
            </div>
            <div className="w-20 h-0.5 bg-neon-cyan/80 flex justify-between text-[8px] font-mono text-neon-cyan px-1">
              <span>+20</span>
              <span>+20</span>
            </div>
            <div className="w-28 h-0.5 bg-neon-cyan/90 flex justify-between text-[8px] font-mono text-neon-cyan px-1">
              <span>+10</span>
              <span>+10</span>
            </div>
            {/* 0-Degree Horizon Line */}
            <div className="w-44 h-1 bg-neon-cyan shadow-[0_0_12px_#00F3FF]" />
            <div className="w-28 h-0.5 bg-neon-magenta/90 flex justify-between text-[8px] font-mono text-neon-magenta px-1">
              <span>-10</span>
              <span>-10</span>
            </div>
            <div className="w-20 h-0.5 bg-neon-magenta/80 flex justify-between text-[8px] font-mono text-neon-magenta px-1">
              <span>-20</span>
              <span>-20</span>
            </div>
            <div className="w-16 h-0.5 bg-neon-magenta/70 flex justify-between text-[7px] font-mono text-neon-magenta px-0.5">
              <span>-30</span>
              <span>-30</span>
            </div>
          </div>

          {/* Static Center Crosshair Aircraft Symbol */}
          <div className="z-20 relative flex items-center justify-center pointer-events-none">
            {/* Aircraft Wings */}
            <div className="w-12 h-12 border border-white/60 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-neon-magenta rounded-full shadow-[0_0_10px_#FF00FF] animate-ping" />
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute" />
            </div>
            {/* Gun Bore Line Wings */}
            <div className="absolute -left-6 w-5 h-0.5 bg-white/80" />
            <div className="absolute -right-6 w-5 h-0.5 bg-white/80" />
            <div className="absolute -top-6 w-0.5 h-5 bg-white/80" />
          </div>

          {/* Flight Path Marker (Velocity Vector Pip) reacting to roll/pitch rate */}
          <div 
            className="absolute z-20 pointer-events-none transition-all duration-150"
            style={{
              transform: `translate(${roll * 0.8}px, ${-pitch * 0.5}px)`
            }}
          >
            <div className="w-5 h-5 rounded-full border border-neon-cyan/70 flex items-center justify-center">
              <div className="w-1 h-1 bg-neon-cyan rounded-full" />
              <div className="absolute -left-2 w-2 h-0.5 bg-neon-cyan/70" />
              <div className="absolute -right-2 w-2 h-0.5 bg-neon-cyan/70" />
              <div className="absolute -top-2 w-0.5 h-2 bg-neon-cyan/70" />
            </div>
          </div>

          {/* Bank Angle Pointer at top perimeter */}
          <div 
            className="absolute top-2 z-10 pointer-events-none transition-transform duration-75"
            style={{ transform: `rotate(${roll}deg)` }}
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-neon-cyan" />
          </div>

          {/* Tactical Radar Sweep Widget in corner */}
          <div className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-black/80 border border-slate-800 flex items-center justify-center overflow-hidden z-20">
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20" />
            {/* Radar sweep beam */}
            <div className="w-full h-full rounded-full border-r-2 border-emerald-400/80 animate-spin" />
            {/* Blip 1 */}
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute top-3 left-4 animate-ping" />
            {/* Blip 2 */}
            <div className="w-1 h-1 bg-neon-cyan rounded-full absolute bottom-4 right-3" />
            <Radar size={12} className="text-emerald-400/50 absolute" />
          </div>

          {/* Target Tracking Lock Box */}
          <div className="absolute top-4 left-6 z-20 pointer-events-none font-mono text-[8px] text-emerald-400 flex items-center gap-1 bg-black/60 px-1 rounded border border-emerald-500/30">
            <Target size={10} />
            <span>TRK: ENEMY-01</span>
          </div>
        </div>
      </div>

      {/* Desktop Fallback Sliders (if no physical gyro detected) */}
      {!hasGyro && setPitch && setRoll && (
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 my-2 font-mono text-[9px]">
          <div className="flex justify-between items-center mb-1 text-slate-400">
            <span>DESKTOP MOTION EMULATION</span>
            <span className="text-amber-400">MANUAL GIMBAL</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Pitch: {pitch}&deg;</span>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                value={pitch} 
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-neon-cyan rounded cursor-pointer"
              />
            </div>
            <div>
              <span className="text-slate-500 block">Roll: {roll}&deg;</span>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                value={roll} 
                onChange={(e) => setRoll(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-neon-magenta rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Horizon Zero Tare Calibration Button */}
      <Button
        onClick={handleTareClick}
        variant="outline"
        className="w-full h-10 border-neon-cyan text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 font-mono text-xs font-bold uppercase tracking-wider gap-2 shadow-[0_0_15px_rgba(0,243,255,0.15)] active:scale-95"
      >
        <RotateCcw size={14} />
        Zero-Lock Horizon (Tare Level)
      </Button>
    </div>
  );
};
