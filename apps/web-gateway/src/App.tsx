import { useState, useEffect } from 'react'

export default function App() {
  const [latency, setLatency] = useState(2.4)
  const [activePeers, setActivePeers] = useState(148)
  const [selectedTab, setSelectedTab] = useState<'all' | 'web' | 'mobile' | 'aaa'>('all')
  const [testSignalActive, setTestSignalActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Number((2.1 + Math.random() * 0.8).toFixed(1)))
      setActivePeers(prev => prev + (Math.random() > 0.5 ? 1 : -1))
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  const triggerPing = () => {
    setTestSignalActive(true)
    setTimeout(() => setTestSignalActive(false), 800)
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans selection:bg-neon-cyan selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-electric-blue/15 via-neon-cyan/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-neon-magenta/10 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img src="/tachyon_mark.svg" alt="Tachyon Emblem" className="w-9 h-9 drop-shadow-[0_0_12px_rgba(0,243,255,0.7)]" />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-widest text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-neon-cyan">
              TACHYON
            </span>
            <span className="text-[9px] font-mono tracking-widest text-neon-cyan uppercase">
              STUDIOS // 2026.1
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono">
          <a href="#ecosystem" className="hover:text-neon-cyan transition-colors">Ecosystem</a>
          <a href="#technology" className="hover:text-neon-cyan transition-colors">Tech Matrix</a>
          <a href="#telemetry" className="hover:text-neon-cyan transition-colors">Edge Telemetry</a>
          <a href="https://github.com/bokk3/studio-monorepo" target="_blank" rel="noreferrer" className="hover:text-neon-cyan transition-colors">GitHub Monorepo</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-slate-800 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${testSignalActive ? 'bg-neon-magenta animate-ping' : 'bg-neon-cyan shadow-[0_0_8px_#00F3FF]'}`} />
            <span className="text-slate-400">EDGE:</span>
            <span className="text-neon-cyan font-bold">{latency}ms</span>
          </div>
          <button 
            onClick={triggerPing}
            className="px-4 py-1.5 text-xs font-bold tracking-wider uppercase border border-neon-cyan/80 text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/25 hover:border-neon-cyan rounded transition-all shadow-[0_0_12px_rgba(0,243,255,0.25)] active:scale-95"
          >
            Ping Edge
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-12 pb-24 max-w-7xl mx-auto w-full">
        {/* Transparent Studio Banner */}
        <div className="w-full max-w-4xl relative mb-4 flex justify-center">
          <img 
            src="/tachyon_banner.svg" 
            alt="Tachyon Studio Banner" 
            className="w-full h-auto max-h-72 object-contain drop-shadow-[0_0_35px_rgba(0,85,255,0.4)]" 
          />
        </div>

        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-mono mb-4 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            HUMAN-DIRECTED // AI-ACCELERATED GAMEPLAY
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            Zero-Friction Multiplayer <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">
              At The Speed of Light
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            Tachyon is an AI-assisted studio revolutionizing game development. By uniting 
            <strong className="text-neon-cyan font-normal"> Cloudflare Edge Matchmaking</strong>, 
            <strong className="text-white font-normal"> WebRTC DataChannels</strong>, and 
            <strong className="text-neon-magenta font-normal"> Parametric CAD-to-Mesh Pipelines</strong>, 
            we eliminate physical controller barriers and server costs forever.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#ecosystem"
              className="px-7 py-3 rounded bg-gradient-to-r from-neon-cyan to-electric-blue text-black font-extrabold text-sm tracking-wider uppercase hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]"
            >
              Explore 3-Game Ecosystem
            </a>
            <a 
              href="#telemetry"
              className="px-6 py-3 rounded border border-slate-700 bg-black/40 hover:bg-slate-900 text-slate-200 font-semibold text-sm tracking-wider uppercase hover:border-slate-500 transition-all"
            >
              View System Telemetry
            </a>
          </div>
        </div>

        {/* 3-Game Ecosystem Section */}
        <section id="ecosystem" className="w-full mb-20 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <span className="text-neon-cyan font-mono text-xs tracking-widest uppercase">Unified Progression</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Cross-Title Universe</h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0 font-mono text-xs">
              {(['all', 'web', 'mobile', 'aaa'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-1 rounded uppercase tracking-wider transition-all ${
                    selectedTab === tab 
                      ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                      : 'border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Web F2P */}
            {(selectedTab === 'all' || selectedTab === 'web') && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-between hover:border-neon-cyan/60 transition-all hover:shadow-[0_0_25px_rgba(0,243,255,0.15)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-75 group-hover:opacity-100 transition-opacity">
                  <img src="/tachyon_icon_web.svg" alt="Web F2P Icon" className="w-14 h-14" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 mb-3">
                    WEBGL // BROWSER F2P
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-2">
                    Astro-Smash: Arena
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    High-octane 3v3 physics sports brawler running at locked 60Hz inside any browser tab. Built on Three.js & Magnus aerodynamics.
                  </p>
                  
                  <div className="space-y-1.5 text-xs font-mono text-slate-300 border-t border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tech:</span>
                      <span className="text-slate-300">Three.js / WebRTC P2P</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monetization:</span>
                      <span className="text-neon-cyan">Cosmetic Trails & Drops</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entry:</span>
                      <span className="text-emerald-400 font-bold">100% Free (Zero Install)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">PITCH CANDIDATE #1B</span>
                  <span className="text-xs font-bold text-neon-cyan group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Pitch &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* Card 2: Mobile F2P */}
            {(selectedTab === 'all' || selectedTab === 'mobile') && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-between hover:border-neon-magenta/60 transition-all hover:shadow-[0_0_25px_rgba(255,0,255,0.15)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-75 group-hover:opacity-100 transition-opacity">
                  <img src="/tachyon_icon_mobile.svg" alt="Mobile F2P Icon" className="w-14 h-14" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30 mb-3">
                    IOS & ANDROID // INSTALLABLE
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-magenta transition-colors mb-2">
                    Orbit Runner: Gyro Dash
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Visceral 6-DOF endless vertical flight. Utilizes physical smartphone gyroscope sensor fusion with haptic vibration feedback.
                  </p>
                  
                  <div className="space-y-1.5 text-xs font-mono text-slate-300 border-t border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tech:</span>
                      <span className="text-slate-300">Godot 4 Mobile / Sensor Fusion</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monetization:</span>
                      <span className="text-neon-magenta">Gacha Chests & Diamonds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Companion:</span>
                      <span className="text-neon-cyan font-bold">HOTAS Phone Sync</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">PITCH CANDIDATE #2B</span>
                  <span className="text-xs font-bold text-neon-magenta group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Pitch &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* Card 3: AAA Console/Steam */}
            {(selectedTab === 'all' || selectedTab === 'aaa') && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-between hover:border-electric-blue/80 transition-all hover:shadow-[0_0_25px_rgba(0,85,255,0.25)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-75 group-hover:opacity-100 transition-opacity">
                  <img src="/tachyon_icon_aaa.svg" alt="AAA Console Icon" className="w-14 h-14" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-electric-blue/20 text-blue-300 border border-electric-blue/40 mb-3">
                    STEAM & CONSOLES // AAA PREMIUM
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                    Vanguard: The Outer War
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Cinematic 32v32 space combat powered by Unreal Engine 5. Buying this unlocks Founder Prestige and Diamond stipends across the ecosystem.
                  </p>
                  
                  <div className="space-y-1.5 text-xs font-mono text-slate-300 border-t border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tech:</span>
                      <span className="text-slate-300">Unreal Engine 5 (Nanite/Lumen)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monetization:</span>
                      <span className="text-white font-bold">$29.99 Base + Founder Perk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Synergy:</span>
                      <span className="text-neon-cyan font-bold">Unlocks Cross-Game Pets</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">PITCH CANDIDATE #3A</span>
                  <span className="text-xs font-bold text-blue-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Pitch &rarr;
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Telemetry & Architecture Hub */}
        <section id="telemetry" className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-neon-cyan font-mono text-xs tracking-widest uppercase">Infrastructure Status</span>
              <h2 className="text-2xl font-bold text-white mt-1">Live Studio Mesh Telemetry</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-slate-300">EDGE MESH: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00F3FF]" />
                <span className="text-slate-300">ACTIVE PEERS: {activePeers}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-lg bg-black/60 border border-slate-800/80">
              <span className="text-slate-500 text-xs block mb-1">EDGE MATCHMAKING</span>
              <span className="text-lg font-bold text-neon-cyan">Cloudflare Workers</span>
              <span className="text-[10px] text-slate-400 block mt-1">30s Ephemeral Lobby Purge</span>
            </div>
            <div className="p-4 rounded-lg bg-black/60 border border-slate-800/80">
              <span className="text-slate-500 text-xs block mb-1">DATA ARBITRATION</span>
              <span className="text-lg font-bold text-neon-magenta">WebRTC P2P</span>
              <span className="text-[10px] text-slate-400 block mt-1">16-Byte Packed Binary Frame</span>
            </div>
            <div className="p-4 rounded-lg bg-black/60 border border-slate-800/80">
              <span className="text-slate-500 text-xs block mb-1">CROSS-GAME AUTH</span>
              <span className="text-lg font-bold text-white">Supabase DB</span>
              <span className="text-[10px] text-slate-400 block mt-1">Single Pilot Clearance Profile</span>
            </div>
            <div className="p-4 rounded-lg bg-black/60 border border-slate-800/80">
              <span className="text-slate-500 text-xs block mb-1">ASSET PIPELINE</span>
              <span className="text-lg font-bold text-blue-400">Headless CAD</span>
              <span className="text-[10px] text-slate-400 block mt-1">Fusion 360 &rarr; Blender &rarr; Godot/UE5</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src="/tachyon_mark.svg" alt="Tachyon" className="w-5 h-5 opacity-60" />
          <span className="text-slate-400 font-bold tracking-widest">TACHYON STUDIOS</span>
        </div>
        <p>&copy; 2026 Tachyon Interactive. Zero-royalty, open-source engine stack. Licensed under MIT / Proprietary IP.</p>
      </footer>
    </div>
  )
}
