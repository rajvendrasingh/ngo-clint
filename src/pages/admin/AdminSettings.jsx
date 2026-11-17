import React, { useState } from 'react';
import { Save, Shield, Bell, Database } from 'lucide-react';
import { authService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminSettings() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => fd.append(k, v));
      await authService.updateProfile(fd);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setChangingPass(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your admin account settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Admin profile */}
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={20} color="#16a34a" />
            <h3 style={{ fontWeight: 700 }}>Admin Profile</h3>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                {user?.fullName?.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{user?.fullName}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{user?.email}</div>
                <span className="badge badge-yellow" style={{ marginTop: '0.25rem' }}>Administrator</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Name</label>
              <input value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email</label>
              <input value={user?.email} className="form-input" disabled style={{ background: '#f8fafc' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Phone</label>
              <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}><Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile'}</button>
          </form>
        </div>

        {/* Change password */}
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={20} color="#16a34a" />
            <h3 style={{ fontWeight: 700 }}>Change Password</h3>
          </div>
          <form onSubmit={handleChangePassword}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="form-input" required />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">New Password</label>
              <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="form-input" required minLength={6} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="form-input" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={changingPass}><Save size={16} /> {changingPass ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>

      {/* System info */}
      <div className="card card-pad" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Database size={20} color="#16a34a" />
          <h3 style={{ fontWeight: 700 }}>System Information</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Application', value: 'NGO Connect v1.0.0' },
            { label: 'Backend', value: 'Node.js + Express' },
            { label: 'Database', value: 'MongoDB' },
            { label: 'Authentication', value: 'JWT' },
            { label: 'Frontend', value: 'React + Vite' },
            { label: 'Role', value: 'Administrator' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
