import { 
  Zap, 
  Code, 
  Terminal, 
  Layers, 
  Palette, 
  Coins, 
  Radio, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function About() {
  const departments = [
    {
      role: "Studio Director & Architect",
      agent: "Lead Executive Agent",
      tier: "Autonomous Planner",
      icon: Terminal,
      status: "ONLINE",
      statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      focus: "Monorepo governance, cross-discipline CI/CD orchestration, and strategic game vision alignment.",
      metric: "Architectural Integrity: 100%",
      badgeVariant: "default" as const,
      borderGlow: "border-slate-800 hover:border-slate-600"
    },
    {
      role: "Lead Gameplay Engineer",
      agent: "Godot Specialist Subagent",
      tier: "Physics & Engine Lead",
      icon: Code,
      status: "PASSING",
      statusColor: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
      focus: "Deterministic 6-DOF Newtonian flight dynamics, empirical Magnus aerodynamics, and zero-GC packed binary codecs.",
      metric: "Headless Godot 4.7 Tests: 9/9 Pass",
      badgeVariant: "secondary" as const,
      borderGlow: "border-neon-cyan/30 hover:border-neon-cyan"
    },
    {
      role: "Website & Edge LiveOps",
      agent: "Cloudflare Specialist Subagent",
      tier: "Edge Infrastructure",
      icon: Radio,
      status: "LIVE EDGE",
      statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      focus: "Serverless Edge Workers, sub-50ms React PWA delivery, and WebRTC STUN/TURN matchmaking broker.",
      metric: "Edge Delivery: <35ms Global",
      badgeVariant: "default" as const,
      borderGlow: "border-blue-500/30 hover:border-blue-400"
    },
    {
      role: "Lead Graphic Designer",
      agent: "Vector & UI Subagent",
      tier: "Visual Identity Lead",
      icon: Palette,
      status: "VERIFIED",
      statusColor: "text-neon-magenta border-neon-magenta/40 bg-neon-magenta/10",
      focus: "Cybernetic HUDs, pure vector identity marks, and strict 100% transparent RGBA/SVG assets (zero-grid policy).",
      metric: "Grid Keyout: Alpha = 0.00",
      badgeVariant: "secondary" as const,
      borderGlow: "border-neon-magenta/30 hover:border-neon-magenta"
    },
    {
      role: "Monetization & Economy",
      agent: "Tokenomics Subagent",
      tier: "Economy Systems",
      icon: Coins,
      status: "DEPLOYED",
      statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      focus: "Supabase Single Pilot Clearance, cross-game diamond currency, battle pass tiers, and fair F2P loop design.",
      metric: "Cross-Progression: Unified Auth",
      badgeVariant: "outline" as const,
      borderGlow: "border-amber-500/30 hover:border-amber-400"
    },
    {
      role: "Branding & Worldbuilding",
      agent: "Lore Architect Subagent",
      tier: "Narrative Design",
      icon: Sparkles,
      status: "ACTIVE",
      statusColor: "text-electric-blue border-electric-blue/40 bg-electric-blue/10",
      focus: "Tachyon sci-fi universe lore, Star-League theater factions, kinetic aerospace visual tone, and narrative cohesion.",
      metric: "World Codex: Complete V1",
      badgeVariant: "outline" as const,
      borderGlow: "border-slate-800 hover:border-slate-600"
    }
  ];

  const pillars = [
    {
      icon: Zap,
      title: "Zero-Cost Edge Scalability",
      description: "Cloudflare Edge Workers and WebRTC P2P DataChannels handle multiplayer arbitration. Central servers handle ephemeral presence only; frame physics run peer-to-peer with zero monthly server bills.",
      accent: "text-neon-cyan",
      badge: "WebRTC DataChannel"
    },
    {
      icon: Radio,
      title: "Hardware Agnosticism",
      description: "Hardware controller barriers are eliminated. Any mobile device scans a QR code to transform into a high-precision 6-DOF gyro flight stick and touchscreen throttle with sub-3ms local latency.",
      accent: "text-neon-magenta",
      badge: "Mobile HOTAS PWA"
    },
    {
      icon: Code,
      title: "Open-Source Engine Viability",
      description: "Primary production runs on Godot 4 and Three.js with zero runtime royalties, while secondary console targets utilize Unreal Engine 5 Nanite with shared CAD mesh pipelines.",
      accent: "text-blue-400",
      badge: "Godot 4.x + Three.js"
    },
    {
      icon: Layers,
      title: "Procedural CAD Asset Pipelines",
      description: "Airframes are authored as mathematical B-Rep / STEP lofts in Autodesk Fusion 360, then processed through headless Blender scripts to generate game-ready LODs, collision hulls, and normal maps.",
      accent: "text-amber-400",
      badge: "Automated NURBS Pipeline"
    }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-electric-blue/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-12 border-b border-slate-800 pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF] mr-1.5 animate-pulse" />
            STUDIO MANIFESTO // 2026
          </Badge>
          <Badge variant="secondary" className="font-mono text-[11px]">
            AI-ASSISTED &bull; HUMAN-DIRECTED
          </Badge>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Tachyon Studios</span>
        </h1>
        <p className="text-slate-300 max-w-3xl text-lg font-light leading-relaxed">
          Tachyon is an AI-assisted, human-directed game development studio engineered to eliminate server hosting overhead, hardware controller friction, and manual asset bottlenecks through open-source tooling and autonomous subagent execution.
        </p>
      </div>

      {/* Live Studio Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Architecture</span>
          <span className="text-lg font-black text-white">Cloudflare Edge</span>
          <span className="text-[10px] text-emerald-400 block mt-1">100% Serverless</span>
        </div>
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Multiplayer Codec</span>
          <span className="text-lg font-black text-neon-cyan">WebRTC P2P</span>
          <span className="text-[10px] text-slate-400 block mt-1">16-Byte Packed Frame</span>
        </div>
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Deterministic Physics</span>
          <span className="text-lg font-black text-neon-magenta">60Hz Magnus</span>
          <span className="text-[10px] text-emerald-400 block mt-1">Headless Godot 4.7</span>
        </div>
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Pilot Profile</span>
          <span className="text-lg font-black text-blue-400">Single Clearance</span>
          <span className="text-[10px] text-slate-400 block mt-1">Supabase Cross-Save</span>
        </div>
      </div>

      {/* The 4 Core Operating Pillars */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-1">Fundamental Axioms</h2>
            <h3 className="text-2xl font-bold text-white">Core Operating Pillars</h3>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">4 Architectural Vectors</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <Card key={i} className="border-slate-800/90 bg-slate-950/70 hover:border-slate-700 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${pillar.accent}`}>
                    <pillar.icon size={20} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {pillar.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The AI-Assisted Department Structure */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-1">Autonomous Org Chart</h2>
            <h3 className="text-2xl font-bold text-white">AI-Assisted Department Structure</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ALL LEADS OPERATIONAL
          </span>
        </div>
        
        <p className="text-sm text-slate-400 font-light max-w-3xl mb-8 leading-relaxed">
          Tachyon Studios pairs executive human creative direction with specialized autonomous AI department leads, each running inside dedicated workspaces with domain-specific unit verification suites:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept, i) => (
            <Card key={i} className={`bg-slate-950/80 transition-all duration-300 flex flex-col justify-between ${dept.borderGlow}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-center text-slate-300">
                    <dept.icon size={16} />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${dept.statusColor}`}>
                    {dept.status}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-white tracking-wide">
                  {dept.role}
                </CardTitle>
                <CardDescription className="text-xs font-mono text-slate-400">
                  {dept.agent} &bull; <span className="text-slate-500">{dept.tier}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="py-2">
                <p className="text-xs text-slate-300 font-light leading-relaxed mb-3">
                  {dept.focus}
                </p>
              </CardContent>

              <CardFooter className="pt-2 pb-4 border-t border-slate-900/90 flex items-center justify-between font-mono text-[10px]">
                <span className="text-slate-400">{dept.metric}</span>
                <ChevronRight size={12} className="text-slate-600" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Brand Visual Standard Banner */}
      <Card className="mb-14 border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 via-black to-neon-magenta/10 p-2 sm:p-4">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="text-neon-cyan border-neon-cyan/40">
              STRICT STUDIO ASSET POLICY
            </Badge>
            <h3 className="text-xl font-bold text-white">100% Transparent Visual Standard</h3>
            <p className="text-xs text-slate-300 max-w-xl font-light leading-relaxed">
              Every emblem, fighter silhouette, ball mesh icon, and branding hero is delivered in pure 32-bit RGBA PNG or scalable SVG with surgical background matting. Zero embedded checkerboards or artificial white borders are tolerated in Tachyon production assets.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a href="/press">
              <Button variant="cyan" className="gap-2 text-xs font-mono">
                Inspect Media Vault
                <ExternalLink size={13} />
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* Call to action */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-black/80 to-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Inspect The Open Monorepo</h3>
          <p className="text-sm text-slate-400 font-light">Explore our Godot 4 unit tests, WebRTC codec specs, and Edge Worker matchmaking scripts.</p>
        </div>
        <div className="flex gap-3 font-mono text-xs">
          <a href="https://github.com/bokk3/studio-monorepo" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20">
              <Code size={14} />
              GitHub Repository
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
