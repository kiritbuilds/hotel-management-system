import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI, bookingAPI, userAPI } from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, totalGuests: 0, totalRevenue: 0 });
  const [todayCheckIns, setTodayCheckIns] = useState([]);
  const [todayCheckOuts, setTodayCheckOuts] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !['admin', 'staff'].includes(user.role)) { navigate('/login'); return; }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [roomStats, dashStats, roomsRes, guestsRes, bookingsRes] = await Promise.all([
        roomAPI.getStats(),
        bookingAPI.getDashboardStats(),
        roomAPI.getAll(),
        userAPI.getAll(),
        bookingAPI.getAll()
      ]);
      setStats({ ...roomStats.data.stats, totalRevenue: dashStats.data.stats.totalRevenue, totalGuests: dashStats.data.stats.totalGuests });
      setTodayCheckIns(dashStats.data.stats.todayCheckIns);
      setTodayCheckOuts(dashStats.data.stats.todayCheckOuts);
      setRecentBookings(dashStats.data.stats.recentBookings);
      setRooms(roomsRes.data.rooms);
      setGuests(guestsRes.data.users);
      setBookings(bookingsRes.data.bookings);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status });
      loadDashboard();
      alert(`Booking ${status} successfully!`);
    } catch (err) { alert('Error updating booking'); }
  };

  const handleRoomStatusUpdate = async (roomId, status) => {
    try {
      await roomAPI.update(roomId, { status });
      loadDashboard();
    } catch (err) { alert('Error updating room'); }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'rooms', icon: '🛏️', label: 'Manage Rooms' },
    { id: 'guests', icon: '👥', label: 'Manage Guests' },
    { id: 'bookings', icon: '📅', label: 'Manage Bookings' },
  ];

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>⏳ Loading dashboard...</div>;

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.roleIcon}>⚙️</span>
          <span style={styles.roleName}>{user?.role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</span>
        </div>
        {sidebarItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ ...styles.sidebarBtn, ...(activeTab === item.id ? styles.sidebarBtnActive : {}) }}>
            {item.icon} {item.label}
          </button>
        ))}
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={styles.pageHeader}>
              <h2 style={styles.pageTitle}>📊 Dashboard Overview</h2>
              <span style={styles.date}>📅 {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Rooms', value: stats.total, icon: '🛏️', color: '#4B0082' },
                { label: 'Available Rooms', value: stats.available, icon: '✅', color: '#2e7d32' },
                { label: 'Occupied Rooms', value: stats.occupied, icon: '🔴', color: '#c62828' },
                { label: 'Total Guests', value: stats.totalGuests, icon: '👥', color: '#1565c0' },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <span style={styles.statLabel}>{s.label}</span>
                  <div style={styles.statValueRow}>
                    <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                    <span style={styles.statIcon}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.twoCol}>
              <div style={styles.panel}>
                <h3 style={{ ...styles.panelTitle, background: '#4B0082', color: '#fff' }}>✅ Today's Check-ins ({todayCheckIns.length})</h3>
                {todayCheckIns.length === 0 ? <p style={styles.emptyMsg}>No check-ins scheduled for today</p> :
                  todayCheckIns.map(b => (
                    <div key={b._id} style={styles.checkItem}>
                      <span>👤 {b.guest?.fullName} — Room {b.room?.roomNumber}</span>
                      <button onClick={() => handleStatusUpdate(b._id, 'checked-in')} style={styles.miniBtn}>Check In</button>
                    </div>
                  ))}
              </div>
              <div style={styles.panel}>
                <h3 style={{ ...styles.panelTitle, background: '#f57c00', color: '#fff' }}>🚪 Today's Check-outs ({todayCheckOuts.length})</h3>
                {todayCheckOuts.length === 0 ? <p style={styles.emptyMsg}>No check-outs scheduled for today</p> :
                  todayCheckOuts.map(b => (
                    <div key={b._id} style={styles.checkItem}>
                      <span>👤 {b.guest?.fullName} — Room {b.room?.roomNumber}</span>
                      <button onClick={() => handleStatusUpdate(b._id, 'checked-out')} style={styles.miniBtn}>Check Out</button>
                    </div>
                  ))}
              </div>
            </div>
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>📋 Recent Bookings</h3>
              {recentBookings.length === 0 ? <p style={styles.emptyMsg}>No recent bookings found</p> :
                <table style={styles.table}>
                  <thead><tr>{['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Amount', 'Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {recentBookings.map(b => (
                      <tr key={b._id} style={styles.tr}>
                        <td style={styles.td}>{b.bookingId}</td>
                        <td style={styles.td}>{b.guest?.fullName}</td>
                        <td style={styles.td}>Room {b.room?.roomNumber}</td>
                        <td style={styles.td}>{new Date(b.checkInDate).toLocaleDateString('en-IN')}</td>
                        <td style={styles.td}>{new Date(b.checkOutDate).toLocaleDateString('en-IN')}</td>
                        <td style={styles.td}>₹{b.finalAmount?.toLocaleString()}</td>
                        <td style={styles.td}><span style={styles.badge(b.status)}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
            </div>
          </div>
        )}

        {/* Manage Rooms */}
        {activeTab === 'rooms' && (
          <div>
            <h2 style={styles.pageTitle}>🛏️ Manage Rooms</h2>
            <table style={styles.table}>
              <thead><tr>{['Room No.', 'Type', 'Floor', 'Capacity', 'Price/Night', 'Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
              <tbody>
                {rooms.map(r => (
                  <tr key={r._id} style={styles.tr}>
                    <td style={styles.td}><strong>{r.roomNumber}</strong></td>
                    <td style={styles.td}>{r.type}</td>
                    <td style={styles.td}>{r.floor}</td>
                    <td style={styles.td}>{r.capacity} guests</td>
                    <td style={styles.td}>₹{r.pricePerNight?.toLocaleString()}</td>
                    <td style={styles.td}><span style={styles.badge(r.status)}>{r.status}</span></td>
                    <td style={styles.td}>
                      <select value={r.status} onChange={e => handleRoomStatusUpdate(r._id, e.target.value)} style={styles.miniSelect}>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Guests */}
        {activeTab === 'guests' && (
          <div>
            <h2 style={styles.pageTitle}>👥 Manage Guests ({guests.length})</h2>
            <table style={styles.table}>
              <thead><tr>{['Name', 'Username', 'Email', 'Phone', 'Nationality', 'Loyalty', 'Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
              <tbody>
                {guests.map(g => (
                  <tr key={g._id} style={styles.tr}>
                    <td style={styles.td}><strong>{g.fullName}</strong></td>
                    <td style={styles.td}>{g.username}</td>
                    <td style={styles.td}>{g.email}</td>
                    <td style={styles.td}>{g.phone}</td>
                    <td style={styles.td}>{g.nationality}</td>
                    <td style={styles.td}><span style={{ color: '#f57c00', fontWeight: 600 }}>{g.loyaltyStatus} ({g.loyaltyPoints} pts)</span></td>
                    <td style={styles.td}><span style={styles.badge(g.isActive ? 'confirmed' : 'cancelled')}>{g.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={styles.pageTitle}>📅 Manage Bookings ({bookings.length})</h2>
            <table style={styles.table}>
              <thead><tr>{['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Nights', 'Amount', 'Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} style={styles.tr}>
                    <td style={styles.td}>{b.bookingId}</td>
                    <td style={styles.td}>{b.guest?.fullName}</td>
                    <td style={styles.td}>Room {b.room?.roomNumber}</td>
                    <td style={styles.td}>{new Date(b.checkInDate).toLocaleDateString('en-IN')}</td>
                    <td style={styles.td}>{new Date(b.checkOutDate).toLocaleDateString('en-IN')}</td>
                    <td style={styles.td}>{b.numberOfNights}</td>
                    <td style={styles.td}>₹{b.finalAmount?.toLocaleString()}</td>
                    <td style={styles.td}><span style={styles.badge(b.status)}>{b.status}</span></td>
                    <td style={styles.td}>
                      {b.status === 'confirmed' && <button onClick={() => handleStatusUpdate(b._id, 'checked-in')} style={styles.miniBtn}>Check In</button>}
                      {b.status === 'checked-in' && <button onClick={() => handleStatusUpdate(b._id, 'checked-out')} style={{ ...styles.miniBtn, background: '#f57c00' }}>Check Out</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const badgeColors = {
  available: { bg: '#e8f5e9', color: '#2e7d32' },
  confirmed: { bg: '#e3f2fd', color: '#1565c0' },
  'checked-in': { bg: '#f3e5f5', color: '#6a1b9a' },
  'checked-out': { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled: { bg: '#ffebee', color: '#c62828' },
  pending: { bg: '#fff8e1', color: '#f57f17' },
  occupied: { bg: '#ffebee', color: '#c62828' },
  maintenance: { bg: '#fff8e1', color: '#f57f17' },
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f5f5f5' },
  sidebar: { width: '200px', background: '#fff', borderRight: '1px solid #eee', padding: '20px 0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarHeader: { padding: '0 16px 20px', borderBottom: '1px solid #eee', marginBottom: '8px' },
  roleIcon: { fontSize: '18px' },
  roleName: { fontWeight: 700, color: '#4B0082', fontSize: '15px', marginLeft: '8px' },
  sidebarBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#555', width: '100%' },
  sidebarBtnActive: { background: '#f0eaff', color: '#4B0082', fontWeight: 600, borderLeft: '3px solid #4B0082' },
  logoutBtn: { marginTop: 'auto', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#888' },
  main: { flex: 1, padding: '24px', overflow: 'auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  pageTitle: { margin: 0, fontSize: '20px', color: '#333' },
  date: { color: '#888', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '16px 20px' },
  statLabel: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '8px' },
  statValueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: '28px', fontWeight: 700 },
  statIcon: { fontSize: '24px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  panel: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' },
  panelTitle: { margin: 0, padding: '12px 16px', fontSize: '14px', fontWeight: 600, background: '#f9f9f9', borderBottom: '1px solid #eee' },
  emptyMsg: { padding: '20px', textAlign: 'center', color: '#888', fontSize: '13px' },
  checkItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #f5f5f5', fontSize: '13px' },
  miniBtn: { padding: '4px 12px', background: '#4B0082', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  miniSelect: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { background: '#f9f9f9', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#555', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '10px 14px', color: '#444' },
  badge: (status) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: badgeColors[status]?.bg || '#f5f5f5', color: badgeColors[status]?.color || '#666' }),
};

export default AdminDashboard;