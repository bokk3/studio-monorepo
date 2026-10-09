import { useState, useEffect } from 'react';
import { Smartphone, Zap, Crosshair, RotateCcw } from 'lucide-react';

export default function Controller() {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [throttle, setThrottle] = useState(50);
  const [tarePitch, setTarePitch] = useState(0);
  const [tareRoll, setTareRoll] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [vibrateSupported, setVibrateSupported] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Calibrated");

  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      setVibrateSupported(true);
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setHasGyro(true);
        // Normalize degrees relative to tare
        const rawPitch = Math.max(-45, Math.min(45, (e.beta || 0) - tarePitch));
        const rawRoll = Math.max(-45, Math.min(45, (e.gamma || 0) - tareRoll));
        setPitch(Number(rawPitch.toFixed(1)));
        setRoll(Number(rawRoll.toFixed(1)));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [tarePitch, tareRoll]);

  const handleTare = () => {
    setTarePitch(pitch + tarePitch);
    setTareRoll(roll + tareRoll);
    setStatusMsg("Horizon Re-Zeroed");
    if (vibrateSupported) navigator.vibrate(50);
    setTimeout(() => setStatusMsg("Calibrated"), 1500);
  };

  const requestGyroPermission = () => {
    // iOS 13+ permission request
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((res: string) => {
          if (res === 'granted') {
            setHasGyro(true);
            setStatusMsg("Sensors Online");
          }
        })
        .catch(console.error);
    }
  };

  const handleTrigger = (type: string) => {
    if (vibrateSupported) {
      if (type === 'fire') navigator.vibrate([20, 20, 20]);
      if (type === 'boost') navigator.vibrate(80);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto flex flex-col justify-between select-none">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase block">MOBILE WEB HOTAS TESTBED</span>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone size={20} className="text-neon-cyan" />
            Cockpit Companion
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-black/60 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">GYRO: </span>
            <span className={hasGyro ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {hasGyro ? "ACTIVE" : "SIMULATED"}
            </span>
          </div>

          {!hasGyro && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && (
            <button 
              onClick={requestGyroPermission}
              className="px-3 py-1 bg-neon-cyan text-black font-mono text-xs font-bold rounded"
            >
              Enable Gyro
            </button>
          )}
        </div>
      </div>

      {/* Main Cockpit Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {/* Left: Throttle Slider */}
        <div className="p-6 rounded-2xl bg-black/50 border border-slate-800 flex flex-col items-center justify-between">
          <span className="text-xs font-mono text-slate-400 tracking-wider uppercase mb-3">THRUST OUTPUT</span>
          
          <div className="h-48 flex items-center my-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={throttle} 
              onChange={(e) => setThrottle(Number(e.target.value))}
              className="w-48 h-3 bg-slate-800 accent-neon-cyan rounded-lg appearance-none cursor-pointer -rotate-90" 
            />
          </div>

          <div className="text-center font-mono">
            <span className="text-2xl font-black text-white">{throttle}%</span>
            <span className="text-[10px] text-slate-500 block uppercase">Cruise Speed</span>
          </div>
        </div>

        {/* Center: Artificial Horizon & Gyro Gauges */}
        <div className="p-6 rounded-2xl bg-black/50 border border-neon-cyan/40 shadow-[0_0_25px_rgba(0,243,255,0.1)] flex flex-col items-center justify-between">
          <div className="w-full flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>PITCH: <strong className="text-white">{pitch}°</strong></span>
            <span>ROLL: <strong className="text-white">{roll}°</strong></span>
          </div>

          {/* Artificial Horizon Sphere / Crosshair */}
          <div className="w-48 h-48 rounded-full border-2 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center">
            {/* Horizon line reacting to roll and pitch */}
            <div 
              className="absolute w-64 h-0.5 bg-neon-cyan/80 shadow-[0_0_8px_#00F3FF]"
              style={{
                transform: `translateY(${pitch * 1.5}px) rotate(${roll}deg)`
              }}
            />
            {/* Crosshair Center */}
            <div className="w-6 h-6 border border-white/80 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 bg-neon-magenta rounded-full shadow-[0_0_6px_#FF00FF]" />
            </div>

            {/* Pitch scale ticks */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col space-y-3 pointer-events-none opacity-40 text-[8px] font-mono text-white">
              <span>+30</span>
              <span>---</span>
              <span>-30</span>
            </div>
          </div>

          <button 
            onClick={handleTare}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-neon-cyan/15 border border-neon-cyan text-neon-cyan font-mono text-xs font-bold tracking-wider uppercase hover:bg-neon-cyan/25 flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(0,243,255,0.2)] active:scale-95"
          >
            <RotateCcw size={14} />
            Tare Horizon (Zero-Lock)
          </button>
        </div>

        {/* Right: Weapon Controls & Boost */}
        <div className="p-6 rounded-2xl bg-black/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <span className="text-xs font-mono text-slate-400 tracking-wider uppercase text-center">COMBAT MATRIX</span>

          <div className="space-y-3">
            <button 
              onMouseDown={() => handleTrigger('fire')}
              onTouchStart={() => handleTrigger('fire')}
              className="w-full py-4 rounded-xl bg-neon-magenta/20 border border-neon-magenta text-white font-mono text-sm font-black tracking-widest uppercase hover:bg-neon-magenta/30 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,0,255,0.3)] flex items-center justify-center gap-2"
            >
              <Crosshair size={18} className="text-neon-magenta" />
              Primary Fire
            </button>

            <button 
              onMouseDown={() => { setBoostActive(true); handleTrigger('boost'); }}
              onMouseUp={() => setBoostActive(false)}
              onTouchStart={() => { setBoostActive(true); handleTrigger('boost'); }}
              onTouchEnd={() => setBoostActive(false)}
              className={`w-full py-4 rounded-xl font-mono text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                boostActive 
                  ? 'bg-electric-blue text-white border-2 border-white shadow-[0_0_25px_rgba(0,85,255,0.8)] scale-95' 
                  : 'bg-electric-blue/20 border border-electric-blue text-blue-200 hover:bg-electric-blue/30 shadow-[0_0_12px_rgba(0,85,255,0.2)]'
              }`}
            >
              <Zap size={18} />
              Afterburner Boost
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>HAPTIC ENGINE:</span>
            <span className={vibrateSupported ? "text-emerald-400 font-bold" : "text-slate-500"}>
              {vibrateSupported ? "READY" : "DESKTOP MODE"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-900 text-center font-mono text-[11px] text-slate-500">
        Status: <strong className="text-neon-cyan">{statusMsg}</strong> &bull; Protocol: 16-Byte Binary DataChannel &bull; Local Latency Target: &lt;3ms
      </div>
    </div>
  );
}
