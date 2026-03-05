import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';

const GuestDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getMy();
      setBookings(res.data.bookings);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(bookingId, { reason: 'Cancelled by guest' });
      loadBookings();
    } catch (err) { alert('Error cancelling booking'); }
  };

  const activeBookings = bookings.filter(b => ['confirmed', 'checked-in'].includes(b.status));

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'bookings', icon: '📅', label: 'My Bookings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span>👤</span>
          <span style={styles.roleName}>Guest Portal</span>
        </div>
        {sidebarItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ ...styles.sidebarBtn, ...(activeTab === item.id ? styles.active : {}) }}>
            {item.icon} {item.label}
          </button>
        ))}
        <Link to="/rooms" style={styles.browseBtn}>🔍 Browse Rooms</Link>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      <div style={styles.main}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={styles.pageHeader}>
              <h2 style={styles.pageTitle}>👋 Welcome, {user?.fullName?.split(' ')[0]}!</h2>
              <span style={styles.date}>📅 {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p style={{ color: '#888', margin: '-8px 0 20px' }}>Manage your bookings and explore our services</p>
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#1565c0' },
                { label: 'Active Bookings', value: activeBookings.length, icon: '🛏️', color: '#2e7d32' },
                { label: 'Loyalty Points', value: user?.loyaltyPoints || 0, icon: '⭐', color: '#f57c00' },
                { label: 'Loyalty Status', value: user?.loyaltyStatus || 'Bronze', icon: '🏆', color: '#6a1b9a' },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <span style={styles.statLabel}>{s.label}</span>
                  <div style={styles.statRow}>
                    <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                    <span style={styles.statIcon}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.twoCol}>
              <Link to="/rooms" style={styles.actionCard}>
                <div style={styles.actionIcon}>🔍</div>
                <h3 style={styles.actionTitle}>Browse Rooms</h3>
                <p style={styles.actionDesc}>Explore our available rooms and make new reservations</p>
                <span style={styles.actionBtn}>🛏️ View Rooms</span>
              </Link>
              <div onClick={() => setActiveTab('bookings')} style={{ ...styles.actionCard, background: 'linear-gradient(135deg, #2e7d32, #43a047)', cursor: 'pointer' }}>
                <div style={styles.actionIcon}>📅</div>
                <h3 style={styles.actionTitle}>My Bookings</h3>
                <p style={styles.actionDesc}>View and manage your current and past bookings</p>
                <span style={styles.actionBtn}>📋 View Bookings</span>
              </div>
            </div>
            <div style={styles.recentPanel}>
              <h3 style={styles.panelTitle}>📋 Recent Bookings</h3>
              {bookings.length === 0 ? (
                <div style={styles.empty}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                  <p>No bookings yet</p>
                  <p style={{ color: '#888', fontSize: '13px' }}>Start exploring our rooms and make your first reservation!</p>
                  <Link to="/rooms" style={styles.browseRoomsBtn}>🛏️ Browse Rooms</Link>
                </div>
              ) : (
                bookings.slice(0, 5).map(b => (
                  <div key={b._id} style={styles.bookingRow}>
                    <div>
                      <strong>{b.bookingId}</strong> — Room {b.room?.roomNumber} ({b.room?.type})
                      <div style={{ color: '#888', fontSize: '12px' }}>{new Date(b.checkInDate).toLocaleDateString('en-IN')} → {new Date(b.checkOutDate).toLocaleDateString('en-IN')} · {b.numberOfNights} nights</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: '#6B35C8' }}>₹{b.finalAmount?.toLocaleString()}</div>
                      <span style={styles.badge(b.status)}>{b.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 style={styles.pageTitle}>📅 My Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <div style={styles.empty}>
                <p>No bookings found. <Link to="/rooms" style={{ color: '#6B35C8' }}>Browse Rooms</Link></p>
              </div>
            ) : (
              bookings.map(b => (
                <div key={b._id} style={styles.bookingCard}>
                  <div style={styles.bookingLeft}>
                    <div style={styles.bookingEmoji}>{b.room?.type === 'Presidential Suite' ? '👑' : b.room?.type === 'Suite' ? '🌟' : '🛏️'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.bookingHeader}>
                      <h3 style={{ margin: 0 }}>Room {b.room?.roomNumber} — {b.room?.type}</h3>
                      <span style={styles.badge(b.status)}>{b.status}</span>
                    </div>
                    <p style={{ color: '#888', margin: '4px 0', fontSize: '13px' }}>Booking ID: {b.bookingId}</p>
                    <div style={styles.bookingMeta}>
                      <span>📅 Check-in: {new Date(b.checkInDate).toLocaleDateString('en-IN')}</span>
                      <span>📅 Check-out: {new Date(b.checkOutDate).toLocaleDateString('en-IN')}</span>
                      <span>🌙 {b.numberOfNights} nights</span>
                      <span>👥 {b.numberOfGuests} guests</span>
                    </div>
                    <div style={styles.bookingFooter}>
                      <div>
                        <span style={{ color: '#6B35C8', fontWeight: 700, fontSize: '16px' }}>₹{b.finalAmount?.toLocaleString()}</span>
                        <span style={{ color: '#888', fontSize: '12px', marginLeft: '4px' }}>(incl. taxes)</span>
                      </div>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => handleCancel(b._id)} style={styles.cancelBtn}>❌ Cancel Booking</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 style={styles.pageTitle}>👤 My Profile</h2>
            <div style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatar}>👤</div>
                <div style={styles.profileInfo}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{user?.fullName}</h3>
                  <p style={{ color: '#e0d0ff', margin: '4px 0', fontSize: '14px' }}>@{user?.username}</p>
                  <p style={{ color: '#e0d0ff', margin: '4px 0', fontSize: '13px' }}>✉️ {user?.email}</p>
                  <span style={styles.loyaltyBadge}>⭐ {user?.loyaltyStatus} Member</span>
                </div>
              </div>
              <div style={styles.loyaltySection}>
                <h4 style={{ margin: '0 0 8px', color: '#333' }}>🏆 Loyalty Program</h4>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${Math.min((user?.loyaltyPoints / 1000) * 100, 100)}%` }} />
                </div>
                <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>{user?.loyaltyPoints} / 1000 points to Platinum</p>
                <div style={{ display: 'flex', gap: '24px', marginTop: '12px', fontSize: '14px' }}>
                  <div><strong style={{ color: '#4B0082' }}>{user?.loyaltyPoints}</strong><br /><span style={{ color: '#888', fontSize: '12px' }}>Current Points</span></div>
                  <div><strong style={{ color: '#f57c00' }}>{user?.loyaltyStatus}</strong><br /><span style={{ color: '#888', fontSize: '12px' }}>Status</span></div>
                  <div><strong style={{ color: '#2e7d32' }}>Free Night</strong><br /><span style={{ color: '#888', fontSize: '12px' }}>Next Reward</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const badgeColors = { confirmed: { bg: '#e3f2fd', color: '#1565c0' }, 'checked-in': { bg: '#f3e5f5', color: '#6a1b9a' }, 'checked-out': { bg: '#e8f5e9', color: '#2e7d32' }, cancelled: { bg: '#ffebee', color: '#c62828' }, pending: { bg: '#fff8e1', color: '#f57f17' } };

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f5f5f5' },
  sidebar: { width: '200px', background: '#fff', borderRight: '1px solid #eee', padding: '20px 0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarHeader: { padding: '0 16px 20px', borderBottom: '1px solid #eee', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
  roleName: { fontWeight: 700, color: '#4B0082', fontSize: '15px' },
  sidebarBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#555', width: '100%' },
  active: { background: '#f0eaff', color: '#4B0082', fontWeight: 600, borderLeft: '3px solid #4B0082' },
  browseBtn: { padding: '10px 16px', color: '#6B35C8', textDecoration: 'none', fontSize: '14px', display: 'block', marginTop: '4px' },
  logoutBtn: { marginTop: 'auto', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#888', width: '100%' },
  main: { flex: 1, padding: '24px', overflow: 'auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  pageTitle: { margin: 0, fontSize: '20px', color: '#333' },
  date: { color: '#888', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '16px' },
  statLabel: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: '24px', fontWeight: 700 },
  statIcon: { fontSize: '20px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  actionCard: { background: 'linear-gradient(135deg, #4B0082, #6B35C8)', borderRadius: '12px', padding: '28px', color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block' },
  actionIcon: { fontSize: '40px', marginBottom: '12px' },
  actionTitle: { margin: '0 0 8px', fontSize: '18px', color: '#fff' },
  actionDesc: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '16px' },
  actionBtn: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '7px 16px', borderRadius: '5px', fontSize: '13px', color: '#fff' },
  recentPanel: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' },
  panelTitle: { margin: 0, padding: '14px 16px', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid #eee', background: '#f9f9f9' },
  empty: { padding: '40px', textAlign: 'center', color: '#444' },
  browseRoomsBtn: { display: 'inline-block', marginTop: '12px', padding: '8px 20px', background: '#6B35C8', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '13px' },
  bookingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f5f5f5', fontSize: '13px' },
  bookingCard: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px' },
  bookingLeft: { width: '60px', height: '60px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 },
  bookingEmoji: {},
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  bookingMeta: { display: 'flex', gap: '16px', fontSize: '12px', color: '#888', margin: '8px 0', flexWrap: 'wrap' },
  bookingFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  cancelBtn: { padding: '6px 14px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
  badge: (s) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: badgeColors[s]?.bg || '#f5f5f5', color: badgeColors[s]?.color || '#666' }),
  profileCard: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' },
  profileHeader: { background: 'linear-gradient(135deg, #4B0082, #6B35C8)', padding: '28px', display: 'flex', gap: '20px', alignItems: 'center' },
  avatar: { width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
  profileInfo: {},
  loyaltyBadge: { background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', display: 'inline-block', marginTop: '6px' },
  loyaltySection: { padding: '20px' },
  progressBar: { height: '8px', background: '#f0eaff', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4B0082, #f57c00)', borderRadius: '4px', transition: 'width 0.3s' },
};

export default GuestDashboard;