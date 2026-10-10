import React, { useState, useRef, useEffect } from 'react';
import { 
  Crosshair, 
  Rocket, 
  Sparkles, 
  RefreshCw, 
  Cpu 
} from 'lucide-react';
import { hotasAudio } from './hotasAudio';
import { Badge } from '@/components/ui/badge';

interface FireControlProps {
  onFire: (weaponType: string) => void;
  onMissileLaunch: () => void;
  onCountermeasure: () => void;
  heatLevel: number;
  setHeatLevel: React.Dispatch<React.SetStateAction<number>>;
  shotsFired: number;
}

type WeaponType = 'kinetic' | 'laser' | 'railgun';

export const FireControl: React.FC<FireControlProps> = ({
  onFire,
  onMissileLaunch,
  onCountermeasure,
  heatLevel,
  setHeatLevel,
  shotsFired
}) => {
  const [activeWeapon, setActiveWeapon] = useState<WeaponType>('kinetic');
  const [missileLockState, setMissileLockState] = useState<'idle' | 'locking' | 'locked'>('idle');
  const [flareCount, setFlareCount] = useState(8);
  const lockTimer = useRef<any>(null);
  const isOverheated = heatLevel >= 95;

  const weaponConfigs = {
    kinetic: {
      name: "30MM KINETIC",
      heatPerShot: 12,
      accent: "text-neon-cyan",
      border: "border-neon-cyan/50",
      desc: "Rotary Armor-Piercing"
    },
    laser: {
      name: "PULSE LASER",
      heatPerShot: 8,
      accent: "text-neon-magenta",
      border: "border-neon-magenta/50",
      desc: "Coherent Particle Beam"
    },
    railgun: {
      name: "GAUSS RAILGUN",
      heatPerShot: 28,
      accent: "text-blue-400",
      border: "border-blue-500/50",
      desc: "Hypervelocity Slug"
    }
  };

  const handleWeaponCycle = () => {
    const sequence: WeaponType[] = ['kinetic', 'laser', 'railgun'];
    const nextIdx = (sequence.indexOf(activeWeapon) + 1) % sequence.length;
    setActiveWeapon(sequence[nextIdx]);
    hotasAudio.playDetentTick();
    if ('vibrate' in navigator) navigator.vibrate(25);
  };

  const handleFirePress = () => {
    if (isOverheated) {
      hotasAudio.playDetentTick();
      if ('vibrate' in navigator) navigator.vibrate([40, 40, 40]);
      return;
    }

    const cfg = weaponConfigs[activeWeapon];
    setHeatLevel(prev => Math.min(100, prev + cfg.heatPerShot));

    if (activeWeapon === 'kinetic') {
      hotasAudio.playKineticShot();
      if ('vibrate' in navigator) navigator.vibrate([20, 15, 20]);
    } else if (activeWeapon === 'laser') {
      hotasAudio.playLaserShot();
      if ('vibrate' in navigator) navigator.vibrate(25);
    } else {
      hotasAudio.playRailgunShot();
      if ('vibrate' in navigator) navigator.vibrate([60, 40, 80]);
    }

    onFire(activeWeapon);
  };

  const handleMissilePointerDown = () => {
    setMissileLockState('locking');
    hotasAudio.startMissileLockTone(false);
    if ('vibrate' in navigator) navigator.vibrate([20, 80, 20]);

    lockTimer.current = setTimeout(() => {
      setMissileLockState('locked');
      hotasAudio.stopMissileLockTone();
      hotasAudio.startMissileLockTone(true);
      if ('vibrate' in navigator) navigator.vibrate(100);
    }, 1100);
  };

  const handleMissilePointerUp = () => {
    if (lockTimer.current) {
      clearTimeout(lockTimer.current);
      lockTimer.current = null;
    }
    hotasAudio.stopMissileLockTone();

    if (missileLockState === 'locked') {
      hotasAudio.playRailgunShot();
      if ('vibrate' in navigator) navigator.vibrate([40, 20, 80]);
      onMissileLaunch();
    }
    setMissileLockState('idle');
  };

  const handleFlareDrop = () => {
    if (flareCount <= 0) return;
    setFlareCount(prev => prev - 1);
    hotasAudio.playFlareRelease();
    if ('vibrate' in navigator) navigator.vibrate([30, 30, 30]);
    onCountermeasure();
  };

  // Passive heat decay loop
  useEffect(() => {
    const timer = setInterval(() => {
      setHeatLevel(prev => Math.max(0, prev - 4));
    }, 300);
    return () => clearInterval(timer);
  }, [setHeatLevel]);

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-black/60 border border-slate-800/90 rounded-2xl select-none backdrop-blur-md">
      {/* Header & Weapon Selector */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Crosshair size={13} className="text-neon-magenta" />
          <span className="font-bold tracking-wider uppercase text-white">FIRE CONTROL</span>
        </div>
        <button
          onClick={handleWeaponCycle}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] hover:border-neon-cyan transition-all text-slate-300"
        >
          <RefreshCw size={10} className="text-neon-cyan" />
          <span>CYCLE SYSTEM</span>
        </button>
      </div>

      {/* Active Weapon Card */}
      <div 
        onClick={handleWeaponCycle}
        className={`p-2.5 rounded-xl bg-slate-950/90 border cursor-pointer transition-all my-2 font-mono ${weaponConfigs[activeWeapon].border}`}
      >
        <div className="flex justify-between items-center text-[10px] mb-1">
          <span className="text-slate-500 uppercase tracking-wider">HARDPOINT 01:</span>
          <Badge variant="outline" className={`text-[8px] py-0 px-1.5 ${weaponConfigs[activeWeapon].accent}`}>
            READY
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-sm font-black tracking-wider block ${weaponConfigs[activeWeapon].accent}`}>
              {weaponConfigs[activeWeapon].name}
            </span>
            <span className="text-[9px] text-slate-400 font-light">
              {weaponConfigs[activeWeapon].desc}
            </span>
          </div>
          <Cpu size={18} className={weaponConfigs[activeWeapon].accent} />
        </div>
      </div>

      {/* Main Kinetic Fire Thumb Trigger */}
      <div className="my-2">
        <button
          onPointerDown={handleFirePress}
          className={`w-full h-24 rounded-2xl border-2 font-mono font-black tracking-widest uppercase transition-all duration-75 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer ${
            isOverheated
              ? 'bg-rose-950/40 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-gradient-to-r from-neon-magenta/25 to-purple-800/40 border-neon-magenta text-white hover:bg-neon-magenta/35 active:scale-95 shadow-[0_0_25px_rgba(255,0,255,0.3)]'
          }`}
        >
          <Crosshair size={26} className={isOverheated ? "text-rose-400" : "text-neon-magenta"} />
          <span className="text-sm">
            {isOverheated ? "GUN OVERHEATED" : "PRIMARY FIRE"}
          </span>
          <span className="text-[9px] font-normal text-slate-300">
            {isOverheated ? "THERMAL VENTING..." : "TAP TO DISCHARGE"}
          </span>
        </button>
      </div>

      {/* Secondary Weapon: Missile Lock & Flares */}
      <div className="grid grid-cols-2 gap-2 my-2 font-mono">
        {/* Fox-2 Missile Lock Button */}
        <button
          onPointerDown={handleMissilePointerDown}
          onPointerUp={handleMissilePointerUp}
          onPointerLeave={handleMissilePointerUp}
          className={`h-16 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase transition-all cursor-pointer ${
            missileLockState === 'locked'
              ? 'bg-rose-600 text-white border-white shadow-[0_0_20px_#FF0055] scale-95'
              : missileLockState === 'locking'
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 animate-pulse'
              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Rocket size={16} className={missileLockState === 'locked' ? "text-white animate-bounce" : "text-amber-400"} />
          <span>
            {missileLockState === 'locked' 
              ? "RELEASE: FIRE!" 
              : missileLockState === 'locking' 
              ? "ACQUIRING..." 
              : "HOLD: FOX-2 LOCK"}
          </span>
        </button>

        {/* Countermeasure Flare Drop */}
        <button
          onClick={handleFlareDrop}
          disabled={flareCount <= 0}
          className="h-16 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-electric-blue text-slate-300 flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase transition-all active:scale-95 disabled:opacity-40"
        >
          <Sparkles size={16} className="text-electric-blue" />
          <span>CHAFF / FLARE</span>
          <span className="text-[8px] text-slate-500">[{flareCount} REMAINING]</span>
        </button>
      </div>

      {/* Thermal Bar & Ammunition Counters */}
      <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-[9px] space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">BARREL THERMAL LOAD:</span>
          <span className={heatLevel > 80 ? "text-rose-400 font-bold" : "text-neon-cyan font-bold"}>
            {heatLevel}%
          </span>
        </div>

        {/* Thermal Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className={`h-full transition-all duration-150 ${
              heatLevel > 85 ? 'bg-rose-500 shadow-[0_0_8px_#F43F5E]' : heatLevel > 50 ? 'bg-amber-400' : 'bg-neon-cyan shadow-[0_0_6px_#00F3FF]'
            }`} 
            style={{ width: `${heatLevel}%` }}
          />
        </div>

        <div className="flex justify-between items-center pt-1 text-slate-500 text-[8px]">
          <span>TOTAL ROUNDS EXPENDED:</span>
          <span className="text-white font-bold">{shotsFired}</span>
        </div>
      </div>
    </div>
  );
};
