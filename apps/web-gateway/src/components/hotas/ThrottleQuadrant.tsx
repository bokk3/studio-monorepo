import React, { useRef, useState, useEffect } from 'react';
import { 
  Flame, 
  Lock, 
  Unlock, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { hotasAudio } from './hotasAudio';
import { Button } from '@/components/ui/button';

interface ThrottleQuadrantProps {
  throttle: number;
  setThrottle: (val: number) => void;
  boostActive: boolean;
  setBoostActive: (active: boolean) => void;
  rcsState: { up: boolean; down: boolean; left: boolean; right: boolean };
  setRcsState: React.Dispatch<React.SetStateAction<{ up: boolean; down: boolean; left: boolean; right: boolean }>>;
}

export const ThrottleQuadrant: React.FC<ThrottleQuadrantProps> = ({
  throttle,
  setThrottle,
  boostActive,
  setBoostActive,
  rcsState,
  setRcsState
}) => {
  const [cruiseLocked, setCruiseLocked] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastDetent = useRef<number>(Math.round(throttle / 25) * 25);

  const detents = [
    { value: 100, label: "WARP", color: "text-neon-magenta" },
    { value: 75, label: "MIL", color: "text-white" },
    { value: 50, label: "CRUISE", color: "text-neon-cyan font-bold" },
    { value: 25, label: "RECON", color: "text-slate-400" },
    { value: 0, label: "IDLE", color: "text-slate-500" },
  ];

  const updateThrottleFromY = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const clampedY = Math.max(0, Math.min(rect.height, relativeY));
    // Invert: top is 100%, bottom is 0%
    const percentage = Math.round(100 - (clampedY / rect.height) * 100);
    
    // Check if we passed a 25% detent notch for haptic & audio tick
    const currentDetent = Math.round(percentage / 25) * 25;
    if (Math.abs(percentage - currentDetent) <= 2 && lastDetent.current !== currentDetent) {
      lastDetent.current = currentDetent;
      hotasAudio.playDetentTick();
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
    }

    setThrottle(percentage);
  };

  // Sync thruster hum
  useEffect(() => {
    hotasAudio.updateThrusterHum(throttle, boostActive);
  }, [throttle, boostActive]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateThrottleFromY(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      updateThrottleFromY(e.clientY);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleRcsPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    setRcsState(prev => ({ ...prev, [direction]: true }));
    hotasAudio.playDetentTick();
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleRcsRelease = (direction: 'up' | 'down' | 'left' | 'right') => {
    setRcsState(prev => ({ ...prev, [direction]: false }));
  };

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-black/60 border border-slate-800/90 rounded-2xl select-none backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Flame size={13} className={throttle > 75 ? "text-neon-magenta animate-pulse" : "text-neon-cyan"} />
          <span className="font-bold tracking-wider uppercase text-white">THRUST VECTOR</span>
        </div>
        <button
          onClick={() => {
            setCruiseLocked(!cruiseLocked);
            hotasAudio.playDetentTick();
            if ('vibrate' in navigator) navigator.vibrate(30);
          }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
            cruiseLocked 
              ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_8px_#00F3FF]' 
              : 'bg-black/40 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {cruiseLocked ? <Lock size={10} /> : <Unlock size={10} />}
          {cruiseLocked ? "CRUISE LOCK" : "UNLOCKED"}
        </button>
      </div>

      {/* Main Track & Detent Rail */}
      <div className="flex items-center justify-center my-3 relative gap-4">
        {/* Detent Labels */}
        <div className="flex flex-col justify-between h-48 py-1 font-mono text-[9px] text-right pointer-events-none w-14">
          {detents.map((d) => (
            <div key={d.value} className="flex items-center justify-end gap-1.5">
              <span className={d.color}>{d.label}</span>
              <span className="text-slate-600 text-[8px]">{d.value}%</span>
              <div className={`w-1.5 h-0.5 ${throttle >= d.value ? 'bg-neon-cyan shadow-[0_0_4px_#00F3FF]' : 'bg-slate-800'}`} />
            </div>
          ))}
        </div>

        {/* Tactile Vertical Slider Track */}
        <div 
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-12 h-52 bg-slate-950 rounded-xl border border-slate-800 p-1 cursor-ns-resize touch-none flex items-end shadow-inner"
        >
          {/* Active Fill Glow Bar */}
          <div 
            className="w-full rounded-lg transition-all duration-75 relative bg-gradient-to-t from-blue-700 via-neon-cyan to-neon-magenta shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            style={{ height: `${Math.max(4, throttle)}%` }}
          >
            {/* Grip Handle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 bg-slate-900 border-2 border-white rounded-md shadow-[0_0_12px_rgba(255,255,255,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <div className="w-6 h-0.5 bg-neon-cyan shadow-[0_0_4px_#00F3FF]" />
            </div>
          </div>
        </div>

        {/* Readout Number */}
        <div className="flex flex-col items-center justify-center font-mono w-16">
          <span className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {throttle}
          </span>
          <span className="text-[9px] text-neon-cyan uppercase font-bold tracking-wider">PCT</span>
          <span className="text-[8px] text-slate-500 uppercase mt-1">
            {throttle === 100 ? "AFTERBURNER" : throttle >= 75 ? "MILITARY" : throttle >= 50 ? "SUPERCRUISE" : throttle > 0 ? "MANEUVER" : "ZERO IDLE"}
          </span>
        </div>
      </div>

      {/* RCS 4-Way Hat Switch */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-400">RCS TRANSLATION</span>
          <span className="text-[8px] text-slate-600">4-AXIS STRAFE</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 max-w-[150px] mx-auto">
          {/* Row 1 */}
          <div />
          <button
            onPointerDown={() => handleRcsPress('up')}
            onPointerUp={() => handleRcsRelease('up')}
            onPointerLeave={() => handleRcsRelease('up')}
            className={`h-8 rounded flex items-center justify-center border transition-all ${
              rcsState.up 
                ? 'bg-neon-cyan text-black border-white shadow-[0_0_10px_#00F3FF]' 
                : 'bg-black/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ChevronUp size={16} />
          </button>
          <div />

          {/* Row 2 */}
          <button
            onPointerDown={() => handleRcsPress('left')}
            onPointerUp={() => handleRcsRelease('left')}
            onPointerLeave={() => handleRcsRelease('left')}
            className={`h-8 rounded flex items-center justify-center border transition-all ${
              rcsState.left 
                ? 'bg-neon-cyan text-black border-white shadow-[0_0_10px_#00F3FF]' 
                : 'bg-black/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="h-8 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">
            RCS
          </div>

          <button
            onPointerDown={() => handleRcsPress('right')}
            onPointerUp={() => handleRcsRelease('right')}
            onPointerLeave={() => handleRcsRelease('right')}
            className={`h-8 rounded flex items-center justify-center border transition-all ${
              rcsState.right 
                ? 'bg-neon-cyan text-black border-white shadow-[0_0_10px_#00F3FF]' 
                : 'bg-black/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ChevronRight size={16} />
          </button>

          {/* Row 3 */}
          <div />
          <button
            onPointerDown={() => handleRcsPress('down')}
            onPointerUp={() => handleRcsRelease('down')}
            onPointerLeave={() => handleRcsRelease('down')}
            className={`h-8 rounded flex items-center justify-center border transition-all ${
              rcsState.down 
                ? 'bg-neon-cyan text-black border-white shadow-[0_0_10px_#00F3FF]' 
                : 'bg-black/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ChevronDown size={16} />
          </button>
          <div />
        </div>
      </div>

      {/* Boost / Emergency Burn Button */}
      <Button
        onPointerDown={() => {
          setBoostActive(true);
          hotasAudio.playRailgunShot();
          if ('vibrate' in navigator) navigator.vibrate(80);
        }}
        onPointerUp={() => setBoostActive(false)}
        onPointerLeave={() => setBoostActive(false)}
        variant="cyan"
        className={`w-full mt-2 h-10 text-xs font-black tracking-widest gap-2 transition-all ${
          boostActive 
            ? 'bg-neon-magenta text-white border-white shadow-[0_0_20px_#FF00FF] scale-95' 
            : ''
        }`}
      >
        <Zap size={14} className={boostActive ? "animate-pulse" : ""} />
        {boostActive ? "BOOST INJECT ACTIVE" : "HOLD: OVERDRIVE BOOST"}
      </Button>
    </div>
  );
};
