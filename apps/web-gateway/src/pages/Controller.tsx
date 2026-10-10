import { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Zap, 
  Crosshair, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Activity, 
  Compass, 
  Radio, 
  Flame
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Controller() {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [throttle, setThrottle] = useState(50);
  const [tarePitch, setTarePitch] = useState(0);
  const [tareRoll, setTareRoll] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [vibrateSupported, setVibrateSupported] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Calibrated & Ready");
  const [shotsFired, setShotsFired] = useState(0);
  const [heatLevel, setHeatLevel] = useState(12);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthesized HUD audio cues
  const playSfx = (freq: number, type: OscillatorType = 'sine', duration: number = 0.08, endFreq?: number) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context restricted until user gesture
    }
  };

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

  // Heat cooldown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setHeatLevel(prev => Math.max(5, prev - 3));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const handleTare = () => {
    setTarePitch(pitch + tarePitch);
    setTareRoll(roll + tareRoll);
    setStatusMsg("Horizon Re-Zeroed");
    playSfx(880, 'sine', 0.12, 1320);
    if (vibrateSupported) navigator.vibrate(40);
    setTimeout(() => setStatusMsg("Calibrated & Ready"), 1500);
  };

  const requestGyroPermission = () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((res: string) => {
          if (res === 'granted') {
            setHasGyro(true);
            setStatusMsg("Sensors Online");
            playSfx(1050, 'triangle', 0.15);
          }
        })
        .catch(console.error);
    }
  };

  const handleFire = () => {
    setShotsFired(prev => prev + 1);
    setHeatLevel(prev => Math.min(100, prev + 14));
    playSfx(920, 'sawtooth', 0.06, 220);
    if (vibrateSupported) navigator.vibrate([25, 20, 25]);
  };

  const handleBoostStart = () => {
    setBoostActive(true);
    playSfx(140, 'triangle', 0.3, 380);
    if (vibrateSupported) navigator.vibrate(70);
  };

  const handleBoostEnd = () => {
    setBoostActive(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto flex flex-col justify-between select-none">
      {/* Top Telemetry Header */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00F3FF]" />
              <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase">
                TACHYON TELEMETRY BUS // PROTOCOL V1.2
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Smartphone size={22} className="text-neon-cyan" />
              HOTAS Cockpit Companion
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge 
              variant={hasGyro ? "default" : "secondary"}
              className="gap-1.5 font-mono text-[11px] py-1 px-3"
            >
              <Radio size={12} className={hasGyro ? "text-neon-cyan animate-pulse" : "text-amber-400"} />
              GYRO: {hasGyro ? "HARDWARE ONLINE" : "DESKTOP SIMULATOR"}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSfx(660, 'sine', 0.05);
              }}
              className="text-xs font-mono h-8 border-slate-800 text-slate-300 hover:text-white"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={14} className="text-neon-cyan mr-1.5" />
                  SFX ON
                </>
              ) : (
                <>
                  <VolumeX size={14} className="text-slate-500 mr-1.5" />
                  MUTED
                </>
              )}
            </Button>

            {!hasGyro && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && (
              <Button 
                onClick={requestGyroPermission}
                size="sm"
                className="bg-neon-cyan text-black font-mono text-xs font-bold hover:bg-neon-cyan/90 h-8"
              >
                Enable Gyro
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Cockpit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left: Throttle Quadrant (col-span-3) */}
        <Card className="lg:col-span-3 border-slate-800/90 bg-slate-950/70 flex flex-col justify-between p-4 sm:p-6">
          <CardHeader className="p-0 pb-3 text-center">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
              AXIS 03 // VECTOR
            </span>
            <CardTitle className="text-sm font-mono text-white flex items-center justify-center gap-1.5">
              <Flame size={14} className={throttle > 75 ? "text-neon-magenta animate-pulse" : "text-neon-cyan"} />
              THRUST QUADRANT
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col items-center justify-center my-4">
            <div className="h-56 flex items-center justify-center my-2 relative">
              {/* Throttle Detent Markers */}
              <div className="absolute -left-6 h-48 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <input 
                type="range" 
                min="0" 
                max="100" 
                value={throttle} 
                onChange={(e) => {
                  setThrottle(Number(e.target.value));
                  if (Number(e.target.value) % 25 === 0) playSfx(440, 'sine', 0.03);
                }}
                className="w-48 h-3 bg-slate-900 accent-neon-cyan rounded-lg appearance-none cursor-pointer -rotate-90 shadow-[0_0_15px_rgba(0,243,255,0.2)]" 
              />
            </div>

            <div className="w-full text-center font-mono mt-3 p-3 rounded-xl bg-black/60 border border-slate-900">
              <span className="text-3xl font-black text-white tracking-tight">{throttle}%</span>
              <span className="text-[10px] text-slate-500 block uppercase mt-0.5">
                {throttle === 0 ? "IDLE / BRAKE" : throttle > 85 ? "MILITARY POWER" : "SUPERCRUISE"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Center: Artificial Horizon & Gyro HUD (col-span-5) */}
        <Card className="lg:col-span-5 border-neon-cyan/40 bg-slate-950/80 shadow-[0_0_30px_rgba(0,243,255,0.08)] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
          <CardHeader className="p-0 pb-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-neon-cyan" />
                6-DOF ATTITUDE
              </span>
              <Badge variant="outline" className="text-[10px] font-mono text-neon-cyan border-neon-cyan/30">
                LCOS VIRTUAL GIMBAL
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col items-center justify-center my-3">
            {/* Attitude readout header */}
            <div className="w-full flex justify-between px-3 py-1.5 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono text-slate-300 mb-3">
              <span>PITCH: <strong className="text-neon-cyan font-bold">{pitch > 0 ? `+${pitch}` : pitch}&deg;</strong></span>
              <span>ROLL: <strong className="text-neon-magenta font-bold">{roll > 0 ? `+${roll}` : roll}&deg;</strong></span>
            </div>

            {/* Artificial Horizon Sphere / Reticle */}
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-inner">
              {/* Sky / Ground Background Gradient reacting to pitch */}
              <div 
                className="absolute inset-0 transition-transform duration-75"
                style={{
                  transform: `translateY(${pitch * 1.8}px) rotate(${roll}deg)`
                }}
              >
                {/* Upper Sky Section */}
                <div className="h-1/2 bg-gradient-to-t from-electric-blue/20 to-transparent border-b border-neon-cyan/60" />
                {/* Lower Ground Section */}
                <div className="h-1/2 bg-gradient-to-b from-amber-500/10 to-transparent border-t border-amber-500/30" />
              </div>

              {/* Pitch Ladder Marks */}
              <div 
                className="absolute flex flex-col items-center space-y-4 pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translateY(${pitch * 1.8}px) rotate(${roll}deg)`
                }}
              >
                <div className="w-16 h-0.5 bg-neon-cyan/70 flex justify-between text-[7px] font-mono text-neon-cyan px-0.5">
                  <span>+20</span>
                  <span>+20</span>
                </div>
                <div className="w-24 h-0.5 bg-neon-cyan/90 flex justify-between text-[8px] font-mono text-neon-cyan px-1">
                  <span>+10</span>
                  <span>+10</span>
                </div>
                {/* Horizon Line */}
                <div className="w-40 h-1 bg-neon-cyan shadow-[0_0_10px_#00F3FF]" />
                <div className="w-24 h-0.5 bg-neon-magenta/90 flex justify-between text-[8px] font-mono text-neon-magenta px-1">
                  <span>-10</span>
                  <span>-10</span>
                </div>
                <div className="w-16 h-0.5 bg-neon-magenta/70 flex justify-between text-[7px] font-mono text-neon-magenta px-0.5">
                  <span>-20</span>
                  <span>-20</span>
                </div>
              </div>

              {/* Static Flight Reticle Center */}
              <div className="z-10 relative flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 border border-white/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-neon-magenta rounded-full shadow-[0_0_8px_#FF00FF] animate-ping" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full absolute" />
                </div>
                {/* Reticle Wings */}
                <div className="absolute -left-5 w-4 h-0.5 bg-white/70" />
                <div className="absolute -right-5 w-4 h-0.5 bg-white/70" />
                <div className="absolute -top-5 w-0.5 h-4 bg-white/70" />
              </div>

              {/* Ticks on perimeter */}
              <div className="absolute inset-2 border border-dashed border-slate-700/50 rounded-full pointer-events-none" />
            </div>

            {/* Zero-Lock Calibration Button */}
            <Button 
              onClick={handleTare}
              variant="outline"
              className="mt-4 w-full border-neon-cyan text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 hover:text-white font-mono text-xs font-bold uppercase tracking-wider gap-2 shadow-[0_0_15px_rgba(0,243,255,0.15)] active:scale-95"
            >
              <RotateCcw size={14} />
              Zero-Lock Horizon (Tare)
            </Button>
          </CardContent>
        </Card>

        {/* Right: Weapon & Avionics Matrix (col-span-4) */}
        <Card className="lg:col-span-4 border-slate-800/90 bg-slate-950/70 flex flex-col justify-between p-4 sm:p-6 space-y-4">
          <CardHeader className="p-0 pb-1 text-center">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
              FIRE CONTROL // WEAPONS
            </span>
            <CardTitle className="text-sm font-mono text-white flex items-center justify-center gap-1.5">
              <Crosshair size={14} className="text-neon-magenta" />
              COMBAT ACTUATORS
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            {/* Primary Kinetic Trigger */}
            <button 
              onClick={handleFire}
              onMouseDown={handleFire}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-neon-magenta/20 to-purple-600/30 border-2 border-neon-magenta text-white font-mono text-sm font-black tracking-widest uppercase hover:bg-neon-magenta/40 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,0,255,0.35)] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Crosshair size={20} className="text-neon-magenta animate-spin-slow" />
              Primary Kinetic Fire
            </button>

            {/* Afterburner Boost Actuator */}
            <button 
              onMouseDown={handleBoostStart}
              onMouseUp={handleBoostEnd}
              onTouchStart={handleBoostStart}
              onTouchEnd={handleBoostEnd}
              className={`w-full py-5 rounded-2xl font-mono text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 cursor-pointer ${
                boostActive 
                  ? 'bg-electric-blue text-white border-2 border-white shadow-[0_0_30px_rgba(0,85,255,0.9)] scale-95' 
                  : 'bg-electric-blue/20 border-2 border-electric-blue text-blue-200 hover:bg-electric-blue/30 shadow-[0_0_15px_rgba(0,85,255,0.25)]'
              }`}
            >
              <Zap size={20} className={boostActive ? "text-white animate-pulse" : "text-electric-blue"} />
              {boostActive ? "AFTERBURNER ENGAGED" : "Hold: Afterburner Boost"}
            </button>

            {/* Thermal Heat & Ammo Gauge */}
            <div className="p-3 rounded-xl bg-black/60 border border-slate-900 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">GUN THERMAL LOAD:</span>
                <span className={heatLevel > 70 ? "text-rose-400 font-bold" : "text-neon-cyan font-bold"}>
                  {heatLevel}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-200 ${heatLevel > 70 ? 'bg-rose-500' : 'bg-neon-cyan'}`} 
                  style={{ width: `${heatLevel}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1 text-slate-500">
                <span>SHOTS RELEASED:</span>
                <span className="text-white font-bold">{shotsFired}</span>
              </div>
            </div>

            {/* Haptic & Telemetry Status Box */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>HAPTIC VIBRATION:</span>
                <span className={vibrateSupported ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {vibrateSupported ? "ACTUATOR ACTIVE" : "EMULATED"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>UPDATE RATE:</span>
                <span className="text-neon-cyan font-bold">60Hz UNCHOKED</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulator Test Controls (Desktop Fallback) */}
      {!hasGyro && (
        <div className="mt-6 p-4 rounded-xl bg-black/50 border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 uppercase text-[10px]">Desktop Simulator Controls (No Mobile Gyro Detected):</span>
            <Badge variant="outline" className="text-[10px]">Manual Sliders</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Simulate Pitch: {pitch}&deg;</span>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                value={pitch} 
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-neon-cyan h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Simulate Roll: {roll}&deg;</span>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                value={roll} 
                onChange={(e) => setRoll(Number(e.target.value))}
                className="w-full accent-neon-magenta h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-900 text-center font-mono text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Activity size={12} className="text-emerald-400" />
          Status: <strong className="text-neon-cyan">{statusMsg}</strong>
        </span>
        <span>16-Byte WebRTC DataChannel &bull; Sub-3ms Target</span>
        <span className="text-slate-600">PWA Manifest Ready &bull; Offline Capable</span>
      </div>
    </div>
  );
}
