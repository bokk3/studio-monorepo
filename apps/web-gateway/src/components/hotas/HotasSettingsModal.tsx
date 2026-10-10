import React from 'react';
import { 
  Settings, 
  X, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  SunMedium, 
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hotasAudio } from './hotasAudio';

export interface HotasSettings {
  invertPitch: boolean;
  invertRoll: boolean;
  sensitivity: number;
  deadzone: number;
  smoothing: number;
  isMuted: boolean;
  wakeLockActive: boolean;
}

interface HotasSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HotasSettings;
  setSettings: React.Dispatch<React.SetStateAction<HotasSettings>>;
  onToggleFullscreen: () => void;
  onToggleWakeLock: () => void;
}

export const HotasSettingsModal: React.FC<HotasSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onToggleFullscreen,
  onToggleWakeLock
}) => {
  if (!isOpen) return null;

  const toggleSound = () => {
    const nextMuted = !settings.isMuted;
    setSettings(prev => ({ ...prev, isMuted: nextMuted }));
    hotasAudio.setMuted(nextMuted);
    if (!nextMuted) hotasAudio.playTareChime();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-neon-cyan/40 rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.15)] p-5 font-mono text-xs text-slate-300 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Settings size={16} className="text-neon-cyan" />
            <span>HOTAS CALIBRATION & AVIONICS CONFIG</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Display & Screen Ergonomics */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
            COCKPIT DISPLAY & POWER
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="border-slate-800 justify-start gap-2 h-9 text-xs"
            >
              <Maximize2 size={13} className="text-neon-cyan" />
              Toggle Fullscreen
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleWakeLock}
              className={`border-slate-800 justify-start gap-2 h-9 text-xs ${
                settings.wakeLockActive ? 'text-emerald-400 border-emerald-500/40' : ''
              }`}
            >
              <SunMedium size={13} className={settings.wakeLockActive ? "text-emerald-400" : "text-amber-400"} />
              {settings.wakeLockActive ? "Wake-Lock: ACTIVE" : "Keep Screen Awake"}
            </Button>
          </div>
        </div>

        {/* Audio Synthesis */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
            PROCEDURAL AUDIO SYNTHESIZER
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            className="w-full border-slate-800 justify-between h-9 text-xs"
          >
            <span className="flex items-center gap-2">
              {settings.isMuted ? <VolumeX size={14} className="text-slate-500" /> : <Volume2 size={14} className="text-neon-cyan" />}
              Client-Side Web Audio SFX
            </span>
            <span className={settings.isMuted ? "text-slate-500" : "text-neon-cyan font-bold"}>
              {settings.isMuted ? "MUTED" : "ONLINE (UNMUTED)"}
            </span>
          </Button>
        </div>

        {/* Flight Axis Inversions & Sensitivity */}
        <div className="space-y-3 pt-1 border-t border-slate-900">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
            AXIS TUNING & SENSITIVITY
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSettings(prev => ({ ...prev, invertPitch: !prev.invertPitch }))}
              className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                settings.invertPitch ? 'border-neon-cyan bg-neon-cyan/10 text-white' : 'border-slate-800 bg-black/40 text-slate-400'
              }`}
            >
              <span>INVERT PITCH:</span>
              <span className="font-bold">{settings.invertPitch ? "YES" : "NO"}</span>
            </button>

            <button
              onClick={() => setSettings(prev => ({ ...prev, invertRoll: !prev.invertRoll }))}
              className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                settings.invertRoll ? 'border-neon-magenta bg-neon-magenta/10 text-white' : 'border-slate-800 bg-black/40 text-slate-400'
              }`}
            >
              <span>INVERT ROLL:</span>
              <span className="font-bold">{settings.invertRoll ? "YES" : "NO"}</span>
            </button>
          </div>

          {/* Sensitivity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">PITCH/ROLL SENSITIVITY:</span>
              <span className="text-neon-cyan font-bold">{settings.sensitivity.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.5" 
              step="0.1" 
              value={settings.sensitivity} 
              onChange={(e) => setSettings(prev => ({ ...prev, sensitivity: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 accent-neon-cyan rounded cursor-pointer"
            />
          </div>

          {/* Deadzone Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">CENTER DEADZONE:</span>
              <span className="text-neon-magenta font-bold">{settings.deadzone}&deg;</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="1" 
              value={settings.deadzone} 
              onChange={(e) => setSettings(prev => ({ ...prev, deadzone: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 accent-neon-magenta rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Desktop Keyboard Cheat Sheet */}
        <div className="p-3 rounded-xl bg-black/50 border border-slate-900 space-y-1.5 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <Keyboard size={12} className="text-blue-400" />
            <span>DESKTOP KEYBOARD HOTKEYS</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
            <div><kbd className="px-1 py-0.5 rounded bg-slate-800 text-white">W / S</kbd> Throttle +/-</div>
            <div><kbd className="px-1 py-0.5 rounded bg-slate-800 text-white">SPACE</kbd> Primary Fire</div>
            <div><kbd className="px-1 py-0.5 rounded bg-slate-800 text-white">SHIFT</kbd> Overdrive Boost</div>
            <div><kbd className="px-1 py-0.5 rounded bg-slate-800 text-white">T</kbd> Tare Horizon</div>
          </div>
        </div>

        {/* Save & Close Button */}
        <Button
          onClick={onClose}
          variant="cyan"
          className="w-full h-9 text-xs font-bold"
        >
          CONFIRM AVIONICS SETTINGS
        </Button>
      </div>
    </div>
  );
};
