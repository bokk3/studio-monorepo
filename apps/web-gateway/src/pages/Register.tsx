import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  QrCode,
  Sparkles,
  Lock,
  Mail,
  User,
  Radio,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { checkCallsignAvailability, type PilotProfile } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { hotasAudio } from '@/components/hotas/hotasAudio';

export default function Register() {
  const navigate = useNavigate();
  const { register, pilot: existingPilot } = useAuth();

  // Enlistment Form State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [faction, setFaction] = useState<'Aero-Dynamics' | 'Vanguard' | 'Solar Pulse'>('Aero-Dynamics');

  // Validation & Processing State
  const [callsignStatus, setCallsignStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedPilot, setIssuedPilot] = useState<PilotProfile | null>(existingPilot);

  // Debounced Callsign Availability Scanner
  useEffect(() => {
    if (!callsign.trim() || callsign.length < 3) {
      setCallsignStatus('idle');
      return;
    }

    setCallsignStatus('checking');
    const timer = setTimeout(async () => {
      const isAvailable = await checkCallsignAvailability(callsign);
      setCallsignStatus(isAvailable ? 'available' : 'taken');
      if (isAvailable) hotasAudio.playDetentTick();
    }, 400);

    return () => clearTimeout(timer);
  }, [callsign]);

  // Calculate Password Entropy
  const getPasswordStrength = () => {
    if (!password) return { label: 'EMPTY', color: 'text-slate-500', width: '0%', barColor: 'bg-slate-700' };
    if (password.length < 6) return { label: 'COMPROMISED', color: 'text-rose-400', width: '25%', barColor: 'bg-rose-500' };
    if (password.length < 8) return { label: 'STANDARD CLEARANCE', color: 'text-amber-400', width: '60%', barColor: 'bg-amber-400' };
    return { label: 'MILITARY ENCRYPTED', color: 'text-emerald-400', width: '100%', barColor: 'bg-emerald-400 shadow-[0_0_10px_#10B981]' };
  };

  const strength = getPasswordStrength();

  // Handle Step 1 -> Step 2
  const handleProceedToCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (callsignStatus !== 'available') {
      setErrorMsg("Please select an available callsign frequency before continuing.");
      return;
    }
    setErrorMsg(null);
    hotasAudio.playTareChime();
    setStep(2);
  };

  // Handle Final Enlistment
  const handleCompleteEnlistment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Security clearance passkey must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPilot = await register({
        email,
        password,
        callsign,
        faction,
        referralCode: referralCode || undefined
      });
      setIssuedPilot(newPilot);
      hotasAudio.playTareChime();
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Pilot enlistment failed. Please verify credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const factions = [
    {
      name: "Aero-Dynamics",
      label: "AERO-DYNAMICS SYNDICATE",
      accent: "text-neon-cyan",
      border: "border-neon-cyan/40",
      bg: "bg-neon-cyan/5",
      specialty: "High-Velocity Magnus Curve Specialists & Fluid Flight"
    },
    {
      name: "Vanguard",
      label: "VANGUARD DEFENSE FLEET",
      accent: "text-blue-400",
      border: "border-blue-500/40",
      bg: "bg-blue-500/5",
      specialty: "Deep-Space 6-DOF Naval Artillery & Heavy Interceptors"
    },
    {
      name: "Solar Pulse",
      label: "SOLAR PULSE MERCENARIES",
      accent: "text-neon-magenta",
      border: "border-neon-magenta/40",
      bg: "bg-neon-magenta/5",
      specialty: "Overdrive Kinetic Burst & Mobile Gyro Dogfighting"
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto flex flex-col justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-neon-magenta/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00F3FF] animate-pulse" />
          STAR-LEAGUE REGISTRATION TERMINAL // 2026
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Single Pilot <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta">Clearance</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-light">
          Enlist into the Tachyon universe. One clearance ID grants seamless cross-progression, shared inventory, and diamond balances across Web, Mobile, and AAA titles.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-3 mt-6 font-mono text-xs">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step >= 1 ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-slate-800 text-slate-500'}`}>
            <span>1. Callsign & Faction</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step >= 2 ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-slate-800 text-slate-500'}`}>
            <span>2. Credentials</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step === 3 ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500'}`}>
            <span>3. Clearance Card</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 font-mono text-xs flex items-center gap-3 max-w-xl mx-auto">
          <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Callsign & Faction Selection */}
      {step === 1 && (
        <Card className="border-slate-800/90 bg-black/60 backdrop-blur-md max-w-2xl mx-auto w-full">
          <CardHeader>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase">ENLISTMENT STEP 01</span>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/30">
                HIGH CONCURRENCY READY
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Select Callsign & Combat Faction</CardTitle>
            <CardDescription className="text-slate-400">
              Your callsign is your immutable tactical handle across all Tachyon arenas and global leaderboards.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Callsign Input with Real-time Scanner */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Pilot Callsign (3-20 Characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                  placeholder="e.g. VIPER-01, NEO_PHANTOM"
                  maxLength={20}
                  className="w-full pl-10 pr-32 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-neon-cyan transition-colors"
                />

                {/* Callsign Scanner Status Badge */}
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {callsignStatus === 'checking' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                      <Radio size={11} className="animate-spin" />
                      Scanning...
                    </span>
                  )}
                  {callsignStatus === 'available' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={11} />
                      Available
                    </span>
                  )}
                  {callsignStatus === 'taken' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/30">
                      Occupied
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 block">
                Allowed: Uppercase letters, numbers, hyphens, and underscores.
              </span>
            </div>

            {/* Faction Cards */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Allegiance / Theater Faction
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {factions.map((f) => (
                  <div
                    key={f.name}
                    onClick={() => {
                      setFaction(f.name as any);
                      hotasAudio.playDetentTick();
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      faction === f.name 
                        ? `${f.border} ${f.bg} shadow-[0_0_15px_rgba(0,243,255,0.15)] ring-1 ring-neon-cyan` 
                        : 'border-slate-800 bg-slate-950/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className={`text-[11px] font-bold block mb-1 font-mono ${f.accent}`}>{f.label}</span>
                    <p className="text-[10px] text-slate-400 font-light leading-relaxed">{f.specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-slate-900 pt-4">
            <Link to="/login" className="text-xs font-mono text-slate-400 hover:text-white">
              Already have pilot clearance? Log In
            </Link>
            <Button 
              onClick={handleProceedToCredentials}
              disabled={callsignStatus !== 'available'}
              variant="cyan"
              className="gap-2 font-mono text-xs font-bold"
            >
              Continue to Credentials
              <ArrowRight size={14} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Security Credentials */}
      {step === 2 && (
        <Card className="border-slate-800/90 bg-black/60 backdrop-blur-md max-w-2xl mx-auto w-full">
          <CardHeader>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase">ENLISTMENT STEP 02</span>
              <span className="text-[10px] font-mono text-slate-400">CALLSIGN: <strong className="text-neon-cyan">{callsign}</strong></span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Security Clearance Passkey</CardTitle>
            <CardDescription className="text-slate-400">
              Establish pilot comm-link credentials and enter optional Founder referral token.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Comm-Link Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@starleague.space"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
            </div>

            {/* Password with Entropy Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                  Access Passkey
                </label>
                <span className={`text-[10px] font-mono font-bold ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              {/* Strength Bar */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                <div className={`h-full transition-all duration-300 ${strength.barColor}`} style={{ width: strength.width }} />
              </div>
            </div>

            {/* Referral / Founder Code */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  Founder Referral Code (Optional)
                </label>
                <span className="text-[10px] font-mono text-amber-400 font-bold">+250 BONUS DIAMONDS</span>
              </div>
              <input 
                type="text" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. TACH-A8F2"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-800 text-amber-300 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-500 font-light">
                Entering a valid squad referral code credits an immediate 250 bonus Diamonds to your initial vault.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-slate-900 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
              className="text-xs font-mono border-slate-800"
            >
              Back to Step 1
            </Button>
            <Button 
              onClick={handleCompleteEnlistment}
              disabled={isSubmitting || !email || password.length < 6}
              variant="cyan"
              className="gap-2 font-mono text-xs font-bold"
            >
              {isSubmitting ? "Provisioning Clearance..." : "Confirm & Issue Clearance"}
              <ShieldCheck size={15} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Holographic Clearance ID Card Preview */}
      {step === 3 && issuedPilot && (
        <div className="space-y-6 max-w-xl mx-auto w-full">
          <div className="text-center">
            <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 mb-2 gap-1.5 py-1 px-3">
              <CheckCircle2 size={13} />
              CLEARANCE ISSUED &bull; PILOT REGISTERED
            </Badge>
            <h2 className="text-2xl font-bold text-white">Welcome to Tachyon Studios</h2>
          </div>

          {/* Holographic Carbon-Fiber Pilot ID Card */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-black to-slate-950 border-2 border-neon-cyan/50 shadow-[0_0_50px_rgba(0,243,255,0.25)] font-mono overflow-hidden">
            {/* Holographic Watermark Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none animate-pulse" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] text-neon-cyan tracking-widest block mb-0.5">TACHYON AEROSPACE DEFENSE</span>
                <span className="text-xl sm:text-2xl font-black text-white tracking-wider">{issuedPilot.callsign}</span>
                <span className="text-xs text-slate-400 block mt-0.5 font-light">{issuedPilot.email}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <Award size={26} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6 py-4 border-y border-slate-800/90 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Rank / Rating</span>
                <strong className="text-white font-bold">{issuedPilot.rankTier}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Clearance Level</span>
                <strong className="text-neon-cyan font-bold">{issuedPilot.clearanceLevel}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Faction Enlistment</span>
                <strong className="text-neon-magenta font-bold">{issuedPilot.faction}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Founder Status</span>
                <strong className="text-amber-400 font-bold">VERIFIED FOUNDER</strong>
              </div>
            </div>

            {/* Starting Vault Assets */}
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-neon-cyan" />
                <span className="text-[11px] text-slate-300">STARTER VAULT BALANCE:</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-neon-cyan">💎 {issuedPilot.diamondsBalance} Diamonds</span>
                <span className="text-amber-400">🪙 {issuedPilot.goldBalance} Credits</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <QrCode size={14} className="text-slate-400" />
                <span>REFERRAL ID: <code className="text-slate-300 font-bold">{issuedPilot.referralCode}</code></span>
              </div>
              <span>SINGLE PILOT PASS &copy; 2026</span>
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/games')}
              variant="cyan"
              className="flex-1 h-12 text-sm font-bold gap-2"
            >
              Enter The Games Arena
              <ArrowRight size={16} />
            </Button>

            <Button
              onClick={() => navigate('/controller')}
              variant="outline"
              className="flex-1 h-12 text-sm font-bold gap-2 border-slate-800 hover:border-neon-magenta hover:text-neon-magenta"
            >
              Launch Mobile HOTAS
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
