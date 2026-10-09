import { Server, Zap, Cpu } from 'lucide-react';

export default function TechMatrix() {
  const techs = [
    {
      title: "Zero-Cost Edge Matchmaking",
      icon: <Server className="w-8 h-8 text-neon-cyan" />,
      description: "Matchmaking handled entirely via Cloudflare Edge Workers. No dedicated servers, zero idle compute costs, and routing nearest to the player.",
      color: "from-neon-cyan to-blue-500"
    },
    {
      title: "16-Byte WebRTC Binary Packets",
      icon: <Zap className="w-8 h-8 text-neon-magenta" />,
      description: "State-of-the-art compression algorithm transmitting physics delta-states via ultra-fast, zero-friction UDP DataChannels.",
      color: "from-neon-magenta to-purple-500"
    },
    {
      title: "AI CAD-to-Mesh Pipelines",
      icon: <Cpu className="w-8 h-8 text-electric-blue" />,
      description: "Dynamically generating optimal Level of Detail (LOD) and collision hulls from procedural geometries and NURBS surfaces.",
      color: "from-electric-blue to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen p-8 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto z-10 w-full mt-12">
        <div className="text-center mb-16">
          <span className="text-neon-cyan font-mono text-sm tracking-widest uppercase mb-4 block">&gt; Infrastructure</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            The Tech Matrix
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our backbone is designed for absolute efficiency. By leveraging edge computing and peer-to-peer topologies, we deliver AAA experiences directly in the browser with near-zero overhead.
          </p>
        </div>

        <div className="space-y-8">
          {techs.map((tech, idx) => (
            <div 
              key={idx} 
              className="group relative bg-black/50 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-colors overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${tech.color} transition-opacity duration-500`}></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{tech.title}</h2>
                  <p className="text-gray-400 leading-relaxed">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 border border-electric-blue/30 bg-electric-blue/5 rounded-xl text-center">
          <p className="font-mono text-sm text-electric-blue uppercase tracking-widest">
            System Status: Optimal & Online
          </p>
        </div>
      </div>
    </div>
  );
}
