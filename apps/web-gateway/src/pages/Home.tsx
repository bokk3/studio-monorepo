import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="z-10 flex flex-col items-center">
        <img 
          src="/tachyon_logo_full.svg" 
          alt="Tachyon Logo" 
          className="w-72 md:w-[400px] mb-10 drop-shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          onError={(e) => {
            e.currentTarget.src = '/tachyon_logo_full.png';
          }}
        />
        
        <div className="border border-neon-cyan/30 bg-black/60 backdrop-blur-sm p-10 rounded-3xl shadow-[0_0_40px_rgba(0,243,255,0.1)] max-w-2xl w-full">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse"></span>
            <span className="text-neon-cyan font-mono text-sm tracking-widest uppercase">&gt; Neural Link Established</span>
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
            Frictionless Play. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">Zero Latency.</span>
          </h1>
          
          <p className="text-gray-400 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
            We are pioneering the next generation of instantly accessible multiplayer experiences. United by edge networking and powered by AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/games"
              className="w-full sm:w-auto px-8 py-3 bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan font-mono text-sm uppercase tracking-widest rounded hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] font-bold"
            >
              Enter The Arena
            </Link>
            <Link 
              to="/tech"
              className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white/20 text-white font-mono text-sm uppercase tracking-widest rounded hover:border-white/50 transition-all"
            >
              View Matrix
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

