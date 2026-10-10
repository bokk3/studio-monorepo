import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Smartphone, 
  Settings, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Radio
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThrottleQuadrant } from '@/components/hotas/ThrottleQuadrant';
import { AttitudeHorizon } from '@/components/hotas/AttitudeHorizon';
import { FireControl } from '@/components/hotas/FireControl';
import { HotasTelemetry } from '@/components/hotas/HotasTelemetry';
import { HotasSettingsModal, type HotasSettings } from '@/components/hotas/HotasSettingsModal';
import { hotasAudio } from '@/components/hotas/hotasAudio';

export default function Controller() {
  // Flight Dynamics State
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [throttle, setThrottle] = useState(50);
  const [boostActive, setBoostActive] = useState(false);
  const [rcsState, setRcsState] = useState({ up: false, down: false, left: false, right: false });

  // Tare / Zero-Lock Calibration Offsets
  const [tarePitch, setTarePitch] = useState(0);
  const [tareRoll, setTareRoll] = useState(0);
  const [tareYaw, setTareYaw] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);

  // Combat State
  const [heatLevel, setHeatLevel] = useState(10);
  const [shotsFired, setShotsFired] = useState(0);

  // Networking & Telemetry State
  const [roomCode, setRoomCode] = useState("TACHYON-7492");
  const [isConnected, setIsConnected] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const [packetHz, setPacketHz] = useState(60);
  const [latencyMs] = useState(2);
  const [rawFrameHex, setRawFrameHex] = useState("");

  // Settings & Avionics Modal
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<HotasSettings>({
    invertPitch: false,
    invertRoll: false,
    sensitivity: 1.0,
    deadzone: 1,
    smoothing: 0.8,
    isMuted: false,
    wakeLockActive: false
  });

  const wakeLockRef = useRef<any>(null);
  const seqNumRef = useRef<number>(0);
  const packetsLastSec = useRef<number>(0);
  const lastSecTime = useRef<number>(performance.now());
  const fireActiveRef = useRef<boolean>(false);

  // 16-Byte Send Buffer
  const sendBuffer = useRef(new ArrayBuffer(16));
  const floatView = useRef(new Float32Array(sendBuffer.current));
  const uint8View = useRef(new Uint8Array(sendBuffer.current));
  const uint16View = useRef(new Uint16Array(sendBuffer.current));

  // Gyro smoothing refs
  const smoothedPitch = useRef(0);
  const smoothedRoll = useRef(0);

  // Hardware Gyroscope Integration
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setHasGyro(true);

        // Raw angles relative to tare
        let rawP = (e.beta || 0) - tarePitch;
        let rawR = (e.gamma || 0) - tareRoll;
        let rawY = (e.alpha || 0) - tareYaw;

        // Apply deadzone
        if (Math.abs(rawP) < settings.deadzone) rawP = 0;
        if (Math.abs(rawR) < settings.deadzone) rawR = 0;

        // Apply sensitivity & inversion
        if (settings.invertPitch) rawP = -rawP;
        if (settings.invertRoll) rawR = -rawR;
        rawP *= settings.sensitivity;
        rawR *= settings.sensitivity;

        // Clamping to standard cockpit attitude limits (-60 to +60)
        rawP = Math.max(-60, Math.min(60, rawP));
        rawR = Math.max(-60, Math.min(60, rawR));

        // Low-pass exponential smoothing
        smoothedPitch.current = smoothedPitch.current * (1 - settings.smoothing) + rawP * settings.smoothing;
        smoothedRoll.current = smoothedRoll.current * (1 - settings.smoothing) + rawR * settings.smoothing;

        setPitch(Number(smoothedPitch.current.toFixed(1)));
        setRoll(Number(smoothedRoll.current.toFixed(1)));
        setYaw(Number(rawY.toFixed(1)));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [tarePitch, tareRoll, tareYaw, settings]);

  // Zero-Lock Horizon Tare
  const handleTare = useCallback(() => {
    setTarePitch(prev => prev + pitch);
    setTareRoll(prev => prev + roll);
    setTareYaw(prev => prev + yaw);
  }, [pitch, roll, yaw]);

  // Request Gyroscope permission (iOS 13+)
  const requestGyroPermission = () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((res: string) => {
          if (res === 'granted') {
            setHasGyro(true);
            hotasAudio.playTareChime();
          }
        })
        .catch(console.error);
    }
  };

  // Fullscreen & Orientation Lock
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      try {
        if ('orientation' in screen && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch {}
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Screen Wake-Lock API
  const toggleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (!wakeLockRef.current) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          setSettings(prev => ({ ...prev, wakeLockActive: true }));
        } else {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          setSettings(prev => ({ ...prev, wakeLockActive: false }));
        }
      } catch {
        setSettings(prev => ({ ...prev, wakeLockActive: false }));
      }
    }
  };

  // High-frequency 60Hz Telemetry Binary Pack loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Pack 16-Byte Binary Frame
      // Byte 0-3: Pitch (Float32)
      floatView.current[0] = pitch;
      // Byte 4-7: Roll (Float32)
      floatView.current[1] = roll;
      // Byte 8-11: Throttle (Float32)
      floatView.current[2] = boostActive ? 100 : throttle;

      // Byte 12: Bitmask for buttons
      let bitmask = 0;
      if (fireActiveRef.current) bitmask |= (1 << 0);
      if (boostActive) bitmask |= (1 << 1);
      if (rcsState.up) bitmask |= (1 << 2);
      if (rcsState.down) bitmask |= (1 << 3);
      if (rcsState.left) bitmask |= (1 << 4);
      if (rcsState.right) bitmask |= (1 << 5);
      uint8View.current[12] = bitmask;

      // Byte 13: Power Mode (0: Standard, 1: Overdrive)
      uint8View.current[13] = boostActive ? 1 : 0;

      // Bytes 14-15: Sequence Number (Uint16)
      seqNumRef.current = (seqNumRef.current + 1) % 65536;
      uint16View.current[7] = seqNumRef.current;

      setPacketCount(seqNumRef.current);

      // Convert buffer to hex preview string
      const hexParts: string[] = [];
      const u8 = uint8View.current;
      for (let i = 0; i < 16; i++) {
        hexParts.push(u8[i].toString(16).padStart(2, '0').toUpperCase());
      }
      setRawFrameHex(hexParts.join(' '));

      // Calculate real Hz
      packetsLastSec.current++;
      const now = performance.now();
      if (now - lastSecTime.current >= 1000) {
        setPacketHz(packetsLastSec.current);
        packetsLastSec.current = 0;
        lastSecTime.current = now;
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [pitch, roll, throttle, boostActive, rcsState]);

  // Desktop Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'w' || e.key === 'W') {
        setThrottle(prev => Math.min(100, prev + 5));
      } else if (e.key === 's' || e.key === 'S') {
        setThrottle(prev => Math.max(0, prev - 5));
      } else if (e.key === ' ') {
        fireActiveRef.current = true;
        setShotsFired(prev => prev + 1);
        setHeatLevel(prev => Math.min(100, prev + 10));
        hotasAudio.playKineticShot();
      } else if (e.key === 'Shift') {
        setBoostActive(true);
      } else if (e.key === 't' || e.key === 'T') {
        handleTare();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') fireActiveRef.current = false;
      if (e.key === 'Shift') setBoostActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTare]);

  // Dynamic G-Force calculation
  const gForce = 1.0 + Math.abs(pitch) * 0.04 + (boostActive ? 1.8 : 0);

  return (
    <div className="min-h-screen p-2 sm:p-5 max-w-[1600px] mx-auto flex flex-col justify-between select-none touch-none bg-obsidian text-white">
      {/* Top Cockpit Telemetry Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-2 mb-3 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shadow-[0_0_12px_rgba(0,243,255,0.25)]">
            <Smartphone size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-widest text-neon-cyan uppercase font-bold">
                TACHYON MOBILE HOTAS
              </span>
              <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-neon-cyan/30 text-neon-cyan">
                REV 2.0
              </Badge>
            </div>
            <span className="text-[11px] font-bold text-white block">
              6-DOF Tactical Flight Companion
            </span>
          </div>
        </div>

        {/* Action Controls: Sound, Fullscreen, Settings */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={hasGyro ? "default" : "secondary"}
            className="hidden sm:inline-flex text-[10px] font-mono gap-1"
          >
            <Radio size={11} className={hasGyro ? "text-neon-cyan animate-pulse" : "text-amber-400"} />
            {hasGyro ? "GYRO 6-DOF ONLINE" : "DESKTOP SIMULATOR"}
          </Badge>

          {!hasGyro && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && (
            <Button 
              size="sm" 
              onClick={requestGyroPermission}
              className="h-8 px-2 text-xs bg-neon-cyan text-black font-bold"
            >
              Enable Gyro
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const nextMuted = !settings.isMuted;
              setSettings(prev => ({ ...prev, isMuted: nextMuted }));
              hotasAudio.setMuted(nextMuted);
              if (!nextMuted) hotasAudio.playTareChime();
            }}
            className="h-8 w-8 p-0 border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Web Audio SFX"
          >
            {settings.isMuted ? <VolumeX size={15} className="text-slate-500" /> : <Volume2 size={15} className="text-neon-cyan" />}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={15} />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSettings(true)}
            className="h-8 px-2.5 gap-1.5 border-slate-800 text-slate-300 hover:text-white font-mono text-xs"
          >
            <Settings size={14} className="text-neon-cyan" />
            <span className="hidden sm:inline">Avionics</span>
          </Button>
        </div>
      </div>

      {/* Main Ergonomic Triple-Quadrant Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1">
        {/* Left Quadrant: Throttle & RCS (Col-Span 3) */}
        <div className="lg:col-span-3 h-full">
          <ThrottleQuadrant
            throttle={throttle}
            setThrottle={setThrottle}
            boostActive={boostActive}
            setBoostActive={setBoostActive}
            rcsState={rcsState}
            setRcsState={setRcsState}
          />
        </div>

        {/* Center Quadrant: Primary Flight Display / ADI (Col-Span 5) */}
        <div className="lg:col-span-5 h-full">
          <AttitudeHorizon
            pitch={pitch}
            roll={roll}
            yaw={yaw}
            hasGyro={hasGyro}
            onTare={handleTare}
            gForce={gForce}
            setPitch={setPitch}
            setRoll={setRoll}
          />
        </div>

        {/* Right Quadrant: Fire Control & Combat Actuators (Col-Span 4) */}
        <div className="lg:col-span-4 h-full">
          <FireControl
            onFire={() => {
              setShotsFired(prev => prev + 1);
            }}
            onMissileLaunch={() => {
              setShotsFired(prev => prev + 1);
              setHeatLevel(prev => Math.min(100, prev + 25));
            }}
            onCountermeasure={() => {}}
            heatLevel={heatLevel}
            setHeatLevel={setHeatLevel}
            shotsFired={shotsFired}
          />
        </div>
      </div>

      {/* Bottom WebRTC Telemetry Bar */}
      <div className="mt-3">
        <HotasTelemetry
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          isConnected={isConnected}
          packetCount={packetCount}
          packetHz={packetHz}
          latencyMs={latencyMs}
          rawFrameBytes={rawFrameHex}
          onConnect={() => {
            setIsConnected(!isConnected);
            hotasAudio.playTareChime();
          }}
        />
      </div>

      {/* Calibration & Avionics Settings Modal */}
      <HotasSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        setSettings={setSettings}
        onToggleFullscreen={toggleFullscreen}
        onToggleWakeLock={toggleWakeLock}
      />
    </div>
  );
}
