import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function SignInPage({ onNavigate }) {
  const { signIn, loading, error, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      onNavigate('dashboard');
    } catch (err) {
      // Handled in authContext
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@scholastic.com');
    setPassword('adminpassword123');
    setError(null);
  };

  return (
    <div className="auth-page-container">
      <div className="scholastic-card">
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access student performance rankings & analytics</p>
        </div>

        {error && (
          <div className="alert alert-danger" id="signin-alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="input-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="input-email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@scholastic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="input-password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }} 
            disabled={loading}
            id="btn-submit-signin"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Seed Admin Fill */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ Automatic Seeder Quick Test
          </div>
          <button 
            type="button" 
            className="btn btn-outlined btn-sm" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleFillAdmin}
            id="btn-fill-admin-seed"
          >
            <ShieldCheck size={14} style={{ color: 'var(--color-primary)' }} />
            Fill Seeded Admin (`admin@scholastic.com`)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <span 
            style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => onNavigate('signup')}
            id="link-goto-signup"
          >
            Create an Account
          </span>
        </div>
      </div>
    </div>
  );
}
