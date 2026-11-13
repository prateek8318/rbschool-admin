import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Smartphone } from 'lucide-react';
import { authApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { routeAfterLogin } from '../lib/auth';
import type { LoginResult } from '../types';
import logoImage from '../assets/R. B. LOGO.png';

type Mode = 'password' | 'otp';

const RESEND_SECONDS = 30;

export const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign in · RB Education Admin';
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const finish = (result: LoginResult) => {
    const next = routeAfterLogin(result);
    if ('error' in next) {
      logout();
      setError(next.error);
      return;
    }
    setSession(result);
    navigate(next.to, { replace: true });
  };

  const run = async (action: () => Promise<void>) => {
    setIsLoading(true);
    setError('');
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = (event: React.FormEvent) => {
    event.preventDefault();
    run(async () => finish(await authApi.login(identifier.trim(), password)));
  };

  const sendOtp = (event?: React.FormEvent) => {
    event?.preventDefault();
    run(async () => {
      const result = await authApi.requestOtp(phone.trim());
      setOtpSent(true);
      setDevCode(result.devCode);
      setCooldown(RESEND_SECONDS);
    });
  };

  const verifyOtp = (event: React.FormEvent) => {
    event.preventDefault();
    run(async () => finish(await authApi.verifyOtp(phone.trim(), otp.trim())));
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const label = 'block text-sm font-medium text-slate-700 mb-1.5';
  const input = 'input-field h-11 px-3.5';

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      <div className="app-bg" aria-hidden />
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-slate-950 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src={logoImage} alt="" className="w-11 h-11 rounded-xl bg-white object-contain p-1" />
          <div>
            <div className="font-semibold">RB Education</div>
            <div className="text-xs text-slate-400">Institution management</div>
          </div>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">Run your school, college or coaching institute from one place.</h2>
          <ul className="mt-8 space-y-4 text-sm text-slate-300">
            {[
              'Admissions, teachers and parents',
              'Attendance, exams, results and report cards',
              'Fee plans, receipts and overdue tracking',
              'Invite-only access — only people you add can sign in',
            ].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-slate-500">© {new Date().getFullYear()} RB Education</div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md glass rounded-3xl p-6 sm:p-9 animate-pop-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoImage} alt="" className="w-10 h-10 rounded-xl object-contain ring-1 ring-slate-200" />
            <span className="font-semibold text-slate-900">RB Education</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1.5">Welcome back. Please enter your details.</p>

          <div className="grid grid-cols-2 gap-1 p-1 mt-8 mb-6 rounded-lg bg-slate-100">
            {([
              { id: 'password', text: 'Password', Icon: KeyRound },
              { id: 'otp', text: 'Mobile OTP', Icon: Smartphone },
            ] as const).map(({ id, text, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchMode(id)}
                className={`flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-colors ${
                  mode === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {text}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'password' && (
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className={label} htmlFor="identifier">Email or mobile number</label>
                <input id="identifier" className={input} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" autoFocus required />
              </div>
              <div>
                <label className={label} htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    className={`${input} pr-11`}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" className="h-11" isLoading={isLoading}>Sign in</Button>
            </form>
          )}

          {mode === 'otp' && !otpSent && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className={label} htmlFor="phone">Mobile number</label>
                <input id="phone" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="10-digit mobile number" autoFocus required />
                <p className="text-xs text-slate-500 mt-1.5">We'll send a one-time code. Only numbers added by your institution can sign in.</p>
              </div>
              <Button type="submit" fullWidth size="lg" className="h-11" isLoading={isLoading}>Send code</Button>
            </form>
          )}

          {mode === 'otp' && otpSent && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <p className="text-sm text-slate-600">
                Enter the 6-digit code sent to <span className="font-medium text-slate-900">{phone}</span>.{' '}
                <button type="button" className="font-medium text-indigo-600 hover:text-indigo-700" onClick={() => { setOtpSent(false); setOtp(''); }}>
                  Change
                </button>
              </p>
              {devCode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                  Test mode — your code is <span className="font-mono font-semibold">{devCode}</span>
                </div>
              )}
              <input
                className={`${input} text-center text-lg font-mono tracking-[0.6em]`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                aria-label="One-time code"
                autoFocus
                required
              />
              <Button type="submit" fullWidth size="lg" className="h-11" isLoading={isLoading} disabled={otp.length !== 6}>Verify and sign in</Button>
              <div className="text-center text-sm text-slate-500">
                {cooldown > 0 ? (
                  <>Resend code in {cooldown}s</>
                ) : (
                  <button type="button" className="font-medium text-indigo-600 hover:text-indigo-700" onClick={() => sendOtp()} disabled={isLoading}>
                    Resend code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
