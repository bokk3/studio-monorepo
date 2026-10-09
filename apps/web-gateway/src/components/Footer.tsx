import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-black/60 py-10 px-6 sm:px-12 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/tachyon_mark.svg" alt="Tachyon Mark" className="w-6 h-6 opacity-75" />
          <span className="text-slate-300 font-bold tracking-widest text-sm">TACHYON STUDIOS</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-wider text-slate-400">
          <Link to="/games" className="hover:text-neon-cyan transition-colors">Games</Link>
          <Link to="/tech" className="hover:text-neon-cyan transition-colors">Tech Matrix</Link>
          <Link to="/controller" className="hover:text-neon-cyan transition-colors">Mobile HOTAS</Link>
          <Link to="/about" className="hover:text-neon-cyan transition-colors">Manifesto</Link>
          <Link to="/press" className="hover:text-neon-cyan transition-colors">Press Kit</Link>
          <a href="https://github.com/bokk3/studio-monorepo" target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">GitHub</a>
        </div>

        <div className="text-center md:text-right text-[10px] text-slate-500">
          Zero-Royalty Engine Architecture &bull; Edge Matchmaking &copy; 2026 Tachyon Studios
        </div>
      </div>
    </footer>
  );
}
