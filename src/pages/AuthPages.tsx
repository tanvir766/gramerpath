import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, initialMode, onClose, onSuccess }: AuthModalProps) {
  const { login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'লগইন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড দুটি মেলেনি (Passwords do not match)।');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await register(fullName, email, password, confirmPassword);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.forgotPassword(email);
      setSuccessMsg(res.message);
      if (res.demoCode) {
        setResetCode(res.demoCode);
      }
      setMode('reset');
    } catch (err: any) {
      setErrorMsg(err.message || 'কোড পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.resetPassword({
        email,
        resetCode,
        newPassword: password,
        confirmPassword,
      });
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'পাসওয়ার্ড রিসেট করা যায়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'admin') => {
    setIsLoading(true);
    try {
      await quickLogin(role);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/85 p-5 sm:p-8 max-h-[92dvh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <h2 className="font-classical text-xl sm:text-2xl font-semibold text-slate-800 font-bn">
            {mode === 'login' && 'লগইন করুন (Student Login)'}
            {mode === 'register' && 'নতুন অ্যাকাউন্ট খুলুন (Register)'}
            {mode === 'forgot' && 'পাসওয়ার্ড ভুলে গেছেন? (Forgot Password)'}
            {mode === 'reset' && 'পাসওয়ার্ড রিসেট করুন (Reset Password)'}
          </h2>
          <p className="text-xs text-slate-500 font-bn mt-1">
            {mode === 'login' && 'আপনার ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করুন।'}
            {mode === 'register' && 'বিনামূল্যে অ্যাকাউন্ট খুলে ব্যাকরণ শেখা শুরু করুন।'}
            {mode === 'forgot' && 'আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন।'}
            {mode === 'reset' && 'রিসেট কোড এবং নতুন পাসওয়ার্ড দিন।'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bn flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bn flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="student@grammarpath.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-[#1570CD] hover:text-[#1E82E6] hover:underline font-bn cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors shadow-xs cursor-pointer font-bn"
            >
              {isLoading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন (Log In)'}
            </button>

            {/* Quick Demo Access Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-center text-slate-500 font-bn">
                দ্রুত টেস্ট করার জন্য ডেমো অ্যাকাউন্ট ব্যবহার করুন:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="min-h-[40px] py-2 px-2 text-xs font-medium text-[#1570CD] bg-sky-50/75 hover:bg-sky-100/80 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                >
                  Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="min-h-[40px] py-2 px-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Demo Admin
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-600 font-bn">
              অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#1570CD] font-semibold hover:underline cursor-pointer"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name (সম্পূর্ণ নাম)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent font-bn"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="পুনরায় পাসওয়ার্ড দিন"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors shadow-xs cursor-pointer font-bn mt-2"
            >
              {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন (Register)'}
            </button>

            <div className="pt-2 text-center text-xs text-slate-600 font-bn">
              ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#1570CD] font-semibold hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="student@grammarpath.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer font-bn"
            >
              {isLoading ? 'কোড পাঠানো হচ্ছে...' : 'রিসেট কোড পান'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#1570CD] hover:underline font-bn cursor-pointer"
              >
                লগইনে ফিরে যান
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reset Code (রিসেট কোড)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="৬ অঙ্কের কোড (যেমন: 123456)"
                  value={resetCode}
                  onChange={e => setResetCode(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="নতুন পাসওয়ার্ড"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E82E6]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E82E6] hover:bg-[#1673D1] rounded-xl transition-colors cursor-pointer font-bn"
            >
              {isLoading ? 'সংরক্ষণ হচ্ছে...' : 'পাসওয়ার্ড নিশ্চিত করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
