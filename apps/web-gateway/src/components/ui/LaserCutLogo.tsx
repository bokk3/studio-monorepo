import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface LaserCutLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  enableAudioByDefault?: boolean;
}

interface DustParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  driftX: number;
  fallDist: number;
  duration: number;
  delay: number;
  color: string;
  glow: string;
  opacity: number;
}

export const LaserCutLogo: React.FC<LaserCutLogoProps> = ({
  src = "/tachyon_website_branding.png",
  alt = "Tachyon Game Studio",
  className = "",
  enableAudioByDefault = false
}) => {
  // Animation Lifecycle Phases: 'cutting' -> 'flash' -> 'settle' -> 'idle'
  const [phase, setPhase] = useState<'cutting' | 'flash' | 'settle' | 'idle'>('cutting');
  const [cutProgress, setCutProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(enableAudioByDefault);
  const [shineKey, setShineKey] = useState(0);
  const [cutIteration, setCutIteration] = useState(0);
  const [dustKey, setDustKey] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const shineIntervalRef = useRef<any>(null);

  // Generate 36 atmospheric dust & laser debris particles
  const dustParticles = useMemo<DustParticle[]>(() => {
    const colors = ['#00F3FF', '#FFB800', '#FF00FF', '#FFFFFF', '#FF6600', '#00FFB2'];
    return Array.from({ length: 36 }).map((_, i) => {
      const color = colors[i % colors.length];
      return {
        id: i,
        left: 6 + Math.random() * 88,
        top: 15 + Math.random() * 65,
        size: 1 + Math.random() * 2.5,
        driftX: (Math.random() - 0.5) * 60,
        fallDist: 45 + Math.random() * 85,
        duration: 3.2 + Math.random() * 2.2,
        delay: Math.random() * 0.9,
        color,
        glow: color === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : color,
        opacity: 0.5 + Math.random() * 0.45
      };
    });
  }, [dustKey]);

  // Procedural Web Audio: Synthesized "shwoooooomph" sweep
  const playShwoomphAudio = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Deep Sub-bass Woosh (Low-frequency surge)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.35);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.9);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.25, now + 0.35);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.95);

      // 2. Resonant Filtered Noise Whoosh (Aerodynamic wind / energy sweep)
      const bufferSize = Math.floor(ctx.sampleRate * 0.9);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.5, now);
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.85);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.85);

      // 3. Crystalline High Sheen Shimmer (Prismatic light flare chime)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(1650, now + 0.28);
      chimeOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.45);
      chimeOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.7);

      chimeGain.gain.setValueAtTime(0.001, now + 0.28);
      chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.38);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.28);
      chimeOsc.stop(now + 0.75);
    } catch {}
  };

  // Play thermal flash pop & cooldown sizzle
  const playFlashPop = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // Snap pop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(950, now);
      popOsc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
      popGain.gain.setValueAtTime(0.15, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.2);

      // Dissipating thermal hiss
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2800, now);

      const hissGain = ctx.createGain();
      hissGain.gain.setValueAtTime(0.06, now);
      hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(hissGain);
      hissGain.connect(ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.4);
    } catch {}
  };

  // Laser cut sound during initial cut
  const playLaserCutSound = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 1.2);
      osc.frequency.linearRampToValueAtTime(620, now + 2.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      gain.gain.setValueAtTime(0.04, now + 2.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.5);
    } catch {}
  };

  // Phase Orchestration Sequence:
  // 1. 'cutting' (0 - 2.4s): laser path traces
  // 2. 'flash' (2.4s - 2.7s): bright thermal flash & pop
  // 3. 'settle' (2.7s - 5.5s): motion slows down, thermal seam cools, dust slowly settles
  // 4. 'idle' (5.5s+): loops 5-second 'shwoooooomph' shine
  useEffect(() => {
    setPhase('cutting');
    setCutProgress(0);
    playLaserCutSound();

    const startTime = performance.now();
    const duration = 2400; // 2.4 seconds cut time

    let animFrame: number;
    const animateCut = (time: number) => {
      const elapsed = time - startTime;
      const p = Math.min(1, elapsed / duration);
      setCutProgress(p);

      if (p < 1) {
        animFrame = requestAnimationFrame(animateCut);
      } else {
        // Complete cut -> Flash stage
        setPhase('flash');
        playFlashPop();

        // After flash (300ms), transition into the gentle deceleration & dust settling stage!
        setTimeout(() => {
          setPhase('settle');
          setDustKey(k => k + 1);

          // Settle phase runs for 3.0 seconds, then enters idle loop
          setTimeout(() => {
            setPhase('idle');
          }, 3000);
        }, 300);
      }
    };

    animFrame = requestAnimationFrame(animateCut);

    return () => cancelAnimationFrame(animFrame);
  }, [cutIteration]);

  // Recurring 5-second "shwoooooomph" shine loop
  useEffect(() => {
    shineIntervalRef.current = setInterval(() => {
      setShineKey(prev => prev + 1);
      setDustKey(prev => prev + 1); // Disperse fresh wave of luminous micro-dust!
      playShwoomphAudio();
    }, 5000);

    return () => {
      if (shineIntervalRef.current) clearInterval(shineIntervalRef.current);
    };
  }, [audioEnabled]);

  const handleReplayCut = () => {
    setCutIteration(prev => prev + 1);
  };

  // Calculate laser cutter head coordinates along faceted border (1000 x 560 aspect)
  const getLaserHeadPosition = (p: number) => {
    const points = [
      { x: 60, y: 20 },
      { x: 940, y: 20 },
      { x: 980, y: 60 },
      { x: 980, y: 500 },
      { x: 940, y: 540 },
      { x: 60, y: 540 },
      { x: 20, y: 500 },
      { x: 20, y: 60 },
      { x: 60, y: 20 }
    ];

    const segmentLengths = [];
    let totalLen = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segmentLengths.push(len);
      totalLen += len;
    }

    const targetDist = p * totalLen;
    let accumulated = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      if (accumulated + segmentLengths[i] >= targetDist) {
        const segProgress = (targetDist - accumulated) / segmentLengths[i];
        return {
          x: points[i].x + (points[i + 1].x - points[i].x) * segProgress,
          y: points[i].y + (points[i + 1].y - points[i].y) * segProgress
        };
      }
      accumulated += segmentLengths[i];
    }

    return points[points.length - 1];
  };

  const laserHead = getLaserHeadPosition(cutProgress);

  return (
    <div className={`relative flex items-center justify-center select-none group ${className}`}>
      {/* Outer Glow Aura Backdrop */}
      <div 
        key={`glow-${shineKey}`} 
        className="absolute inset-0 rounded-3xl bg-neon-cyan/15 blur-[60px] pointer-events-none transition-all duration-700 -z-10 animate-shwoomph-pulse" 
      />

      {/* Main Logo Container with Post-Flash Deceleration */}
      <div 
        className={`relative w-full max-w-[640px] flex items-center justify-center p-2 rounded-2xl overflow-hidden ${
          phase === 'settle' ? 'animate-logo-decelerate' : ''
        }`}
      >
        {/* The Exact Logo Artwork (Kept 100% Unaltered) */}
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-auto object-contain transition-all duration-700 drop-shadow-[0_0_35px_rgba(0,243,255,0.25)] ${
            phase === 'cutting' 
              ? 'brightness-90 contrast-125' 
              : phase === 'flash'
              ? 'brightness-200 contrast-150 drop-shadow-[0_0_60px_rgba(255,255,255,0.9)]'
              : 'hover:drop-shadow-[0_0_50px_rgba(0,243,255,0.5)]'
          }`}
          style={{
            // Reveal progressively during cut
            clipPath: phase === 'cutting' 
              ? `polygon(0% 0%, 100% 0%, 100% ${Math.max(10, cutProgress * 110)}%, 0% ${Math.max(10, cutProgress * 110)}%)` 
              : 'none'
          }}
        />

        {/* ============================================================== */}
        {/* STAGE 1: LASER CUT OVERLAY (Line trace & high-energy sparks)    */}
        {/* ============================================================== */}
        {phase === 'cutting' && (
          <svg 
            viewBox="0 0 1000 560" 
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          >
            <defs>
              <filter id="laser-flame" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Cut Seam Path */}
            <path 
              d="M 60 20 L 940 20 L 980 60 L 980 500 L 940 540 L 60 540 L 20 500 L 20 60 Z"
              fill="none"
              stroke="#00F3FF"
              strokeWidth="3.5"
              strokeDasharray="2900"
              strokeDashoffset={2900 * (1 - cutProgress)}
              filter="url(#laser-flame)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White-Hot Core Line */}
            <path 
              d="M 60 20 L 940 20 L 980 60 L 980 500 L 940 540 L 60 540 L 20 500 L 20 60 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="2900"
              strokeDashoffset={2900 * (1 - cutProgress)}
              strokeLinecap="round"
            />

            {/* Glowing Laser Cutting Head (Torch) */}
            <g transform={`translate(${laserHead.x}, ${laserHead.y})`}>
              <circle cx="0" cy="0" r="18" fill="rgba(0, 243, 255, 0.45)" filter="url(#laser-flame)" />
              <circle cx="0" cy="0" r="8" fill="#FF00FF" />
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />

              {/* Sparks emitting from torch */}
              <line x1="0" y1="0" x2="-14" y2="-12" stroke="#FFB800" strokeWidth="2" opacity="0.9" strokeLinecap="round" />
              <line x1="0" y1="0" x2="16" y2="-15" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.95" strokeLinecap="round" />
              <line x1="0" y1="0" x2="-8" y2="18" stroke="#00F3FF" strokeWidth="2.2" opacity="0.85" strokeLinecap="round" />
              <line x1="0" y1="0" x2="14" y2="14" stroke="#FF007F" strokeWidth="1.8" opacity="0.9" strokeLinecap="round" />
              <line x1="0" y1="0" x2="-18" y2="4" stroke="#FFB800" strokeWidth="1.5" opacity="0.75" strokeLinecap="round" />
            </g>
          </svg>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: THERMAL FLASH & SLOW COOLDOWN SEAM                     */}
        {/* ============================================================== */}
        {phase === 'flash' && (
          <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px] pointer-events-none z-40 animate-pulse transition-opacity duration-300" />
        )}

        {phase === 'settle' && (
          <svg 
            viewBox="0 0 1000 560" 
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          >
            {/* The incandescent seam gradually cools down from white-amber to neon to dark */}
            <path 
              d="M 60 20 L 940 20 L 980 60 L 980 500 L 940 540 L 60 540 L 20 500 L 20 60 Z"
              fill="none"
              strokeWidth="2.5"
              className="animate-thermal-cool"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* ============================================================== */}
        {/* STAGE 3: GLOWING DUST & EMBERS SETTLING SLOWLY                 */}
        {/* ============================================================== */}
        {(phase === 'settle' || phase === 'idle') && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {dustParticles.map((p) => (
              <div
                key={`dust-${dustKey}-${p.id}`}
                className="absolute rounded-full animate-dust-settle pointer-events-none"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 3}px ${p.glow}`,
                  '--drift-x': `${p.driftX}px`,
                  '--fall-dist': `${p.fallDist}px`,
                  '--dust-duration': `${p.duration}s`,
                  '--dust-max-opacity': p.opacity,
                  animationDelay: `${p.delay}s`
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 4: 5-SECOND RECURRING "SHWOOOOOOMPH" SHINE SWEEP          */}
        {/* ============================================================== */}
        {phase === 'idle' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
            {/* Luminous Specular Sheen Beam Sweeping Across Logo Every 5s */}
            <div 
              key={`sheen-${shineKey}`}
              className="absolute inset-0 w-[200%] h-full -top-0 -left-[100%] animate-shwoomph-beam"
              style={{
                background: 'linear-gradient(115deg, transparent 32%, rgba(0,243,255,0.08) 42%, rgba(255,255,255,0.85) 50%, rgba(255,0,255,0.25) 58%, transparent 68%)',
                mixBlendMode: 'color-dodge'
              }}
            />

            {/* Central Expanding Concentric Shockwave ("Shwoooooomph" Pulse) */}
            <div 
              key={`shockwave-${shineKey}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-neon-cyan/80 animate-shwoomph-shockwave pointer-events-none"
            />

            {/* Center Diamond Lens Flare Starburst */}
            <div 
              key={`flare-${shineKey}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-shwoomph-flare pointer-events-none flex items-center justify-center"
            >
              <div className="w-1.5 h-16 bg-white blur-[1px] rotate-45" />
              <div className="w-1.5 h-16 bg-neon-cyan blur-[1px] -rotate-45 absolute" />
              <div className="w-6 h-6 rounded-full bg-white blur-sm absolute" />
            </div>
          </div>
        )}

        {/* Interactive Controls Overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-40 opacity-70 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-800 text-[10px] font-mono">
          <button
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              if (next) playShwoomphAudio();
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-neon-cyan transition-colors"
            title={audioEnabled ? "Mute 'Shwoomph' SFX" : "Enable 'Shwoomph' SFX (Web Audio)"}
          >
            {audioEnabled ? <Volume2 size={12} className="text-neon-cyan" /> : <VolumeX size={12} />}
            <span>{audioEnabled ? "SFX ON" : "SFX"}</span>
          </button>

          <span className="text-slate-700">|</span>

          <button
            onClick={handleReplayCut}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Replay Laser Cut Animation"
          >
            <RotateCcw size={11} className={phase === 'cutting' ? "animate-spin text-neon-cyan" : ""} />
            <span>CUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
