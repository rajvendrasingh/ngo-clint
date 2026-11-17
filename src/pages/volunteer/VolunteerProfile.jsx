import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Edit3, Save, X } from 'lucide-react';
import { authService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const SKILLS = ['Teaching', 'Medical', 'IT/Technology', 'Photography', 'Cooking', 'Driving', 'Languages', 'Music', 'Art', 'Construction', 'First Aid', 'Counseling'];
const INTERESTS = ['Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'];

export default function VolunteerProfile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '', phone: user?.phone || '', age: user?.age || '',
    location: user?.location || '', bio: user?.bio || '', availability: user?.availability || 'flexible',
    skills: user?.skills || [], areasOfInterest: user?.areasOfInterest || [],
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const toggleSkill = (s) => setForm(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }));
  const toggleInterest = (i) => setForm(p => ({ ...p, areasOfInterest: p.areasOfInterest.includes(i) ? p.areasOfInterest.filter(x => x !== i) : [...p.areasOfInterest, i] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(item => fd.append(k, item));
        else fd.append(k, v);
      });
      await authService.updateProfile(fd);
      await refreshUser();
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    setChangingPass(true);
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setChangingPass(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn btn-outline"><Edit3 size={16} /> Edit Profile</button>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setEditing(false)} className="btn btn-ghost"><X size={16} /> Cancel</button>
            <button onClick={handleSave} className="btn btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save'}</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Avatar card */}
        <div>
          <div className="card card-pad" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', fontWeight: 700 }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{user?.fullName}</h3>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Volunteer</div>
            <div style={{ background: '#f0fdf4', borderRadius: '0.75rem', padding: '1rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>{user?.totalServiceHours || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Service Hours</div>
            </div>
          </div>
          <div className="card card-pad">
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                <Mail size={16} color="#16a34a" />{user?.email}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                <Phone size={16} color="#16a34a" />{user?.phone || 'Not provided'}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                <MapPin size={16} color="#16a34a" />{user?.location || 'Not provided'}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                <Clock size={16} color="#16a34a" />{user?.availability || 'Flexible'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div>
          <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h4>
            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="form-input" disabled={!editing} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="form-input" disabled={!editing} />
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} className="form-input" disabled={!editing} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="form-input" disabled={!editing} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange} className="form-input" disabled={!editing}>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="both">Both</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="form-input" rows={3} disabled={!editing} placeholder="Tell us about yourself..." />
            </div>
          </div>

          {editing && (
            <>
              <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SKILLS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1.5px solid', cursor: 'pointer', background: form.skills.includes(s) ? '#16a34a' : 'white', color: form.skills.includes(s) ? 'white' : '#475569', borderColor: form.skills.includes(s) ? '#16a34a' : '#e2e8f0' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Areas of Interest</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {INTERESTS.map(i => (
                    <button key={i} type="button" onClick={() => toggleInterest(i)}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.875rem', border: '1.5px solid', cursor: 'pointer', background: form.areasOfInterest.includes(i) ? '#16a34a' : 'white', color: form.areasOfInterest.includes(i) ? 'white' : '#475569', borderColor: form.areasOfInterest.includes(i) ? '#16a34a' : '#e2e8f0' }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!editing && (
            <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Skills & Interests</h4>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user?.skills?.length ? user.skills.map(s => (
                    <span key={s} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>{s}</span>
                  )) : <span style={{ color: '#94a3b8' }}>No skills added</span>}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Areas of Interest</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user?.areasOfInterest?.length ? user.areasOfInterest.map(i => (
                    <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>{i}</span>
                  )) : <span style={{ color: '#94a3b8' }}>No interests added</span>}
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          <div className="card card-pad">
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Change Password</h4>
            <form onSubmit={handleChangePassword}>
              <div className="grid-3" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="form-input" placeholder="••••••" required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="form-input" placeholder="Min 6 chars" required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="form-input" placeholder="Confirm" required />
                </div>
              </div>
              <button type="submit" className="btn btn-outline" disabled={changingPass}>
                {changingPass ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
