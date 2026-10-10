import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Sparkles, Activity, Layers, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameItem {
  id: string;
  title: string;
  type: 'Web F2P' | 'Mobile F2P' | 'AAA Premium';
  status: string;
  iconSrc: string;
  conceptArt: string;
  conceptBadge?: string;
  tagline: string;
  description: string;
  badges: string[];
  specs: { label: string; value: string }[];
  themeColor: string;
  borderColor: string;
  glowColor: string;
  badgeVariant: 'cyan' | 'magenta' | 'cobalt';
  buttonVariant: 'cyan' | 'magenta' | 'cobalt';
  palette: { name: string; hex: string; bg: string }[];
  details: string;
  actionText: string;
  actionHref?: string;
}

export default function Games() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const games: GameItem[] = [
    {
      id: 'astro-smash',
      title: "Astro-Smash: Arena",
      type: "Web F2P",
      status: "Live Alpha (Playable)",
      iconSrc: "/tachyon_icon_web.svg",
      conceptArt: "/tachyon_concept_arena.png",
      conceptBadge: "/tachyon_ball_concept.svg",
      tagline: "3v3 Aerodynamic Sports Brawler",
      description: "Zero-download multiplayer sports combat running locked at 60Hz in your browser. Master the aerodynamic hover flight, turbo afterburner boosts, kinetic shunt pulses, and Mobile HOTAS companion pairing.",
      badges: ["Babylon.js 3D", "WebRTC HOTAS", "Procedural SFX", "Deterministic 60Hz"],
      specs: [
        { label: "Target Platform", value: "Any Modern Browser (WebGL 2.0 / WebGPU)" },
        { label: "Network Protocol", value: "16-Byte Packed Binary via RTCDataChannel" },
        { label: "Controls", value: "Keyboard/Mouse, Gamepad & Mobile HOTAS" }
      ],
      themeColor: "text-neon-cyan",
      borderColor: "border-neon-cyan/40 hover:border-neon-cyan",
      glowColor: "shadow-[0_0_30px_rgba(0,243,255,0.15)] hover:shadow-[0_0_40px_rgba(0,243,255,0.35)]",
      badgeVariant: "cyan",
      buttonVariant: "cyan",
      palette: [
        { name: "Aero Cyan", hex: "#00F3FF", bg: "bg-[#00F3FF]" },
        { name: "Velocity Mint", hex: "#00FFB2", bg: "bg-[#00FFB2]" },
        { name: "Deep Ion Blue", hex: "#0055FF", bg: "bg-[#0055FF]" }
      ],
      details: "Powered by Babylon.js with deterministic hover aerodynamics and zero-friction Cloudflare Workers edge distribution.",
      actionText: "Enter Arena (Play Live)",
      actionHref: "/arena"
    },
    {
      id: 'tachyon-strike',
      title: "Tachyon: Strike",
      type: "Web F2P",
      status: "CQB Alpha (Playable)",
      iconSrc: "/tachyon_icon_web.svg",
      conceptArt: "/tachyon_concept_arena.png",
      tagline: "Ultra-Realistic 3D CQB Shooter",
      description: "High-fidelity tactical first-person combat running directly in the browser. Features procedural weapon sway & recoil, physical ADS alignment, reactive steel poppers, PEQ-15 tactical laser sight, and Gen-3 Night Vision / FLIR thermal optics.",
      badges: ["Babylon.js PBR", "Procedural Kinematics", "Physical Ballistics", "Night Vision / FLIR"],
      specs: [
        { label: "Target Platform", value: "Any Modern Browser (WebGL 2.0 / WebGPU)" },
        { label: "Optics Engine", value: "Procedural ADS + Gen-3 NVG + FLIR Thermal" },
        { label: "Weapon System", value: "Suppressed 5.56x45mm + PEQ-15 Laser" }
      ],
      themeColor: "text-emerald-400",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      glowColor: "shadow-[0_0_30px_rgba(16,255,120,0.15)] hover:shadow-[0_0_40px_rgba(16,255,120,0.35)]",
      badgeVariant: "cyan",
      buttonVariant: "cyan",
      palette: [
        { name: "Phosphor NVG", hex: "#00FF66", bg: "bg-[#00FF66]" },
        { name: "Thermal FLIR", hex: "#FF8800", bg: "bg-[#FF8800]" },
        { name: "Gunmetal", hex: "#1E2228", bg: "bg-[#1E2228]" }
      ],
      details: "Rendered via Babylon.js PBR materials with ACES Filmic tone mapping, Screen-Space Post-Processing, dynamic muzzle lighting, and reactive hitboxes.",
      actionText: "Deploy Strike (Play Live)",
      actionHref: "/strike"
    },
    {
      id: 'orbit-runner',
      title: "Orbit Runner: Gyro Dash",
      type: "Mobile F2P",
      status: "In Development",
      iconSrc: "/tachyon_icon_mobile.svg",
      conceptArt: "/tachyon_drone_concept.svg",
      tagline: "6-DOF Endless Vertical Flight",
      description: "Visceral mobile obstacle dodger powered by physical phone gyroscope sensor fusion and 1-tap Tare Horizon calibration. Features haptic vibration impulses and daily drop reward caches.",
      badges: ["Godot Mobile", "Sensor Fusion", "Haptic Feedback", "Tare Calibration"],
      specs: [
        { label: "Target Platform", value: "iOS & Android (PWA / Native)" },
        { label: "Input Engine", value: "Gyroscope + Tare Zero-Pitch Button" },
        { label: "Haptic System", value: "Device Vibration API (Impact Impulses)" }
      ],
      themeColor: "text-neon-magenta",
      borderColor: "border-neon-magenta/40 hover:border-neon-magenta",
      glowColor: "shadow-[0_0_30px_rgba(255,0,255,0.15)] hover:shadow-[0_0_40px_rgba(255,0,255,0.35)]",
      badgeVariant: "magenta",
      buttonVariant: "magenta",
      palette: [
        { name: "Pulse Magenta", hex: "#FF00FF", bg: "bg-[#FF00FF]" },
        { name: "Ultraviolet", hex: "#9D00FF", bg: "bg-[#9D00FF]" },
        { name: "Neon Coral", hex: "#FF3366", bg: "bg-[#FF3366]" }
      ],
      details: "Syncs directly with your web browser session using our HOTAS PWA link, turning any mobile device into a physical flight controller.",
      actionText: "Open HOTAS Controller",
      actionHref: "/controller"
    },
    {
      id: 'vanguard',
      title: "Vanguard: The Outer War",
      type: "AAA Premium",
      status: "In Design",
      iconSrc: "/tachyon_icon_aaa.svg",
      conceptArt: "/tachyon_fighter_concept.svg",
      tagline: "Cinematic 32v32 Tactical Space Combat",
      description: "Next-gen tactical aerospace simulator built with Unreal Engine 5 Nanite & Lumen. Features mechanical CAD-lofted airframes, LCOS lead reticle fire control, and Founder cross-game prestige rewards.",
      badges: ["Unreal Engine 5", "CAD Pipeline", "Cross-Game Auth", "LCOS Fire Control"],
      specs: [
        { label: "Target Platform", value: "PC (Steam) & Next-Gen Consoles" },
        { label: "Rendering Core", value: "Nanite Geometry & Lumen Global Illum" },
        { label: "Flight Dynamics", value: "Full 6-DOF Newtonian Inertial Spacecraft" }
      ],
      themeColor: "text-blue-400",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      glowColor: "shadow-[0_0_30px_rgba(0,85,255,0.2)] hover:shadow-[0_0_40px_rgba(0,85,255,0.4)]",
      badgeVariant: "cobalt",
      buttonVariant: "cobalt",
      palette: [
        { name: "Tactical Cobalt", hex: "#0055FF", bg: "bg-[#0055FF]" },
        { name: "Solar Amber", hex: "#FFB800", bg: "bg-[#FFB800]" },
        { name: "Titanium Ice", hex: "#D0E4FF", bg: "bg-[#D0E4FF]" }
      ],
      details: "Founder tier pilots unlock shared cross-game cosmetics, exclusive diamond yield multipliers, and persistent military battle records.",
      actionText: "Read Design Dossier",
      actionHref: "/press"
    }
  ];

  const filteredGames = games.filter(game => {
    if (activeTab === 'all') return true;
    if (activeTab === 'web') return game.type === 'Web F2P';
    if (activeTab === 'mobile') return game.type === 'Mobile F2P';
    if (activeTab === 'aaa') return game.type === 'AAA Premium';
    return true;
  });

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[350px] bg-neon-magenta/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-10 border-b border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
            UNIFIED ECOSYSTEM // SEPARATE VISUAL IDENTITIES
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Activity size={14} className="text-neon-cyan" />
            <span>Cross-Progression Auth: <strong className="text-neon-cyan">Supabase Connected</strong></span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          The <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Tachyon Trilogy</span>
        </h1>
        <p className="text-slate-400 max-w-3xl text-base sm:text-lg font-light leading-relaxed">
          Three distinct games sharing a common Obsidian foundation and a unified player profile, each engineered with a unique color personality, custom concept mechanics, and zero-compromise netcode.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All Titles</TabsTrigger>
            <TabsTrigger value="web">Web F2P</TabsTrigger>
            <TabsTrigger value="mobile">Mobile F2P</TabsTrigger>
            <TabsTrigger value="aaa">AAA Premium</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredGames.map((game) => (
          <Card 
            key={game.id} 
            className={`border ${game.borderColor} ${game.glowColor} flex flex-col justify-between group overflow-hidden bg-slate-950/70 backdrop-blur-md hover:-translate-y-1.5 transition-all duration-300`}
          >
            {/* Visual Concept Art Showcase Banner */}
            <div className="relative w-full h-52 bg-black/80 overflow-hidden border-b border-slate-800/80 flex items-center justify-center p-4">
              {/* Radial gradient background */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
              
              <img 
                src={game.conceptArt} 
                alt={`${game.title} Concept Visual`} 
                className="max-h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105 z-0 drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
              />

              {game.conceptBadge && (
                <div className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-black/70 border border-slate-700/80 backdrop-blur-sm" title="Magnus Aerodynamic Core">
                  <img src={game.conceptBadge} alt="Core" className="w-6 h-6 animate-spin-slow" />
                </div>
              )}

              {/* Status pill on image */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-slate-700/60 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                {game.status}
              </div>
            </div>

            {/* Card Header */}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-black/60 rounded-xl border border-slate-800/80">
                  <img src={game.iconSrc} alt={`${game.title} Icon`} className="w-8 h-8" />
                </div>
                <Badge variant={game.badgeVariant}>
                  {game.type}
                </Badge>
              </div>

              <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${game.themeColor} block`}>
                {game.tagline}
              </span>
              <CardTitle className="text-2xl pt-1">
                {game.title}
              </CardTitle>
              <CardDescription className="pt-2">
                {game.description}
              </CardDescription>
            </CardHeader>

            {/* Card Content: Specs & Color Palette */}
            <CardContent className="space-y-4 pt-1">
              {/* Technical Specifications */}
              <div className="space-y-1.5 bg-black/40 rounded-xl p-3 border border-slate-800/80 text-xs font-mono">
                {game.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{spec.label}:</span>
                    <span className="text-slate-200 font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Distinct Color Palette Bar */}
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-1.5">
                  Signature Color Architecture:
                </span>
                <div className="flex items-center gap-2">
                  {game.palette.map((color, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bg} shadow-sm`} />
                      <span className="text-[10px] text-slate-300">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {game.badges.map(badge => (
                  <span key={badge} className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 text-slate-300 text-[10px] font-mono rounded">
                    {badge}
                  </span>
                ))}
              </div>
            </CardContent>

            {/* Card Footer with CTA */}
            <CardFooter className="pt-4 flex items-center justify-between">
              {game.actionHref?.startsWith('/') ? (
                <Link to={game.actionHref} className="w-full">
                  <Button variant={game.buttonVariant} className="w-full">
                    {game.actionText}
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant={game.buttonVariant} 
                  className="w-full"
                  onClick={() => alert(`${game.title} is currently in deterministic closed testnet.`)}
                >
                  <span>{game.actionText}</span>
                  <ExternalLink size={14} className="ml-1 opacity-70" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Cross-Game Architecture Infographic / Foundation Card */}
      <div className="mt-14 p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-black/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 mt-0.5">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Zero-Friction Link</h4>
              <p className="text-slate-400 leading-relaxed font-light">
                WebRTC DataChannels carry 16-byte packed state deltas directly between clients and edge orchestrators with &lt;15ms latency.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30 mt-0.5">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Cross-Game Progression</h4>
              <p className="text-slate-400 leading-relaxed font-light">
                One universal Supabase authentication clears you for Web, Mobile, and AAA titles. Daily diamond caches translate into cross-game cosmetic unlocks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">United Substrate</h4>
              <p className="text-slate-400 leading-relaxed font-light">
                Unified Void Obsidian (<code className="text-neon-cyan font-mono">#121212</code>) dark foundation and crisp vector reticles link every cockpit and arena HUD.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Substrate Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">United Color Substrate:</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-black border border-slate-700 text-white text-[10px]">#121212 Void Obsidian</span>
              <span className="px-2 py-0.5 rounded bg-black border border-slate-700 text-white text-[10px]">#FFFFFF Fusion White</span>
            </div>
          </div>

          <Link to="/tech">
            <Button variant="outline" size="sm" className="text-xs">
              <Sparkles size={13} className="text-neon-cyan mr-1.5" />
              Explore Netcode & Physics Architecture
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
