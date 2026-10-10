import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Smartphone, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [latency, setLatency] = useState(14);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { pilot } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(10 + Math.floor(Math.random() * 8));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Tech Matrix', path: '/tech' },
    { name: 'About', path: '/about' },
    { name: 'Press Kit', path: '/press' },
  ];

  return (
    <nav className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img 
                src="/tachyon_logo_full.svg" 
                alt="Tachyon Studios" 
                className="h-8 w-auto" 
                onError={(e) => e.currentTarget.src = '/tachyon_logo_full.png'} 
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-xs font-mono tracking-wider uppercase transition-colors ${
                  location.pathname === link.path 
                    ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] font-bold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/controller"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon-magenta/60 bg-neon-magenta/10 hover:bg-neon-magenta/25 text-neon-magenta text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(255,0,255,0.2)]"
            >
              <Smartphone size={14} />
              HOTAS PWA
            </Link>

            {/* Pilot Clearance / Enlistment CTA */}
            {pilot ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-white text-xs font-mono font-bold tracking-wider transition-all"
              >
                <ShieldCheck size={14} className="text-neon-cyan" />
                <span>{pilot.callsign}</span>
                <span className="text-cyan-300 text-[11px]">💎 {pilot.diamondsBalance}</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon-cyan/70 bg-neon-cyan/15 hover:bg-neon-cyan/30 text-neon-cyan text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(0,243,255,0.25)]"
              >
                <User size={13} />
                Enlist Pilot
              </Link>
            )}
            
            <div className="flex items-center space-x-2 bg-obsidian border border-electric-blue/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,85,255,0.15)]">
              <Activity size={13} className="text-neon-cyan animate-pulse" />
              <span className="text-[11px] font-mono text-neon-cyan">EDGE: {latency}ms</span>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {pilot ? (
              <Link
                to="/profile"
                className="px-2 py-1 rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-[11px] font-mono font-bold"
              >
                {pilot.callsign}
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-2 py-1 rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-[11px] font-mono font-bold"
              >
                Enlist
              </Link>
            )}
            <Link
              to="/controller"
              className="px-2 py-1 rounded bg-neon-magenta/20 border border-neon-magenta text-neon-magenta text-[11px] font-mono font-bold"
            >
              HOTAS
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-1">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 font-mono text-xs">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 px-3 rounded tracking-wider uppercase ${
                location.pathname === link.path ? 'bg-neon-cyan/20 text-neon-cyan font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {pilot ? (
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 rounded text-white font-bold bg-neon-cyan/15 border border-neon-cyan/40"
            >
              Pilot Dossier ({pilot.callsign}) &bull; 💎 {pilot.diamondsBalance}
            </Link>
          ) : (
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 rounded text-neon-cyan font-bold bg-neon-cyan/15 border border-neon-cyan/40"
            >
              Enlist Single Pilot Clearance (+500 Diamonds)
            </Link>
          )}
          <Link 
            to="/controller"
            onClick={() => setIsOpen(false)}
            className="block py-2 px-3 rounded text-neon-magenta font-bold bg-neon-magenta/15 border border-neon-magenta/40"
          >
            Launch Mobile HOTAS Controller
          </Link>
        </div>
      )}
    </nav>
  );
}
