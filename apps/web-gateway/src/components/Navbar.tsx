import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [latency, setLatency] = useState(14);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(10 + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Tech Matrix', path: '/tech' },
  ];

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/tachyon_logo_full.svg" alt="Tachyon" className="h-8 w-auto" onError={(e) => e.currentTarget.src = '/tachyon_logo_full.png'} />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-mono tracking-wider uppercase transition-colors ${
                  location.pathname === link.path 
                    ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 bg-obsidian border border-electric-blue/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,85,255,0.15)]">
              <Activity size={14} className="text-neon-cyan animate-pulse" />
              <span className="text-xs font-mono text-neon-cyan">EDGE: {latency}ms</span>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-obsidian border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-mono uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? 'text-neon-cyan bg-white/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-2 flex items-center space-x-2">
              <Activity size={16} className="text-neon-cyan animate-pulse" />
              <span className="text-sm font-mono text-neon-cyan">EDGE LATENCY: {latency}ms</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
