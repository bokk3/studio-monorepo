import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="z-10 flex flex-col items-center">
        <img 
          src="/tachyon_logo_full.svg" 
          alt="Tachyon Logo" 
          className="w-48 md:w-64 mb-8 drop-shadow-[0_0_15px_rgba(255,0,255,0.3)] opacity-50"
          onError={(e) => {
            e.currentTarget.src = '/tachyon_logo_full.png';
          }}
        />
        
        <div className="border border-neon-magenta/30 bg-black/60 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.15)] max-w-lg w-full">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-ping"></span>
            <span className="text-neon-magenta font-mono text-sm tracking-widest uppercase">&gt; Error 404</span>
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-ping"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Connection Lost
          </h1>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            The neural link to this sector has been severed. The coordinate you specified does not exist in our system registry.
          </p>
          
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan font-mono text-sm uppercase tracking-widest rounded hover:bg-neon-cyan/10 transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
            Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  )
}
