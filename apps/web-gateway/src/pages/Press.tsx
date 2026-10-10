import { Download, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      title: "Hero Studio Branding",
      format: "32-bit Transparent PNG",
      src: "/tachyon_website_branding.png",
      download: "/tachyon_website_branding.png",
      category: "Branding",
      badgeVariant: "cyan" as const
    },
    {
      title: "Tachyon High-Res Emblem",
      format: "32-bit Transparent PNG (1024×1024)",
      src: "/tachyon_logo_highres.png",
      download: "/tachyon_logo_highres.png",
      category: "Logos",
      badgeVariant: "cyan" as const
    },
    {
      title: "Tachyon Full Vector Logo",
      format: "Transparent Vector SVG",
      src: "/tachyon_logo_full.svg",
      download: "/tachyon_logo_full.svg",
      category: "Logos",
      badgeVariant: "cyan" as const
    },
    {
      title: "Vanguard Tactical Interceptor",
      format: "Transparent SVG & PNG",
      src: "/tachyon_fighter_concept.svg",
      download: "/tachyon_fighter_concept.png",
      category: "Concept Art",
      badgeVariant: "cobalt" as const
    },
    {
      title: "Orbit Runner Gyro Drone",
      format: "Transparent SVG & PNG",
      src: "/tachyon_drone_concept.svg",
      download: "/tachyon_drone_concept.png",
      category: "Concept Art",
      badgeVariant: "magenta" as const
    },
    {
      title: "Astro-Smash Aerodynamic Core",
      format: "Transparent SVG & PNG",
      src: "/tachyon_ball_concept.svg",
      download: "/tachyon_ball_concept.png",
      category: "Concept Art",
      badgeVariant: "cyan" as const
    },
    {
      title: "Holographic Sports Arena",
      format: "32-bit Transparent PNG",
      src: "/tachyon_concept_arena.png",
      download: "/tachyon_concept_arena.png",
      category: "Concept Art",
      badgeVariant: "cyan" as const
    },
    {
      title: "Primary Vector Mark",
      format: "Transparent Vector SVG",
      src: "/tachyon_mark.svg",
      download: "/tachyon_mark.svg",
      category: "Logos",
      badgeVariant: "default" as const
    },
    {
      title: "Studio Horizon Banner",
      format: "Transparent Vector SVG",
      src: "/tachyon_banner.svg",
      download: "/tachyon_banner.svg",
      category: "Branding",
      badgeVariant: "default" as const
    }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-10 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
          PRESS KIT & MEDIA ASSET REGISTRY
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Press & <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Media Kit</span>
        </h1>
        <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-light leading-relaxed">
          Official high-resolution logos, concept art, executive boilerplate, and 100% transparent vector & PNG assets for journalists, streamers, and industry partners.
        </p>
      </div>

      {/* Studio Boilerplate */}
      <Card className="mb-12 border-slate-800 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono tracking-widest text-neon-cyan uppercase">Official Studio Boilerplate</span>
            <Badge variant="outline">Updated 2026</Badge>
          </div>
          <CardTitle className="text-xl">About Tachyon Studios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed mb-4">
            Tachyon Studios is an AI-assisted, human-directed game development studio pioneering the next generation of frictionless multiplayer experiences. By pairing open-source game engines (Godot 4, Three.js) with serverless edge computing on Cloudflare and WebRTC peer-to-peer data channels, Tachyon builds high-fidelity, AA/AAA games with zero server hosting costs and hardware-agnostic mobile companion controls.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
            <span>FOUNDED: 2026</span>
            <span>&bull;</span>
            <span>HEADQUARTERS: EDGE CLOUD / REMOTE FIRST</span>
            <span>&bull;</span>
            <span>STACK: GODOT 4 &bull; WEBRTC &bull; UNREAL 5 &bull; SUPABASE</span>
          </div>
        </CardContent>
      </Card>

      {/* Transparent Brand Assets Grid */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-1">Official Studio Assets</h2>
            <h3 className="text-xl font-bold text-white">Media Asset Vault (100% Transparent)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            ZERO-GRID POLICY &bull; SVG & 32-BIT RGBA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset, i) => (
            <Card key={i} className="border-slate-800/80 bg-slate-950/70 flex flex-col justify-between hover:border-slate-600 transition-all duration-300 group overflow-hidden">
              <div className="h-40 flex items-center justify-center p-4 bg-black/70 border-b border-slate-900 relative">
                <img 
                  src={asset.src} 
                  alt={asset.title} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]" 
                />
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant={asset.badgeVariant} className="text-[10px]">
                    {asset.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{asset.title}</CardTitle>
                <CardDescription className="text-xs font-mono">{asset.format}</CardDescription>
              </CardHeader>

              <CardFooter className="p-4 pt-2">
                <a 
                  href={asset.download} 
                  download 
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 hover:border-neon-cyan hover:text-neon-cyan">
                    <Download size={13} />
                    Download File
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Color Palette Specifications */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono tracking-widest text-neon-cyan uppercase">Official Color Architecture</h2>
          <span className="text-xs font-mono text-slate-500">CLICK TO COPY HEX</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(c.hex)}
              className="p-4 rounded-xl bg-black/50 border border-slate-800 text-left hover:border-slate-600 transition-all font-mono group cursor-pointer"
            >
              <div className={`w-full h-12 rounded-lg ${c.bg} border ${c.border} mb-3 shadow-sm group-hover:scale-105 transition-transform`} />
              <span className="text-xs font-bold text-white block mb-0.5">{c.name}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <code>{c.hex}</code>
                {copiedHex === c.hex ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="opacity-40 group-hover:opacity-100" />}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
