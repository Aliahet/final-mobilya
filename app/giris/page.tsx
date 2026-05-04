'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const lockoutTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Validate redirect to prevent open-redirect attacks — only allow internal paths
  const rawRedirect = searchParams.get('redirect') ?? '';
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/hesabim';

  useEffect(() => {
    return () => { if (lockoutTimer.current) clearInterval(lockoutTimer.current); };
  }, []);

  const startLockout = () => {
    setLockoutRemaining(LOCKOUT_SECONDS);
    lockoutTimer.current = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          clearInterval(lockoutTimer.current!);
          lockoutTimer.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isLockedOut = lockoutRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setFailedAttempts(0);
        startLockout();
        setError(`Çok fazla başarısız deneme. ${LOCKOUT_SECONDS} saniye bekleyin.`);
      } else {
        setError(
          error.message === 'Invalid login credentials'
            ? `E-posta veya şifre hatalı. (${next}/${MAX_ATTEMPTS} deneme)`
            : 'Bir hata oluştu. Lütfen tekrar deneyin.'
        );
      }
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-3xl tracking-tight text-charcoal">FINAL MOBİLYA</h1>
          </Link>
          <p className="mt-3 text-brown/70 text-sm tracking-wide">Hesabınıza giriş yapın</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-card p-8 border border-stone/30">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream/50 border border-stone/40 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-cream/50 border border-stone/40 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isLockedOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-charcoal text-white font-medium rounded-xl hover:bg-charcoal/90 disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLockedOut ? (
                `${lockoutRemaining}s bekleyin`
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-stone/30 text-center">
            <p className="text-sm text-brown/60">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-gold font-medium hover:text-gold-light transition-colors">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-charcoal/40" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
