import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookRoom = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    checkIn: location.state?.checkIn || today,
    checkOut: location.state?.checkOut || '',
    guests: parseInt(location.state?.guests) || 1,
    specialRequests: ''
  });

  useEffect(() => {
    roomAPI.getById(id).then(res => setRoom(res.data.room)).catch(() => navigate('/rooms')).finally(() => setLoading(false));
  }, [id]);

  const calculateNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut) - new Date(form.checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const subtotal = nights * (room?.pricePerNight || 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  const handleBook = async (e) => {
    e.preventDefault();
    if (nights <= 0) { setError('Please select valid check-in and check-out dates'); return; }
    setBooking(true); setError('');
    try {
      await bookingAPI.create({ roomId: id, checkInDate: form.checkIn, checkOutDate: form.checkOut, numberOfGuests: form.guests, specialRequests: form.specialRequests });
      alert('🎉 Booking Confirmed! Check your dashboard for details.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setBooking(false); }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>⏳ Loading...</div>;
  if (!room) return <div style={{ padding: '60px', textAlign: 'center' }}>Room not found</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📅 Book Your Room</h2>
      <div style={styles.layout}>
        {/* Room Details */}
        <div style={styles.roomCard}>
          <div style={styles.roomImg}>{room.type === 'Presidential Suite' ? '👑' : room.type === 'Suite' ? '🌟' : room.type === 'Deluxe' ? '✨' : '🛏️'}</div>
          <div style={styles.roomInfo}>
            <h3 style={styles.roomName}>Room {room.roomNumber} — {room.type}</h3>
            <p style={styles.roomDesc}>{room.description}</p>
            <div style={styles.roomMeta}>
              <span>👥 Max {room.capacity} guests</span>
              <span>🏢 Floor {room.floor}</span>
              {room.bedType && <span>🛏️ {room.bedType}</span>}
              {room.view && <span>🪟 {room.view}</span>}
            </div>
            <div style={styles.amenities}>
              {room.amenities?.map(a => <span key={a} style={styles.amenityTag}>{a}</span>)}
            </div>
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div style={styles.summary}>
              <h4 style={styles.summaryTitle}>💰 Price Summary</h4>
              <div style={styles.summaryRow}><span>₹{room.pricePerNight.toLocaleString()} × {nights} nights</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div style={styles.summaryRow}><span>GST (12%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div style={{ ...styles.summaryRow, borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '4px', fontWeight: 700, fontSize: '16px', color: '#6B35C8' }}>
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>📋 Booking Details</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleBook}>
            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label style={styles.label}>📅 Check-in Date *</label>
                <input type="date" min={today} value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>📅 Check-out Date *</label>
                <input type="date" min={form.checkIn || today} value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} style={styles.input} required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>👥 Number of Guests *</label>
              <select value={form.guests} onChange={e => setForm({ ...form, guests: parseInt(e.target.value) })} style={styles.input}>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📝 Special Requests (optional)</label>
              <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} style={styles.textarea} placeholder="Any special requests or requirements..." rows={3} />
            </div>

            {/* Guest Info */}
            <div style={styles.guestInfo}>
              <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>👤 Booking for:</h4>
              <p style={{ margin: 0, fontWeight: 600 }}>{user?.fullName}</p>
              <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{user?.email} · {user?.phone}</p>
            </div>

            <button type="submit" style={styles.bookBtn} disabled={booking || nights <= 0}>
              {booking ? '⏳ Processing...' : nights > 0 ? `✅ Confirm Booking — ₹${total.toLocaleString()}` : '📅 Select dates to proceed'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  title: { textAlign: 'center', color: '#333', marginBottom: '32px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  roomCard: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' },
  roomImg: { height: '160px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' },
  roomInfo: { padding: '20px' },
  roomName: { margin: '0 0 8px', color: '#333', fontSize: '18px' },
  roomDesc: { color: '#666', fontSize: '13px', margin: '0 0 10px' },
  roomMeta: { display: 'flex', gap: '12px', fontSize: '12px', color: '#888', flexWrap: 'wrap', marginBottom: '10px' },
  amenities: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  amenityTag: { background: '#f0eaff', color: '#6B35C8', fontSize: '11px', padding: '3px 8px', borderRadius: '12px' },
  summary: { background: '#f9f9ff', borderTop: '1px solid #eee', padding: '16px 20px' },
  summaryTitle: { margin: '0 0 12px', fontSize: '14px', color: '#333' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '6px' },
  formCard: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' },
  formTitle: { margin: '0 0 20px', color: '#333' },
  error: { background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  guestInfo: { background: '#f9f9ff', border: '1px solid #e0d0ff', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' },
  bookBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }
};

export default BookRoom;