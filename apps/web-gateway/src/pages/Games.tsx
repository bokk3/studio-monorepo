export default function Games() {
  const games = [
    {
      title: "Astro-Smash: Arena",
      type: "Web F2P",
      status: "In Development",
      iconSrc: "/tachyon_icon_web.svg",
      tagline: "3v3 Aerodynamic Sports Brawler",
      description: "Fast-paced multiplayer brawler running at locked 60Hz inside any browser tab. Master the Magnus aerodynamic curve kicks, aerodynamic drag, and dynamic spin-bounce mechanics.",
      badges: ["Godot 4.7 WebGL", "WebRTC P2P", "Zero-GC Codec"],
      themeColor: "text-neon-cyan",
      borderColor: "border-neon-cyan/40 hover:border-neon-cyan",
      glowColor: "shadow-[0_0_30px_rgba(0,243,255,0.15)] hover:shadow-[0_0_40px_rgba(0,243,255,0.3)]",
      badgeBg: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
      palette: [
        { name: "Aero Cyan", hex: "#00F3FF", bg: "bg-[#00F3FF]" },
        { name: "Velocity Mint", hex: "#00FFB2", bg: "bg-[#00FFB2]" },
        { name: "Deep Ion Blue", hex: "#0055FF", bg: "bg-[#0055FF]" }
      ]
    },
    {
      title: "Orbit Runner: Gyro Dash",
      type: "Mobile F2P",
      status: "In Development",
      iconSrc: "/tachyon_icon_mobile.svg",
      tagline: "6-DOF Endless Vertical Flight",
      description: "Visceral mobile obstacle dodger powered by physical phone gyroscope sensor fusion and 1-tap Tare Horizon calibration. Features haptic vibration feedback and daily chest drops.",
      badges: ["Godot Mobile", "Sensor Fusion", "Haptic Feedback"],
      themeColor: "text-neon-magenta",
      borderColor: "border-neon-magenta/40 hover:border-neon-magenta",
      glowColor: "shadow-[0_0_30px_rgba(255,0,255,0.15)] hover:shadow-[0_0_40px_rgba(255,0,255,0.3)]",
      badgeBg: "bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30",
      palette: [
        { name: "Pulse Magenta", hex: "#FF00FF", bg: "bg-[#FF00FF]" },
        { name: "Ultraviolet", hex: "#9D00FF", bg: "bg-[#9D00FF]" },
        { name: "Neon Coral", hex: "#FF3366", bg: "bg-[#FF3366]" }
      ]
    },
    {
      title: "Vanguard: The Outer War",
      type: "AAA Premium",
      status: "In Design",
      iconSrc: "/tachyon_icon_aaa.svg",
      tagline: "Cinematic 32v32 Space Combat",
      description: "Next-gen tactical aerospace simulator built with Unreal Engine 5 Nanite & Lumen. Features mechanical CAD-lofted airframes, LCOS lead reticle fire control, and Founder cross-game prestige.",
      badges: ["Unreal Engine 5", "CAD Pipeline", "Cross-Game Auth"],
      themeColor: "text-blue-400",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      glowColor: "shadow-[0_0_30px_rgba(0,85,255,0.2)] hover:shadow-[0_0_40px_rgba(0,85,255,0.35)]",
      badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/40",
      palette: [
        { name: "Tactical Cobalt", hex: "#0055FF", bg: "bg-[#0055FF]" },
        { name: "Solar Amber", hex: "#FFB800", bg: "bg-[#FFB800]" },
        { name: "Titanium Ice", hex: "#D0E4FF", bg: "bg-[#D0E4FF]" }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[350px] bg-neon-magenta/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-12 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
          UNIFIED ECOSYSTEM // SEPARATE VISUAL IDENTITIES
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          The <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Tachyon Trilogy</span>
        </h1>
        <p className="text-slate-400 max-w-3xl text-base sm:text-lg font-light leading-relaxed">
          Three distinct games sharing a common Obsidian foundation and a unified Supabase player profile, each engineered with a unique color personality and gameplay loop.
        </p>
      </div>

      {/* Grid of Titles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {games.map((game, idx) => (
          <div 
            key={idx} 
            className={`bg-slate-950/70 backdrop-blur-md border ${game.borderColor} ${game.glowColor} rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden`}
          >
            {/* Top Bar */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800/80 group-hover:scale-105 transition-transform">
                  <img src={game.iconSrc} alt={`${game.title} Icon`} className="w-12 h-12" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${game.badgeBg}`}>
                    {game.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    {game.status}
                  </span>
                </div>
              </div>
              
              <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${game.themeColor} block mb-1`}>
                {game.tagline}
              </span>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                {game.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 font-light">
                {game.description}
              </p>
            </div>

            {/* Bottom Meta & Color Palette Bar */}
            <div className="border-t border-slate-900 pt-5 mt-auto space-y-4">
              {/* Distinct Color Palette Bar */}
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-1.5">
                  Distinct Signature Palette:
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
                  <span key={badge} className="px-2.5 py-1 bg-black/60 border border-slate-800 text-slate-300 text-[11px] font-mono rounded">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Foundation Callout */}
      <div className="mt-12 p-6 rounded-2xl bg-black/40 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="w-5 h-5 rounded-full bg-[#00F3FF] border-2 border-black inline-block shadow-[0_0_8px_#00F3FF]" />
            <span className="w-5 h-5 rounded-full bg-[#FF00FF] border-2 border-black inline-block shadow-[0_0_8px_#FF00FF]" />
            <span className="w-5 h-5 rounded-full bg-[#0055FF] border-2 border-black inline-block shadow-[0_0_8px_#0055FF]" />
            <span className="w-5 h-5 rounded-full bg-[#FFB800] border-2 border-black inline-block shadow-[0_0_8px_#FFB800]" />
          </div>
          <span className="text-slate-300">
            <strong className="text-white">Unified Substrate:</strong> All titles share Void Obsidian (<code className="text-slate-400">#121212</code>) & Fusion White telemetry reticles.
          </span>
        </div>
        <div className="text-slate-400 text-right">
          Single Pilot Clearance &bull; Cross-Progression Diamonds
        </div>
      </div>
    </div>
  );
}
