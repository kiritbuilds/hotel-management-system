import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          <span style={styles.brandIcon}>🏨</span>
          <span style={styles.brandText}>Grand Palace Hotel</span>
        </Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>🏠 Home</Link>
        <Link to="/rooms" style={styles.link}>🔍 Search Rooms</Link>
        {user?.role !== 'guest' && user && (
          <Link to="/services" style={styles.link}>✨ Services</Link>
        )}
      </div>
      <div style={styles.auth}>
        {!user ? (
          <>
            <Link to="/login" style={styles.authLink}>🔑 Login</Link>
            <Link to="/register" style={styles.authLink}>👤 Register</Link>
          </>
        ) : (
          <>
            <span style={styles.userName}>Welcome, {user.fullName?.split(' ')[0]}!</span>
            <Link to={user.role === 'guest' ? '/dashboard' : '/admin'} style={styles.authLink}>
              {user.role === 'admin' ? '⚙️ Admin Panel' : user.role === 'staff' ? '📋 Staff Panel' : '🏠 My Portal'}
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: 'linear-gradient(135deg, #4B0082, #6B35C8)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 1000 },
  brand: { display: 'flex', alignItems: 'center' },
  brandLink: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },
  brandIcon: { fontSize: '20px' },
  brandText: { color: '#fff', fontWeight: 700, fontSize: '16px' },
  links: { display: 'flex', gap: '20px' },
  link: { color: '#e0d0ff', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' },
  auth: { display: 'flex', alignItems: 'center', gap: '16px' },
  authLink: { color: '#e0d0ff', textDecoration: 'none', fontSize: '14px', fontWeight: 500 },
  userName: { color: '#fff', fontSize: '13px', fontWeight: 500 },
  logoutBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
};

export default Navbar;