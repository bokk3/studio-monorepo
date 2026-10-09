import { Cpu, Zap, Network, Code } from 'lucide-react';

export default function About() {
  const departments = [
    {
      role: "Studio Director & Architect",
      lead: "Parent Lead Agent",
      focus: "Monorepo Governance, Cross-Discipline CI/CD, Strategic Roadmap",
      color: "text-white",
      border: "border-slate-700"
    },
    {
      role: "Lead Gameplay Engineer",
      lead: "Godot Specialist Subagent",
      focus: "6-DOF Dynamics, Aerodynamic Magnus Physics, Zero-GC Codecs",
      color: "text-neon-cyan",
      border: "border-neon-cyan/40"
    },
    {
      role: "Website & Web LiveOps",
      lead: "Cloudflare Specialist Subagent",
      focus: "Edge Matchmaking Workers, React PWAs, Sub-50ms DOM Delivery",
      color: "text-neon-cyan",
      border: "border-neon-cyan/40"
    },
    {
      role: "Lead Graphic Designer",
      lead: "Vector & UI Subagent",
      focus: "100% Transparent SVGs, Cybernetic HUDs, Identity Badges",
      color: "text-neon-magenta",
      border: "border-neon-magenta/40"
    },
    {
      role: "Monetization & Economy",
      lead: "Tokenomics Subagent",
      focus: "Supabase Single Pilot Clearance, Cross-Game Diamonds, LTV Optimization",
      color: "text-blue-400",
      border: "border-blue-500/40"
    },
    {
      role: "Branding & Narrative",
      lead: "Worldbuilding Subagent",
      focus: "Tachyon Lore, Galactic War Theater Narratives, Tone of Voice",
      color: "text-amber-400",
      border: "border-amber-500/40"
    }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-electric-blue/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-14 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
          STUDIO MANIFESTO // 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Tachyon Studios</span>
        </h1>
        <p className="text-slate-300 max-w-3xl text-lg font-light leading-relaxed">
          Tachyon is an AI-assisted, human-directed game development studio founded from scratch to eliminate server hosting costs, hardware controller barriers, and manual asset bottlenecks.
        </p>
      </div>

      {/* The 4 Core Pillars */}
      <section className="mb-16">
        <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-4">Core Operating Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800/90 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Cost Edge Scalability</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              We leverage Cloudflare Edge Workers and WebRTC P2P DataChannels for multiplayer. Central servers handle ephemeral presence only; all frame physics are arbitrated peer-to-peer with zero monthly server bills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800/90 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center text-neon-magenta mb-4">
              <Network size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hardware Agnosticism</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Expensive flight sticks and controllers are obsolete. Any smartphone scans an on-screen QR code to become a precision 6-DOF gyro flight stick and touchscreen throttle with sub-3ms local latency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800/90 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4">
              <Code size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Open-Source Engine Viability</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Primary production runs on Godot 4 and Three.js with zero runtime royalties, while secondary console targets utilize Unreal Engine 5 Nanite with shared CAD pipelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800/90 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
              <Cpu size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Procedural CAD Asset Pipelines</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              We author real mechanical engineering NURBS lofts in Autodesk Fusion 360 and drive automated headless Blender scripts to mathematically generate LODs, collision hulls, and normal maps.
            </p>
          </div>
        </div>
      </section>

      {/* The AI-Assisted Department Structure */}
      <section className="mb-16">
        <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-4">The AI-Assisted Department Structure</h2>
        <p className="text-sm text-slate-400 font-light max-w-2xl mb-6">
          Our studio operates under the direction of human founders while specialized autonomous AI department leads execute development in parallel:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept, i) => (
            <div key={i} className={`p-5 rounded-xl bg-slate-950/70 border ${dept.border} flex flex-col justify-between font-mono`}>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${dept.color}`}>{dept.role}</span>
                <span className="text-[11px] text-slate-400 block mb-3">{dept.lead}</span>
                <p className="text-xs text-slate-300 font-sans font-light leading-relaxed mb-4">{dept.focus}</p>
              </div>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900 flex justify-between">
                <span>STATUS: ACTIVE</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-black/80 to-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Explore Our Codebase</h3>
          <p className="text-sm text-slate-400 font-light">View our open monorepo architecture, headless test suites, and documentation.</p>
        </div>
        <div className="flex gap-3 font-mono text-xs">
          <a href="https://github.com/bokk3/studio-monorepo" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold hover:bg-neon-cyan/30 transition-all">
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
