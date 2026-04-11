import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Store, Sparkles, ShieldCheck, Zap } from "lucide-react";

interface StoreLoginProps {
  onLogin: () => void;
}

export function StoreLogin({ onLogin }: StoreLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onLogin();
    setIsLoading(false);
  };

  

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-12">
            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-zinc-950/20">
              <Store className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">Manager Portal</h1>
            <p className="text-zinc-500 font-medium">Enter your store credentials to initialize the terminal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@store.com"
                  className="pl-12 h-14 bg-zinc-50 border-zinc-200 focus:bg-white text-lg rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Password</Label>
                <button type="button" className="text-xs font-bold text-orange-600 hover:text-orange-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-14 bg-zinc-50 border-zinc-200 focus:bg-white text-lg rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-lg rounded-xl shadow-xl shadow-zinc-950/10 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Authenticating...
                </span>
              ) : "Sign In to Terminal"}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex gap-4">
              <ShieldCheck className="w-5 h-5 text-zinc-300" />
              <Zap className="w-5 h-5 text-zinc-300" />
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Lumina OS v2.4</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Branding */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#f97316_0%,transparent_50%)] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#ea580c_0%,transparent_40%)] blur-[100px]" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0 }}
          >
            <div className="w-24 h-24 bg-orange-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20 rotate-12">
              <span className="text-white text-5xl font-black">L</span>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-none mb-4">
              LUMINA<br /><span className="text-orange-500">POS</span>
            </h2>
            <p className="text-zinc-400 text-xl font-medium leading-relaxed">
              The next generation of point-of-sale intelligence. Fast, secure, and built for scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
              <p className="text-orange-500 font-bold text-2xl mb-1">99.9%</p>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Uptime Guaranteed</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
              <p className="text-orange-500 font-bold text-2xl mb-1">&lt; 50ms</p>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Response Time</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-12 right-12 text-zinc-800 font-mono text-xs tracking-widest uppercase">
          Terminal ID: LMN-882-PX
        </div>
      </div>
    </div>
  );
}

