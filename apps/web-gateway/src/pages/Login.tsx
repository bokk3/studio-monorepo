import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { hotasAudio } from '@/components/hotas/hotasAudio';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      hotasAudio.playTareChime();
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication rejected. Invalid pilot credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-md mx-auto flex flex-col justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-black/60 text-slate-400 text-xs font-mono mb-3">
          <ShieldCheck size={12} className="text-neon-cyan" />
          PILOT CLEARANCE ACCESS // 2026
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Authenticate <span className="text-neon-cyan">Pilot</span>
        </h1>
        <p className="text-slate-400 text-xs font-light">
          Verify credentials to access unified hangar inventory and cross-platform save states.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 font-mono text-xs flex items-center gap-3">
          <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card className="border-slate-800/90 bg-black/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white">Pilot Login</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Enter registered Star-League email and access passkey.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Comm-Link Email
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Access Passkey
              </label>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t border-slate-900 pt-4">
            <Button 
              type="submit"
              disabled={isSubmitting || !email || !password}
              variant="cyan"
              className="w-full h-10 font-mono text-xs font-bold gap-2"
            >
              {isSubmitting ? "Verifying Credentials..." : "Authenticate Clearance"}
              <ArrowRight size={14} />
            </Button>

            <div className="text-center text-xs font-mono text-slate-400">
              New pilot?{' '}
              <Link to="/register" className="text-neon-cyan hover:underline font-bold">
                Enlist Here (+500 Diamonds)
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
