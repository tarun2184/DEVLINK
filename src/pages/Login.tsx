import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CodeXmlIcon, EyeIcon, EyeOffIcon, LockKeyholeIcon, MailIcon, Loader2Icon, CheckCircle2Icon, UserIcon, BriefcaseIcon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { Role } from '../types';

export function Login() {
  const { login, signInWithSupabase, signUpWithSupabase, resetPassword, setRole, isDemoMode } = useAppStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (!isForgotPassword && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    const redirectPath = selectedRole === 'developer' ? '/developer' : '/client';

    if (isForgotPassword) {
      try {
        const { error: resetError } = await resetPassword(normalizedEmail);
        if (resetError) {
          setError(resetError);
        } else {
          setSuccessMessage('Password reset link sent to your email!');
        }
      } catch (e) {
        setError('Unexpected error during password reset request.');
        console.error(e);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (isCreatingAccount) {
        const { error: signUpError } = await signUpWithSupabase(normalizedEmail, password);
        if (signUpError) {
          setError(signUpError);
          setLoading(false);
          return;
        }
        setRole(selectedRole);
        setSuccessMessage(isDemoMode ? 'Demo account created! Redirecting...' : 'Account created! Redirecting...');
        setTimeout(() => navigate(redirectPath, { replace: true }), 1000);
      } else {
        const { error: signInError } = await signInWithSupabase(normalizedEmail, password);
        if (signInError) {
          setError(signInError);
          setLoading(false);
          return;
        }
        setRole(selectedRole);
        navigate(redirectPath, { replace: true });
      }
    } catch (e) {
      setError('Unexpected error during authentication.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="w-full max-w-md">
        
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <CodeXmlIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to DevLink
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Connecting talented developers with clients worldwide.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedRole('client')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              selectedRole === 'client'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}>
            <UserIcon className="h-4 w-4" />
            Client Portal
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('developer')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              selectedRole === 'developer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}>
            <BriefcaseIcon className="h-4 w-4" />
            Developer Portal
          </button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="sign-in-title">
          <div className="flex items-center justify-between">
            <h2 id="sign-in-title" className="text-xl font-bold text-slate-900">
              {isForgotPassword 
                ? 'Reset Password' 
                : isCreatingAccount 
                  ? `Sign up as ${selectedRole === 'developer' ? 'Developer' : 'Client'}` 
                  : `Sign in as ${selectedRole === 'developer' ? 'Developer' : 'Client'}`}
            </h2>
            {!isDemoMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase Auth
              </span>
            )}
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Demo Mode
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {isForgotPassword 
              ? 'Enter your email address and we will send you a password reset link.'
              : selectedRole === 'developer' 
                ? 'Access your developer dashboard, projects & history.'
                : 'Browse developers, view portfolios & send project inquiries.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
              <span className="relative block">
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  disabled={loading}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="auth-field pl-10 disabled:bg-slate-100 disabled:opacity-75"
                  aria-invalid={Boolean(error)} />
              </span>
            </label>

            {!isForgotPassword && (
              <label className="block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="block text-sm font-medium text-slate-700">Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </button>
                </div>
                <span className="relative block">
                  <LockKeyholeIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={password}
                    disabled={loading}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="At least 6 characters"
                    className="auth-field px-10 disabled:bg-slate-100 disabled:opacity-75"
                    aria-invalid={Boolean(error)} />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </span>
              </label>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {successMessage && (
              <p role="status" className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                {successMessage}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-sm">
              {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {isForgotPassword 
                ? 'Send Password Reset Link' 
                : isCreatingAccount 
                  ? `Create ${selectedRole === 'developer' ? 'Developer' : 'Client'} Account` 
                  : `Sign in to ${selectedRole === 'developer' ? 'Developer' : 'Client'} Portal`}
            </button>

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                  setSuccessMessage('');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Back to sign in
              </button>
            )}
          </form>

          {!isForgotPassword && (
            <>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsCreatingAccount((current) => !current);
                  setError('');
                  setSuccessMessage('');
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50">
                
                {isCreatingAccount ? 'I already have an account' : 'Create an account'}
              </button>
            </>
          )}

          <p className="mt-5 text-center text-xs text-slate-400">
            {!isDemoMode
              ? 'Connected to Supabase Authentication backend.'
              : 'Enter any email and a 6+ character password.'}
          </p>
        </section>
      </motion.div>
      <style>{`.auth-field{width:100%;border-radius:.75rem;border:1px solid #e2e8f0;padding-top:.65rem;padding-bottom:.65rem;font-size:.875rem;color:#0f172a;outline:none}.auth-field:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}`}</style>
    </main>
  );
}