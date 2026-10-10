import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Maximize2, Minimize2, Smartphone, RefreshCw } from 'lucide-react';

export default function Arena() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const toggleFullscreen = () => {
    const el = document.getElementById('arena-container');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div id="arena-container" className="flex flex-col h-[calc(100vh-4rem)] w-full bg-[#08080a] overflow-hidden">
      {/* Tactical Cockpit Ribbon */}
      <header className="h-12 bg-black/90 border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/games">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800">
              <ArrowLeft size={13} className="mr-1.5" />
              HANGAR
            </Button>
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F3FF] animate-pulse"></span>
            <span className="font-bold text-xs uppercase tracking-widest text-[#00F3FF]">Astro-Smash: Arena</span>
            <Badge variant="cyan" className="text-[10px] py-0 px-2 uppercase font-mono">
              Live Alpha
            </Badge>
          </div>
        </div>

        {/* Center HOTAS Sync Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
          <Smartphone size={13} className="text-cyan-400" />
          <span className="text-slate-400">Mobile HOTAS Room:</span>
          <span className="text-cyan-300 font-bold tracking-wider">TACHYON-7492</span>
          <Link to="/controller" target="_blank" className="text-slate-500 hover:text-cyan-400 ml-1">
            <ExternalLink size={11} />
          </Link>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIframeKey((prev) => prev + 1)}
            className="h-8 text-xs font-mono text-slate-400 hover:text-white"
            title="Reload Arena Simulation"
          >
            <RefreshCw size={13} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 text-xs font-mono text-slate-400 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </Button>

          <a
            href="https://astro-smash.truyensboris.workers.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="cyan" size="sm" className="h-8 text-xs font-mono">
              <span>STANDALONE</span>
              <ExternalLink size={12} className="ml-1.5" />
            </Button>
          </a>
        </div>
      </header>

      {/* Embedded 3D Arena Frame */}
      <main className="flex-1 w-full h-full relative bg-black">
        <iframe
          key={iframeKey}
          src="https://astro-smash.truyensboris.workers.dev"
          title="Astro-Smash: Arena Web Client"
          className="w-full h-full border-0 block"
          allow="fullscreen; accelerometer; gyroscope; autoplay"
        />
      </main>
    </div>
  );
}
