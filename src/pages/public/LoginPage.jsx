import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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

        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Welcome back</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Sign in to your account to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#16a34a' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1.5rem', fontSize: '0.9375rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#16a34a', fontWeight: 600 }}>Register as Volunteer</Link>
        </p>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', fontSize: '0.8125rem', color: '#64748b' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Demo Credentials</div>
          <div>Admin: admin@ngoconnect.org / Admin@123456</div>
        </div>
      </div>
    </div>
  );
}
