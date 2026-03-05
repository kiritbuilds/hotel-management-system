import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form);
      if (user.role === 'admin' || user.role === 'staff') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role) => {
    const demos = { admin: { username: 'admin', password: 'admin123' }, staff: { username: 'staff', password: 'staff123' }, guest: { username: 'guest', password: 'guest123' } };
    setForm(demos[role]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🏨 Hotel Management</h2>
          <p style={styles.subtitle}>Secure Hotel Portal</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.field}>
            <label style={styles.label}>👤 Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Enter username" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🔒 Password</label>
            <div style={styles.passWrap}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter password" style={{ ...styles.input, paddingRight: '44px' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>
        </form>
        <div style={styles.links}>
          <Link to="/forgot-password" style={styles.link}>Forgot your password?</Link>
          <p style={styles.registerText}>Don't have an account? <Link to="/register" style={styles.link}>Register here</Link></p>
        </div>
        <hr style={styles.divider} />
        <div style={styles.demo}>
          <p style={styles.demoTitle}>Demo Accounts:</p>
          <div style={styles.demoButtons}>
            {['admin', 'staff', 'guest'].map(role => (
              <button key={role} onClick={() => demoLogin(role)} style={styles.demoBtn}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '24px' },
  card: { background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  header: { textAlign: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#3300aa', fontSize: '24px' },
  subtitle: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  form: {},
  error: { background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' },
  passWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  btn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  links: { textAlign: 'center', marginTop: '16px' },
  link: { color: '#6B35C8', textDecoration: 'none', fontSize: '13px' },
  registerText: { fontSize: '13px', color: '#666', marginTop: '8px' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '20px 0' },
  demo: { textAlign: 'center' },
  demoTitle: { fontSize: '12px', color: '#888', margin: '0 0 10px' },
  demoButtons: { display: 'flex', justifyContent: 'center', gap: '10px' },
  demoBtn: { padding: '6px 16px', border: '1px solid #ddd', borderRadius: '4px', background: '#f9f9f9', cursor: 'pointer', fontSize: '13px', color: '#444' }
};

export default Login;