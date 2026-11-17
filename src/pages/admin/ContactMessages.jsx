import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Eye } from 'lucide-react';
import { contactService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ContactMessages() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'unread') params.isRead = 'false';
      if (filter === 'read') params.isRead = 'true';
      const { data } = await contactService.getAll(params);
      setContacts(data.contacts);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleView = async (contact) => {
    setSelected(contact);
    if (!contact.isRead) {
      try {
        await contactService.markRead(contact._id);
        setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Contact Messages</h2>
        <p className="page-subtitle">Manage incoming contact form submissions</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
            style={{ background: filter === f ? '#16a34a' : 'white', color: filter === f ? 'white' : '#475569', border: `1px solid ${filter === f ? '#16a34a' : '#e2e8f0'}`, textTransform: 'capitalize' }}>
            {f === 'unread' ? `Unread (${contacts.filter(c => !c.isRead).length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        <div className="card">
          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : contacts.length === 0 ? (
            <div className="empty-state"><MessageSquare size={48} /><h3>No messages</h3></div>
          ) : (
            <div>
              {contacts.map(contact => (
                <div key={contact._id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected?._id === contact._id ? '#f0fdf4' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
                  onClick={() => handleView(contact)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      {!contact.isRead && <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', flexShrink: 0 }} />}
                      <span style={{ fontWeight: contact.isRead ? 500 : 700 }}>{contact.name}</span>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '9999px', color: '#64748b' }}>{contact.subject}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem' }}>{contact.email}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.message}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(contact.createdAt)}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(contact._id); }} className="btn btn-ghost btn-sm" style={{ color: '#ef4444', padding: '0.25rem' }} disabled={deleting === contact._id}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 700 }}>Message Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone || 'N/A'], ['Subject', selected.subject]].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ color: '#1e293b', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</div>
                <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-wrap' }}>{selected.message}</div>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>Received: {formatDate(selected.createdAt)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
