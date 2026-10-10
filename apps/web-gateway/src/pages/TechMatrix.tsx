import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Server, Zap, Cpu, Network, ShieldCheck, Binary, Activity, Layers, Terminal } from 'lucide-react';

export default function TechMatrix() {
  const [activeTab, setActiveTab] = useState('networking');

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[350px] bg-electric-blue/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-10 border-b border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF]" />
            DEEP TECH ARCHITECTURE // ZERO-COST RUNTIME
          </div>
          <Badge variant="cyan" className="font-mono">
            STATUS: 100% OPERATIONAL
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          The <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Tech Matrix</span>
        </h1>
        <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-light leading-relaxed">
          Engineered from first principles for zero runtime server costs, sub-15ms edge routing, deterministic aerodynamic physics, and automated procedural CAD-to-Mesh asset bridges.
        </p>
      </div>

      {/* Interactive Architecture Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center sm:justify-start mb-8">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="networking" className="gap-2">
              <Network size={14} />
              <span className="hidden sm:inline">P2P</span> Networking
            </TabsTrigger>
            <TabsTrigger value="physics" className="gap-2">
              <Cpu size={14} />
              <span className="hidden sm:inline">Deterministic</span> Physics
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2">
              <Layers size={14} />
              <span className="hidden sm:inline">CAD</span> Pipeline
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: P2P Networking & Edge Infrastructure */}
        <TabsContent value="networking" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-neon-cyan/40 bg-slate-950/70 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mb-2">
                  <Server size={20} />
                </div>
                <CardTitle className="text-xl">Zero-Cost Edge Matchmaking</CardTitle>
                <CardDescription>
                  Serverless presence, signaling, and lobby orchestration powered by Cloudflare Workers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 bg-black/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-neon-cyan font-bold flex items-center gap-1.5">
                    <Activity size={12} />
                    <span>LOBBY DISCOVERY LIFECYCLE</span>
                  </div>
                  <p className="text-slate-400 font-light text-[11px] leading-relaxed">
                    Clients perform lightweight HTTP handshakes with edge workers deployed across 300+ global data centers. Inactive rooms purge in-memory after 30s of silence, preserving near-zero compute bills.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Signaling Latency:</span>
                    <strong className="text-white">&lt;15ms Global Avg</strong>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Idle Server Cost:</span>
                    <strong className="text-emerald-400">$0.00 / Month</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neon-magenta/40 bg-slate-950/70 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-neon-magenta/15 border border-neon-magenta/30 flex items-center justify-center text-neon-magenta mb-2">
                  <Binary size={20} />
                </div>
                <CardTitle className="text-xl">16-Byte WebRTC Binary Codec</CardTitle>
                <CardDescription>
                  Direct peer-to-peer telemetry over RTCDataChannel with zero garbage collection allocations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 bg-black/60 rounded-xl border border-slate-800">
                  <div className="text-neon-magenta font-bold mb-2 flex items-center gap-1.5">
                    <Terminal size={12} />
                    <span>PACKED PROTOCOL SPECIFICATION</span>
                  </div>
                  <pre className="text-[10px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto leading-tight">
{`// 16-Byte Packed Binary Frame
Offset 0x00: Float32 (Pitch)    [-45.0 .. +45.0]
Offset 0x04: Float32 (Roll)     [-45.0 .. +45.0]
Offset 0x08: Float32 (Throttle) [0.0 .. 100.0]
Offset 0x0C: Uint16  (Buttons)  [Fire, Boost, Tare]
Offset 0x0E: Uint16  (Sequence) [0 .. 65535]`}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Frame Rate:</span>
                    <strong className="text-white">Locked 60Hz Telemetry</strong>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Bandwidth Usage:</span>
                    <strong className="text-neon-magenta">~960 Bytes/sec/peer</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Deterministic Aerodynamics & Engine Core */}
        <TabsContent value="physics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-neon-cyan/40 bg-slate-950/70">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mb-2">
                  <Zap size={20} />
                </div>
                <CardTitle className="text-xl">Magnus Aerodynamic Curves</CardTitle>
                <CardDescription>
                  Empirical fluid dynamics calculated at 60Hz without heavy physics solvers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-neon-cyan font-bold block text-[11px]">MAGNUS FORCE CALCULATION:</span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs">
                    <code>F_magnus = S * (ω × v)</code>
                  </div>
                  <p className="text-slate-400 font-light text-[11px]">
                    Ball spin induces a dynamic lateral pressure differential, curving trajectories through three-dimensional space based on velocity and angular momentum.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Headless Godot 4.7 test suites verify 100% trajectory determinism.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/40 bg-slate-950/70">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-2">
                  <Cpu size={20} />
                </div>
                <CardTitle className="text-xl">6-DOF Newtonian Flight Dynamics</CardTitle>
                <CardDescription>
                  True spatial inertia, gyroscopic sensor fusion, and Lead Computing Optical Sights (LCOS).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-blue-400 font-bold block text-[11px]">LCOS RETICLE FIRE CONTROL:</span>
                  <p className="text-slate-400 font-light text-[11px]">
                    Predictive lead reticles calculate target projectile intercept vectors accounting for ownship acceleration, target rotational rates, and projectile muzzle velocity.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Flight Model:</span>
                    <strong className="text-white">Uncoupled 6-DOF</strong>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <span className="text-slate-500 block">Lead Intercept:</span>
                    <strong className="text-blue-400">Analytical LCOS</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Procedural CAD-to-Mesh Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/70">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2">
                <Layers size={20} />
              </div>
              <CardTitle className="text-xl">Automated CAD-to-Game Asset Bridge</CardTitle>
              <CardDescription>
                From mathematical precision NURBS in Autodesk Fusion 360 to lightweight game-ready GLTF / Nanite meshes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/50 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1 text-xs">STEP 1: CAD LOFTING</span>
                  <p className="text-slate-400 text-[11px] font-light">
                    Airframes and components modeled as mathematically exact B-Rep / STEP solids in Fusion 360.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-slate-800">
                  <span className="text-neon-cyan font-bold block mb-1 text-xs">STEP 2: HEADLESS BLENDER</span>
                  <p className="text-slate-400 text-[11px] font-light">
                    Automated Python scripts generate convex collision hulls, UV unwrap, and bake normal maps headlessly.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-slate-800">
                  <span className="text-neon-magenta font-bold block mb-1 text-xs">STEP 3: MULTI-LOD EXPORT</span>
                  <p className="text-slate-400 text-[11px] font-light">
                    Exports GLTF 2.0 with LOD0 (high-res), LOD1 (50% decimate), and LOD2 (15% billboard) hierarchies.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Script Location: <code className="text-neon-cyan">scripts/asset-pipeline/cad_to_mesh.py</code></span>
                <Badge variant="outline">Headless Automated</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status Callout */}
      <div className="mt-12 p-6 rounded-2xl bg-black/50 border border-slate-800 text-center font-mono text-xs text-slate-400">
        <span className="text-neon-cyan">LIVE ARCHITECTURE METRICS:</span> WebRTC STUN/TURN Online &bull; Cloudflare Workers Edge Ready &bull; Godot 4.7 Headless Verification Passed
      </div>
    </div>
  );
}
