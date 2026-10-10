import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Check, 
  Copy, 
  LogOut, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Cpu, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { hotasAudio } from '@/components/hotas/hotasAudio';

export default function Profile() {
  const navigate = useNavigate();
  const { pilot, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!pilot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 max-w-md w-full space-y-4 font-mono">
          <ShieldCheck size={36} className="text-neon-cyan mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">No Active Pilot Clearance</h2>
          <p className="text-xs text-slate-400 font-light">
            You must enlist or authenticate your pilot credentials to access the hangar dossier.
          </p>
          <div className="flex gap-2">
            <Link to="/register" className="flex-1">
              <Button variant="cyan" className="w-full text-xs font-bold">Enlist Pilot</Button>
            </Link>
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full text-xs border-slate-800">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/register?ref=${pilot.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    hotasAudio.playTareChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto space-y-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
              CLEARANCE VERIFIED // STATUS ACTIVE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Pilot Dossier: <span className="text-neon-cyan">{pilot.callsign}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-slate-800 text-slate-400 hover:text-rose-400 font-mono text-xs gap-1.5"
          >
            <LogOut size={13} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Holographic Clearance Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-black to-slate-950 border-2 border-neon-cyan/50 shadow-[0_0_50px_rgba(0,243,255,0.2)] font-mono overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] text-neon-cyan tracking-widest block mb-0.5">TACHYON AEROSPACE COMMAND</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-wider">{pilot.callsign}</span>
            <span className="text-xs text-slate-400 block mt-0.5 font-light">{pilot.email}</span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block">Pilot Rating</span>
              <strong className="text-sm font-bold text-white">{pilot.rankTier}</strong>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-800/90 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-900">
            <span className="text-[9px] text-slate-500 block uppercase">Clearance ID</span>
            <strong className="text-neon-cyan font-bold">{pilot.clearanceLevel}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-900">
            <span className="text-[9px] text-slate-500 block uppercase">Enlisted Faction</span>
            <strong className="text-neon-magenta font-bold">{pilot.faction}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-900">
            <span className="text-[9px] text-slate-500 block uppercase">Hard Diamonds</span>
            <strong className="text-cyan-300 font-bold">💎 {pilot.diamondsBalance}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-900">
            <span className="text-[9px] text-slate-500 block uppercase">Soft Credits</span>
            <strong className="text-amber-400 font-bold">🪙 {pilot.goldBalance}</strong>
          </div>
        </div>

        {/* Referral Program Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-neon-cyan/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles size={14} className="text-amber-400" />
              <span>Pilot Recruitment Frequency (+250 Diamonds per Recruit)</span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">
              Share your squad referral link. Both you and your recruit receive 250 bonus diamonds upon clearance issuance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 rounded-lg bg-black border border-slate-800 text-amber-300 text-xs font-bold">
              {pilot.referralCode}
            </code>
            <Button
              size="sm"
              variant="cyan"
              onClick={handleCopyReferral}
              className="text-xs font-bold gap-1.5 h-8"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? "Copied Link" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>

      {/* Cross-Game Progression Fleet */}
      <section className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h2 className="text-xs tracking-widest text-neon-cyan uppercase">Unified Ecosystem Title Status</h2>
          <span className="text-[11px] text-slate-500">PLAY ANYWHERE &bull; PROGRESS EVERYWHERE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Game 1 */}
          <Card className="border-slate-800 bg-black/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Globe size={18} className="text-neon-cyan" />
                <Badge variant="cyan" className="text-[9px]">SYNCED</Badge>
              </div>
              <CardTitle className="text-base text-white">Astro-Smash: Arena</CardTitle>
              <CardDescription className="text-xs">Web F2P Browser Client</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Hangar Airframe:</span>
                <strong className="text-white">Aero Interceptor Mk I</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Battle Pass Rank:</span>
                <strong className="text-neon-cyan">Tier 1 Recruit</strong>
              </div>
              <Link to="/games">
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs border-slate-800 gap-1">
                  Launch Web Client <ArrowRight size={12} />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Game 2 */}
          <Card className="border-slate-800 bg-black/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Smartphone size={18} className="text-neon-magenta" />
                <Badge variant="magenta" className="text-[9px]">PAIRED</Badge>
              </div>
              <CardTitle className="text-base text-white">Orbit Runner: Gyro</CardTitle>
              <CardDescription className="text-xs">Mobile F2P Motion PWA</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Companion HOTAS:</span>
                <strong className="text-white">6-DOF Gyro Active</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Sensor Calibration:</span>
                <strong className="text-neon-magenta">Zero-Lock Ready</strong>
              </div>
              <Link to="/controller">
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs border-slate-800 gap-1">
                  Open HOTAS PWA <ArrowRight size={12} />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Game 3 */}
          <Card className="border-slate-800 bg-black/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Cpu size={18} className="text-blue-400" />
                <Badge variant="cobalt" className="text-[9px]">RESERVED</Badge>
              </div>
              <CardTitle className="text-base text-white">Vanguard: Outer War</CardTitle>
              <CardDescription className="text-xs">AAA Steam & Console</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Founder Pre-Order:</span>
                <strong className="text-white">Eligible Alpha</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Prestige Skin:</span>
                <strong className="text-blue-400">Founder Obsidian Hull</strong>
              </div>
              <Link to="/games">
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs border-slate-800 gap-1">
                  View Specifications <ArrowRight size={12} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
