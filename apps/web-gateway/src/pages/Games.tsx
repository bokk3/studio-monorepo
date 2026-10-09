import { Monitor, Smartphone, Gamepad2 } from 'lucide-react';

export default function Games() {
  const games = [
    {
      title: "Astro-Smash: Arena",
      type: "Web F2P",
      status: "Beta",
      icon: <Monitor className="w-6 h-6 text-neon-cyan" />,
      description: "3v3 physics sports brawler featuring advanced Magnus curve aerodynamics.",
      badges: ["Three.js", "WebRTC", "Edge Sync"],
      borderColor: "border-neon-cyan/50",
      glowColor: "shadow-[0_0_20px_rgba(0,243,255,0.2)]"
    },
    {
      title: "Orbit Runner: Gyro Dash",
      type: "Mobile F2P",
      status: "In Development",
      icon: <Smartphone className="w-6 h-6 text-neon-magenta" />,
      description: "6-DOF endless vertical flight powered by physical phone gyro sensor fusion.",
      badges: ["Godot Mobile", "Sensor Fusion", "Zero-Latency"],
      borderColor: "border-neon-magenta/50",
      glowColor: "shadow-[0_0_20px_rgba(255,0,255,0.2)]"
    },
    {
      title: "Vanguard: The Outer War",
      type: "AAA Premium",
      status: "Pre-Alpha",
      icon: <Gamepad2 className="w-6 h-6 text-electric-blue" />,
      description: "Massive 32v32 cinematic space combat.",
      badges: ["Unreal Engine 5", "Serverless Matchmaking", "Cad-to-Mesh"],
      borderColor: "border-electric-blue/50",
      glowColor: "shadow-[0_0_20px_rgba(0,85,255,0.2)]"
    }
  ];

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto z-10">
        <div className="mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-blue">Titles</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Experience our next-generation interactive portfolio, leveraging edge compute and frictionless access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {games.map((game, idx) => (
            <div 
              key={idx} 
              className={`bg-black/40 backdrop-blur-sm border ${game.borderColor} ${game.glowColor} rounded-2xl p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  {game.icon}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono rounded-full uppercase tracking-wider">
                    {game.type}
                  </span>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${game.status === 'Beta' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></span>
                    {game.status}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">{game.title}</h2>
              <p className="text-gray-400 mb-8 flex-grow">{game.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {game.badges.map(badge => (
                  <span key={badge} className="px-2 py-1 bg-gray-900 border border-gray-800 text-gray-300 text-xs font-mono rounded">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
