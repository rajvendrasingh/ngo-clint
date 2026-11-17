import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/api.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem' }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>NGO<span style={{ color: '#16a34a' }}>Connect</span></span>
        </Link>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Email Sent!</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>If an account with that email exists, you'll receive password reset instructions shortly.</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}><ArrowLeft size={16} /> Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Forgot Password?</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Enter your email address and we'll send you a reset link.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="you@example.com" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9375rem' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
