import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Users, Search } from 'lucide-react';
import { activityService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const CATEGORIES = ['Education', 'Environment', 'Food Distribution', 'Health Awareness', 'Social Welfare', 'Digital Literacy'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];
const STATUS_COLORS = { upcoming: 'badge-green', ongoing: 'badge-blue', completed: 'badge-gray', cancelled: 'badge-red' };

const EMPTY_FORM = { title: '', description: '', category: '', date: '', time: '', location: '', requiredVolunteers: '', maxVolunteers: '', skillsRequired: '', status: 'upcoming', serviceHours: '' };

export default function ManageActivities() {
  const toast = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      const { data } = await activityService.getAll(params);
      setActivities(data.activities);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  useEffect(() => { const t = setTimeout(fetch, 400); return () => clearTimeout(t); }, [search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setCoverImage(null); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a._id);
    setForm({
      title: a.title, description: a.description, category: a.category,
      date: new Date(a.date).toISOString().split('T')[0], time: a.time, location: a.location,
      requiredVolunteers: a.requiredVolunteers, maxVolunteers: a.maxVolunteers,
      skillsRequired: a.skillsRequired?.join(', ') || '', status: a.status, serviceHours: a.serviceHours || '',
    });
    setCoverImage(null);
    setShowModal(true);
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverImage) fd.append('coverImage', coverImage);
      if (editing) {
        await activityService.update(editing, fd);
        toast.success('Activity updated!');
      } else {
        await activityService.create(fd);
        toast.success('Activity created!');
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save activity');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    setDeleting(id);
    try {
      await activityService.delete(id);
      setActivities(prev => prev.filter(a => a._id !== id));
      toast.success('Activity deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
    setDeleting(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="page-title">Manage Activities</h2>
          <p className="page-subtitle">Create, edit and delete volunteer activities</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary"><Plus size={18} /> Create Activity</button>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div className="search-bar">
          <Search size={18} color="#94a3b8" />
          <input placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : activities.length === 0 ? (
          <div className="empty-state"><Calendar size={48} /><h3>No activities yet</h3><button onClick={openCreate} className="btn btn-primary" style={{ marginTop: '1rem' }}>Create First Activity</button></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Volunteers</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(a => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{a.serviceHours || 0} hrs</div>
                    </td>
                    <td><span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8125rem' }}>{a.category}</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{formatDate(a.date)}</td>
                    <td style={{ fontSize: '0.875rem' }}>{a.location}</td>
                    <td>{a.enrolledCount || 0}/{a.maxVolunteers}</td>
                    <td><span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(a)} className="btn btn-ghost btn-sm"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(a._id)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} disabled={deleting === a._id}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 700 }}>{editing ? 'Edit Activity' : 'Create Activity'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={3} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className="form-input" required>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="form-input">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <input name="time" value={form.time} onChange={handleChange} className="form-input" placeholder="09:00 AM" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} className="form-input" required />
                </div>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Required Volunteers</label>
                    <input name="requiredVolunteers" type="number" min="1" value={form.requiredVolunteers} onChange={handleChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Volunteers</label>
                    <input name="maxVolunteers" type="number" min="1" value={form.maxVolunteers} onChange={handleChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Hours</label>
                    <input name="serviceHours" type="number" min="0" value={form.serviceHours} onChange={handleChange} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Skills Required (comma-separated)</label>
                  <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} className="form-input" placeholder="Teaching, Communication, ..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image</label>
                  <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} className="form-input" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
