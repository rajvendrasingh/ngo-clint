import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const SKILLS = ['Teaching', 'Medical', 'IT/Technology', 'Photography', 'Cooking', 'Driving', 'Languages', 'Music', 'Art', 'Construction', 'First Aid', 'Counseling'];
const INTERESTS = ['Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'];

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    age: '', location: '', skills: [], availability: 'flexible', areasOfInterest: [],
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleSkill = (skill) => setForm(p => ({ ...p, skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill] }));
  const toggleInterest = (interest) => setForm(p => ({ ...p, areasOfInterest: p.areasOfInterest.includes(interest) ? p.areasOfInterest.filter(i => i !== interest) : [...p.areasOfInterest, interest] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await register(form);
      toast.success('Registration successful! Welcome to NGO Connect.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '580px', padding: '2.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <div style={{ background: '#16a34a', borderRadius: '0.5rem', padding: '0.375rem' }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>NGO<span style={{ color: '#16a34a' }}>Connect</span></span>
        </Link>

        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Join as Volunteer</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Create your account and start making a difference</p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: '0.25rem', borderRadius: '9999px', background: s <= step ? '#16a34a' : '#e2e8f0', transition: 'background 0.3s' }} />
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="form-input" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+1 234 567 8900" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input name="age" type="number" min="15" max="100" value={form.age} onChange={handleChange} className="form-input" placeholder="25" required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Location *</label>
                <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="City, State/Country" required />
              </div>
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="form-input" style={{ paddingRight: '2.75rem' }} placeholder="Min. 6 characters" required minLength={6} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder="Confirm password" required />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
                disabled={!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword || !form.age || !form.location}>
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Availability</label>
                <select name="availability" value={form.availability} onChange={handleChange} className="form-input">
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="both">Both Weekdays & Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Skills (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s', background: form.skills.includes(skill) ? '#16a34a' : 'white', color: form.skills.includes(skill) ? 'white' : '#475569', borderColor: form.skills.includes(skill) ? '#16a34a' : '#e2e8f0' }}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Areas of Interest (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {INTERESTS.map(interest => (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s', background: form.areasOfInterest.includes(interest) ? '#16a34a' : 'white', color: form.areasOfInterest.includes(interest) ? 'white' : '#475569', borderColor: form.areasOfInterest.includes(interest) ? '#16a34a' : '#e2e8f0' }}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline btn-lg" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1.5rem', fontSize: '0.9375rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
