import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', phone: '', nationality: 'Indian', address: '', idType: '', idNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Guest Registration</h2>
        <p style={styles.subtitle}>Create your account to book rooms</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>👤 Username *</label>
              <input name="username" value={form.username} onChange={handleChange} style={styles.input} placeholder="Choose username" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>🔒 Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Min 6 characters" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>🪪 Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} style={styles.input} placeholder="Your full name" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>✉️ Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="your@email.com" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📞 Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} style={styles.input} placeholder="10-digit number" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>🌍 Nationality</label>
              <input name="nationality" value={form.nationality} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>📍 Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} style={styles.textarea} placeholder="Your full address" rows={3} />
          </div>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>🪪 ID Type *</label>
              <select name="idType" value={form.idType} onChange={handleChange} style={styles.input} required>
                <option value="">Select ID Type</option>
                <option>Aadhar</option><option>Passport</option><option>PAN</option><option>Driving License</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}># ID Number *</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange} style={styles.input} placeholder="ID number" required />
            </div>
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Creating Account...' : '👤 Register'}
          </button>
          <p style={styles.loginText}>Already have an account? <Link to="/login" style={styles.link}>Login here</Link></p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '24px' },
  card: { background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#3300aa', margin: 0, fontSize: '24px' },
  subtitle: { textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '4px', marginBottom: '24px' },
  error: { background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' },
  field: { marginBottom: '16px' },
  fieldFull: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  loginText: { textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '12px' },
  link: { color: '#6B35C8', textDecoration: 'none' }
};

export default Register;