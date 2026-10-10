import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Maximize2, Minimize2, Crosshair, RefreshCw } from 'lucide-react';

export default function Strike() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const toggleFullscreen = () => {
    const el = document.getElementById('strike-container');
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
    <div id="strike-container" className="flex flex-col h-[calc(100vh-4rem)] w-full bg-[#050608] overflow-hidden">
      {/* Tactical Header Ribbon */}
      <header className="h-12 bg-black/90 border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/games">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800">
              <ArrowLeft size={13} className="mr-1.5" />
              HANGAR
            </Button>
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Crosshair size={14} className="text-[#00F3FF] animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-widest text-white">Tachyon: Strike</span>
            <Badge variant="cyan" className="text-[10px] py-0 px-2 uppercase font-mono">
              CQB Alpha
            </Badge>
          </div>
        </div>

        {/* Center Optical Status */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
          <span className="text-slate-400">Optics:</span>
          <span className="text-cyan-300 font-bold tracking-wider">HOLO / NVG / FLIR</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Ballistics:</span>
          <span className="text-emerald-400 font-bold">5.56x45mm Suppressed</span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIframeKey((prev) => prev + 1)}
            className="h-8 text-xs font-mono text-slate-400 hover:text-white"
            title="Reload Killhouse Range"
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
            href="https://tachyon-strike.truyensboris.workers.dev"
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

      {/* Embedded 3D Shooter Frame */}
      <main className="flex-1 w-full h-full relative bg-black">
        <iframe
          key={iframeKey}
          src="https://tachyon-strike.truyensboris.workers.dev"
          title="Tachyon: Strike Web Client"
          className="w-full h-full border-0 block"
          allow="fullscreen; pointer-lock; accelerometer; gyroscope; autoplay"
        />
      </main>
    </div>
  );
}
