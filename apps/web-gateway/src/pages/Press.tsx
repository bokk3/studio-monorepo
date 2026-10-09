import { Download, Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function Press() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const colors = [
    { name: "Void Obsidian", hex: "#121212", bg: "bg-[#121212]", border: "border-slate-700" },
    { name: "Aero Cyan", hex: "#00F3FF", bg: "bg-[#00F3FF]", border: "border-[#00F3FF]" },
    { name: "Electric Blue", hex: "#0055FF", bg: "bg-[#0055FF]", border: "border-[#0055FF]" },
    { name: "Pulse Magenta", hex: "#FF00FF", bg: "bg-[#FF00FF]", border: "border-[#FF00FF]" },
    { name: "Velocity Mint", hex: "#00FFB2", bg: "bg-[#00FFB2]", border: "border-[#00FFB2]" },
    { name: "Solar Amber", hex: "#FFB800", bg: "bg-[#FFB800]", border: "border-[#FFB800]" }
  ];

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const assets = [
    {
      title: "Tachyon Full Logo",
      format: "Transparent Vector SVG",
      src: "/tachyon_logo_full.svg",
      download: "/tachyon_logo_full.svg"
    },
    {
      title: "Primary Tachyon Emblem (Mark)",
      format: "Transparent Vector SVG",
      src: "/tachyon_mark.svg",
      download: "/tachyon_mark.svg"
    },
    {
      title: "Tachyon Studio Banner",
      format: "Transparent Vector SVG",
      src: "/tachyon_banner.svg",
      download: "/tachyon_banner.svg"
    },
    {
      title: "Web F2P Badge",
      format: "Transparent Vector SVG",
      src: "/tachyon_icon_web.svg",
      download: "/tachyon_icon_web.svg"
    },
    {
      title: "Mobile F2P Badge",
      format: "Transparent Vector SVG",
      src: "/tachyon_icon_mobile.svg",
      download: "/tachyon_icon_mobile.svg"
    },
    {
      title: "AAA Premium Badge",
      format: "Transparent Vector SVG",
      src: "/tachyon_icon_aaa.svg",
      download: "/tachyon_icon_aaa.svg"
    }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-12 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
          PRESS KIT & MEDIA ASSET REGISTRY
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Press & <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-magenta">Media Kit</span>
        </h1>
        <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-light leading-relaxed">
          Official logos, executive boilerplate, color codes, and transparent assets for press, streamers, and partners.
        </p>
      </div>

      {/* Studio Boilerplate */}
      <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-black/40 border border-slate-800/80">
        <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3">Official Boilerplate</h2>
        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed mb-4">
          Tachyon Studios is an AI-assisted, human-directed game development studio pioneering the next generation of frictionless multiplayer experiences. By pairing open-source game engines (Godot 4, Three.js) with serverless edge computing on Cloudflare and WebRTC peer-to-peer data channels, Tachyon builds high-fidelity, AA/AAA games with zero server hosting costs and hardware-agnostic mobile companion controls.
        </p>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
          <span>FOUNDED: 2026</span>
          <span>&bull;</span>
          <span>LOCATION: EDGE CLOUD / REMOTE FIRST</span>
          <span>&bull;</span>
          <span>ENGINE STACK: GODOT 4 &bull; THREE.JS &bull; UNREAL 5</span>
        </div>
      </section>

      {/* Transparent Brand Assets Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase">Official Vector Assets (100% Transparent)</h2>
          <span className="text-xs font-mono text-slate-500">MANDATORY TRANSPARENCY SPEC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all group">
              <div className="h-32 flex items-center justify-center p-4 bg-black/40 rounded-xl border border-slate-900 mb-4 overflow-hidden">
                <img src={asset.src} alt={asset.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">{asset.title}</h3>
                <span className="text-[11px] font-mono text-slate-400 block mb-4">{asset.format}</span>
              </div>

              <a 
                href={asset.download} 
                download 
                className="w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan text-slate-200 hover:text-neon-cyan font-mono text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Download size={14} />
                Download Vector (.SVG)
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Color Palette Specifications */}
      <section className="mb-14">
        <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-4">Official Hex Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(c.hex)}
              className="p-4 rounded-xl bg-black/40 border border-slate-800 text-left hover:border-slate-600 transition-all font-mono"
            >
              <div className={`w-full h-12 rounded-lg ${c.bg} border ${c.border} mb-3 shadow-sm`} />
              <span className="text-xs font-bold text-white block mb-0.5">{c.name}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <code>{c.hex}</code>
                {copiedHex === c.hex ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="opacity-40" />}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
