import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { contactService } from '../../services/api.js';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactService.submit(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <PublicLayout>
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: '3rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Us</h1>
          <p style={{ color: '#475569' }}>We'd love to hear from you. Reach out for inquiries, partnerships, or just to say hello.</p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Get in Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: MapPin, title: 'Visit Us', info: '123 Community Drive, New York, NY 10001' },
                { icon: Phone, title: 'Call Us', info: '+1 234 567 8900' },
                { icon: Mail, title: 'Email Us', info: 'info@ngoconnect.org' },
              ].map(({ icon: Icon, title, info }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', background: '#f0fdf4', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>
                    <div style={{ color: '#64748b' }}>{info}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Office Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Monday - Friday</span><span style={{ fontWeight: 600 }}>9:00 AM – 6:00 PM</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saturday</span><span style={{ fontWeight: 600 }}>10:00 AM – 4:00 PM</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sunday</span><span style={{ fontWeight: 600, color: '#ef4444' }}>Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Message Sent!</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="btn btn-primary">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send Us a Message</h2>
                {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                <div className="grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+1 234 567 8900" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="form-input" required>
                      <option value="">Select subject</option>
                      <option>General Inquiry</option>
                      <option>Volunteer Program</option>
                      <option>Partnership</option>
                      <option>Donation</option>
                      <option>Media Inquiry</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} className="form-input" rows={5} placeholder="Tell us how we can help..." required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  <Send size={18} /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
