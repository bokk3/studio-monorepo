import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Smartphone, Zap, Cpu, ShieldCheck } from 'lucide-react';
import { LaserCutLogo } from '@/components/ui/LaserCutLogo';

export default function Home() {
  const previews = [
    {
      title: "Astro-Smash: Arena",
      type: "Web F2P",
      tagline: "3v3 Aerodynamic Brawler",
      conceptArt: "/tachyon_concept_arena.png",
      badgeVariant: "cyan" as const,
      borderColor: "border-neon-cyan/40 hover:border-neon-cyan",
      href: "/games"
    },
    {
      title: "Orbit Runner: Gyro Dash",
      type: "Mobile F2P",
      tagline: "6-DOF Vertical Flight",
      conceptArt: "/tachyon_drone_concept.svg",
      badgeVariant: "magenta" as const,
      borderColor: "border-neon-magenta/40 hover:border-neon-magenta",
      href: "/games"
    },
    {
      title: "Vanguard: The Outer War",
      type: "AAA Premium",
      tagline: "Cinematic Space Combat",
      conceptArt: "/tachyon_fighter_concept.svg",
      badgeVariant: "cobalt" as const,
      borderColor: "border-blue-500/40 hover:border-blue-400",
      href: "/games"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden max-w-7xl mx-auto">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[400px] bg-neon-magenta/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        {/* Main Studio Branding Header with Laser Cut Tracing & 5s 'Shwoooooomph' Shine */}
        <div className="mb-6 flex justify-center w-full">
          <LaserCutLogo 
            src="/tachyon_website_branding.png" 
            alt="Tachyon Game Studio" 
            className="w-full max-w-[640px]"
          />
        </div>
        
        {/* Main Hero Card Container */}
        <div className="border border-neon-cyan/30 bg-black/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.12)] w-full mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse" />
            <span className="text-neon-cyan font-mono text-xs sm:text-sm tracking-widest uppercase">&gt; Edge Telemetry Active &bull; Zero GC Sync</span>
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
            Frictionless Play. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">
              Zero Latency.
            </span>
          </h1>
          
          <p className="text-slate-300 mb-10 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            We are engineering the next generation of instantly accessible multiplayer games. Powered by WebRTC direct datachannels, physical sensor fusion, and unified cross-progression.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/games">
              <Button size="lg" className="w-full sm:w-auto font-bold tracking-wider">
                Enter The Arena
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>

            <Link to="/controller">
              <Button variant="magenta" size="lg" className="w-full sm:w-auto">
                <Smartphone size={16} />
                Launch Mobile HOTAS
              </Button>
            </Link>

            <Link to="/tech">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Tech Matrix
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Ecosystem Metrics Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Network Architecture</div>
              <div className="text-white font-bold text-sm">WebRTC &bull; &lt;15ms Edge</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30">
              <Cpu size={18} />
            </div>
            <div>
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Physics Core</div>
              <div className="text-white font-bold text-sm">Deterministic 60Hz Magnus</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-slate-400 uppercase text-[10px] tracking-wider">Cross-Progression</div>
              <div className="text-white font-bold text-sm">Supabase Universal Pilot ID</div>
            </div>
          </div>
        </div>

        {/* The Trilogy Teaser Section */}
        <div className="w-full text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-neon-cyan mb-1">Ecosystem Titles</div>
              <h2 className="text-2xl font-bold text-white">The Three Pillars</h2>
            </div>
            <Link to="/games" className="text-xs font-mono text-slate-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
              View All Specs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previews.map((item, idx) => (
              <Link to={item.href} key={idx} className="group">
                <Card className={`border ${item.borderColor} bg-slate-950/70 transition-all duration-300 group-hover:-translate-y-1.5 h-full flex flex-col justify-between overflow-hidden`}>
                  <div className="h-44 w-full bg-black/80 flex items-center justify-center p-4 relative border-b border-slate-800/80">
                    <img 
                      src={item.conceptArt} 
                      alt={item.title} 
                      className="max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={item.badgeVariant}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-5">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 block mb-1">
                      {item.tagline}
                    </span>
                    <CardTitle className="text-lg group-hover:text-neon-cyan transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-2 line-clamp-2">
                      Engineered for high-frequency multiplayer with deterministic physics and cross-game rewards.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 mt-auto">
                    <div className="text-xs font-mono text-neon-cyan flex items-center gap-1 group-hover:underline">
                      Explore Title Details <ArrowRight size={12} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
