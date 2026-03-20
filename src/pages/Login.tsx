import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { GraduationCap, Lock, Mail, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import logoImage from '../assets/R. B. LOGO.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAuth({ id: '1', name: 'Admin', email, role: 'ADMIN' }, 'dummy-token');
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-emerald-400/60 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-indigo-400/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-teal-400/60 rounded-full animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '3.2s' }} />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-cyan-600/30" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(16,185,129,0.1)_50%,transparent_100%)]" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mb-8 mx-auto transform hover:scale-110 transition-all duration-500 hover:rotate-3 relative">
                  <img 
                    src={logoImage} 
                    alt="RB School Logo" 
                    className="w-full h-full rounded-3xl shadow-2xl shadow-emerald-500/40 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                    <GraduationCap className="w-14 h-14 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-black text-white mb-4 animate-fade-in-up">
                 RB KENDRIYA VIDYALAYA
                </h1>
                <p className="text-emerald-100 text-lg mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>SIDHAUT GAZIPUR</p>
                <div className="flex items-center justify-center gap-2 text-emerald-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure & Reliable</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-200 mt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">Modern & Efficient</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-16 h-16 border-2 border-emerald-400/30 rounded-full animate-pulse" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/3 right-8 w-8 h-8 border-2 border-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/3 left-8 w-6 h-6 border-2 border-teal-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12">
              <div className="max-w-sm mx-auto">
                {/* Logo for mobile */}
                <div className="md:hidden flex justify-center mb-8">
                  <div className="w-16 h-16 transform hover:scale-110 transition-all duration-500 relative">
                    <img 
                      src={logoImage} 
                      alt="RB School Logo" 
                      className="w-full h-full rounded-2xl shadow-xl shadow-emerald-500/30 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">Welcome Back</h2>
                  <p className="text-emerald-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Sign in to access your dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors duration-300" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15 group-hover:border-emerald-400/50"
                      />
                    </div>

                    <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors duration-300" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15 group-hover:border-emerald-400/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <label className="flex items-center text-emerald-200 hover:text-white transition-all duration-300 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-white/30 rounded bg-white/10 transition-all duration-300 group-hover:border-emerald-400/50"
                      />
                      <span className="ml-2 text-sm group-hover:text-white">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-emerald-200 hover:text-white transition-all duration-300 transform hover:scale-105">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-emerald-500/50 animate-fade-in-up"
                    style={{ animationDelay: '0.5s' }}
                    isLoading={isLoading}
                    size="lg"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <p className="text-emerald-200 text-sm">
                    © 2025 RB School. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
