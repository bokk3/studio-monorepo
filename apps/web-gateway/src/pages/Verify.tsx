import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  KeyRound,
  Radio
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { hotasAudio } from '@/components/hotas/hotasAudio';
import { supabase, isLiveSupabase } from '@/lib/supabase';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const { pilot } = useAuth();

  const [code, setCode] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || pilot?.email || '');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Check for one-click token verification via URL search params (e.g. ?token=... or ?status=verified)
  useEffect(() => {
    const token = searchParams.get('token');
    const urlStatus = searchParams.get('status');

    if (urlStatus === 'verified') {
      setStatus('verified');
      hotasAudio.playTareChime();
      return;
    }

    if (token) {
      verifyToken(token);
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    setStatus('verifying');
    setErrorMsg(null);

    try {
      if (isLiveSupabase && supabase) {
        // Supabase Token verification
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });
        if (error) throw error;
      }
      // Success
      setStatus('verified');
      hotasAudio.playTareChime();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Verification token has expired or is invalid.');
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setErrorMsg("Please enter the full 6-digit tactical clearance code.");
      return;
    }

    setStatus('verifying');
    setErrorMsg(null);

    try {
      if (isLiveSupabase && supabase) {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code.trim(),
          type: 'signup'
        });
        if (error) throw error;
      } else {
        // Local simulation test mode
        if (code === '749281' || code.length === 6) {
          // Success
        } else {
          throw new Error("Invalid tactical clearance code.");
        }
      }

      setStatus('verified');
      hotasAudio.playTareChime();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || "Invalid or expired 6-digit clearance code.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg("Please provide your registered comm-link email address.");
      return;
    }

    setResendStatus('sending');
    try {
      if (isLiveSupabase && supabase) {
        await supabase.auth.resend({
          type: 'signup',
          email: email.trim()
        });
      }
      setResendStatus('sent');
      hotasAudio.playDetentTick();
      setTimeout(() => setResendStatus('idle'), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to dispatch clearance email.");
      setResendStatus('idle');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-lg mx-auto flex flex-col justify-center relative overflow-hidden font-mono">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs mb-3">
          <ShieldCheck size={12} className="text-neon-cyan" />
          MILITARY FREQUENCY VERIFICATION // DUAL-MODE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Clearance <span className="text-neon-cyan">Verification</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-light">
          Authenticate your pilot frequency via 1-click token link or 6-digit tactical clearance code.
        </p>
      </div>

      {/* STATE 1: VERIFIED SUCCESS */}
      {status === 'verified' && (
        <Card className="border-emerald-500/40 bg-black/80 backdrop-blur-md text-center p-6 space-y-5 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 mb-2">
              COMMISSION CONFIRMED
            </Badge>
            <h2 className="text-xl font-bold text-white tracking-wider">Flight Clearance Approved</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
              Your comm-link frequency has been cryptographically verified. Cross-progression telemetry and starter diamond vaults are fully unlocked.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-500">Security Clearance:</span>
            <strong className="text-neon-cyan font-bold">VERIFIED TACHYON PILOT</strong>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link to="/games" className="flex-1">
              <Button variant="cyan" className="w-full text-xs font-bold gap-1.5 h-10">
                Enter Games Arena <ArrowRight size={13} />
              </Button>
            </Link>
            <Link to="/profile" className="flex-1">
              <Button variant="outline" className="w-full text-xs border-slate-800 h-10">
                View Pilot Dossier
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* STATE 2: VERIFYING PROGRESS */}
      {status === 'verifying' && (
        <Card className="border-neon-cyan/40 bg-black/80 backdrop-blur-md text-center p-8 space-y-4">
          <Radio size={36} className="text-neon-cyan mx-auto animate-spin" />
          <h2 className="text-lg font-bold text-white">Validating Clearance Token...</h2>
          <p className="text-xs text-slate-400 font-light">
            Performing cryptographic signature check against Fleet Command registry.
          </p>
        </Card>
      )}

      {/* STATE 3: 6-DIGIT CODE ENTRY FORM */}
      {(status === 'idle' || status === 'error') && (
        <Card className="border-slate-800/90 bg-black/70 backdrop-blur-md">
          <CardHeader>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-neon-cyan uppercase tracking-wider">TACTICAL CODE INPUT</span>
              <Badge variant="outline" className="text-[9px]">30-MIN VALIDITY</Badge>
            </div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound size={18} className="text-neon-cyan" />
              Enter 6-Digit Clearance Code
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Input the tactical code dispatched to your comm-link inbox by Tachyon Command.
            </CardDescription>
          </CardHeader>

          {errorMsg && (
            <div className="mx-6 mb-2 p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCodeSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Registered Comm-Link Email
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@starleague.space"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  6-Digit Clearance Code
                </label>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 749281"
                  className="w-full px-4 py-3 rounded-xl bg-black border-2 border-neon-cyan/50 text-neon-cyan text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.15)]"
                />
                <span className="text-[9px] text-slate-500 block text-center">
                  Tip: Check spam or dispatch queue if code does not arrive in 60s.
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-slate-900 pt-4">
              <Button
                type="submit"
                variant="cyan"
                disabled={code.length < 6}
                className="w-full h-10 text-xs font-bold gap-2"
              >
                Authenticate Clearance
                <ArrowRight size={14} />
              </Button>

              <div className="flex justify-between items-center text-[10px] w-full pt-1 text-slate-400">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="hover:text-neon-cyan transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={10} className={resendStatus === 'sending' ? "animate-spin" : ""} />
                  {resendStatus === 'sending' ? "Dispatching..." : resendStatus === 'sent' ? "Dispatched!" : "Resend Clearance Code"}
                </button>

                <Link to="/register" className="hover:text-white transition-colors">
                  Enlist New Callsign
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
