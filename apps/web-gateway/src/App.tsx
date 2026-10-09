export default function App() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="z-10 flex flex-col items-center">
        <img 
          src="/tachyon_logo_full.svg" 
          alt="Tachyon Logo" 
          className="w-64 md:w-96 mb-8 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          onError={(e) => {
            // Fallback in case SVG isn't working
            e.currentTarget.src = '/tachyon_logo_full.png';
          }}
        />
        
        <div className="border border-electric-blue/30 bg-black/60 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(0,85,255,0.15)] max-w-lg w-full">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse"></span>
            <span className="text-neon-cyan font-mono text-sm tracking-widest uppercase">&gt; System Initialization</span>
            <span className="h-2 w-2 rounded-full bg-neon-magenta animate-pulse"></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
            Work in Progress
          </h1>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            We are currently building our hyper-modern, zero-friction web portal. The next generation of interactive experiences is coming soon.
          </p>
          
          <div className="w-full bg-gray-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-1.5 rounded-full w-1/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
          </div>
          <div className="text-right text-xs font-mono text-gray-500">
            DEPLOYMENT: PENDING
          </div>
        </div>
      </div>
    </div>
  )
}
