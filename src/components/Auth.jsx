import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, Zap } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Sign up new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Check if email confirmation is required
          if (authData.session) {
            // User is confirmed and logged in
            // Create profile for new user
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{
                id: authData.user.id,
                username: username || email.split('@')[0],
                class: 'Neural Alchemist',
                level: 14,
                xp: 0,
                stats: {
                  INT: 92,
                  WLT: 68,
                  STR: 75
                }
              }]);

            if (profileError) throw profileError;

            setMessage('Account created! Signing you in...');
            if (onAuthSuccess) onAuthSuccess(authData.user);
          } else {
            // Email confirmation required
            setMessage('Account created! Please check your email to confirm your account before signing in.');
            setIsSignUp(false);
          }
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage('Signed in successfully!');
        if (onAuthSuccess) onAuthSuccess(data.user);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(150deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(30deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(150deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(60deg, #33415577 25%, transparent 25.5%, transparent 75%, #33415577 75%, #33415577),
            linear-gradient(60deg, #33415577 25%, transparent 25.5%, transparent 75%, #33415577 75%, #33415577)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-400/50">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NEURAL ALCHEMIST</h1>
          <p className="text-cyan-400 font-mono text-sm">Life Gamification System</p>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-8 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded font-mono text-sm transition-all ${
                !isSignUp
                  ? 'bg-cyan-500 text-slate-900 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded font-mono text-sm transition-all ${
                isSignUp
                  ? 'bg-cyan-500 text-slate-900 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-slate-400 text-sm font-mono mb-2">
                  USERNAME
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your display name"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-sm font-mono mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-mono mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`p-3 rounded border font-mono text-sm ${
                message.includes('error') || message.includes('Error')
                  ? 'bg-red-500/10 border-red-400/50 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-400/50 text-emerald-400'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-900 font-mono font-bold py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-xs font-mono">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
