import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { roomAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '1',
    type: searchParams.get('type') || '',
    minPrice: '', maxPrice: '',
    amenities: []
  });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.checkIn) params.checkIn = filters.checkIn;
      if (filters.checkOut) params.checkOut = filters.checkOut;
      if (filters.guests) params.guests = filters.guests;
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.amenities.length) params.amenities = filters.amenities.join(',');
      const res = await roomAPI.getAll(params);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (a) => {
    setFilters(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
  };

  const handleBook = (roomId) => {
    if (!user) { navigate('/login'); return; }
    navigate(`/book/${roomId}`, { state: { checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests } });
  };

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Perfect Room</h1>
        <p style={styles.heroSub}>Discover luxury and comfort in our premium accommodations</p>
        <div style={styles.searchBar}>
          <div style={styles.searchField}><label style={styles.sLabel}>📅 Check-in Date</label><input type="date" value={filters.checkIn} onChange={e => setFilters({ ...filters, checkIn: e.target.value })} style={styles.sInput} /></div>
          <div style={styles.searchField}><label style={styles.sLabel}>📅 Check-out Date</label><input type="date" value={filters.checkOut} onChange={e => setFilters({ ...filters, checkOut: e.target.value })} style={styles.sInput} /></div>
          <div style={styles.searchField}><label style={styles.sLabel}>👥 Guests</label>
            <select value={filters.guests} onChange={e => setFilters({ ...filters, guests: e.target.value })} style={styles.sInput}>
              {[1,2,3,4,5,6].map(n => <option key={n}>{n} {n===1?'Guest':'Guests'}</option>)}
            </select>
          </div>
          <div style={styles.searchField}><label style={styles.sLabel}>🛏️ Room Type</label>
            <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} style={styles.sInput}>
              <option value="">All Types</option>
              <option>Standard</option><option>Deluxe</option><option>Suite</option>
              <option>Presidential Suite</option><option>Family Room</option>
            </select>
          </div>
          <button onClick={fetchRooms} style={styles.searchBtn}>🔍 Search</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <h3 style={styles.filterTitle}>🔧 Filters</h3>
          <div style={styles.filterSection}>
            <h4 style={styles.filterLabel}>Price Range</h4>
            {[{label:'₹0 - ₹3,000', min:0, max:3000}, {label:'₹3,000 - ₹6,000', min:3000, max:6000}, {label:'₹6,000+', min:6000, max:''}].map(p => (
              <label key={p.label} style={styles.checkLabel}>
                <input type="checkbox" onChange={e => setFilters(f => ({ ...f, minPrice: e.target.checked ? p.min : '', maxPrice: e.target.checked ? p.max : '' }))} />
                <span style={{ marginLeft: '6px' }}>{p.label}</span>
              </label>
            ))}
          </div>
          <div style={styles.filterSection}>
            <h4 style={styles.filterLabel}>Amenities</h4>
            {['WiFi', 'Air Conditioning', 'TV', 'Balcony', 'Mini Bar', 'Jacuzzi'].map(a => (
              <label key={a} style={styles.checkLabel}>
                <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                <span style={{ marginLeft: '6px' }}>{a}</span>
              </label>
            ))}
          </div>
          <button onClick={fetchRooms} style={styles.applyBtn}>Apply Filters</button>
        </div>

        {/* Room Results */}
        <div style={styles.results}>
          <div style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>🛏️ {rooms.length} Rooms Available</h2>
            <select style={styles.sortSelect}><option>Sort By</option><option>Price: Low to High</option><option>Price: High to Low</option></select>
          </div>
          {loading ? (
            <div style={styles.empty}><p>⏳ Loading rooms...</p></div>
          ) : rooms.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px' }}>🛏️</div>
              <p>No rooms available</p>
              <p style={{ color: '#888', fontSize: '13px' }}>Try adjusting your search criteria or dates</p>
              <button onClick={() => { setFilters({ checkIn: '', checkOut: '', guests: '1', type: '', minPrice: '', maxPrice: '', amenities: [] }); fetchRooms(); }} style={styles.newSearchBtn}>🔍 New Search</button>
            </div>
          ) : (
            <div style={styles.roomsList}>
              {rooms.map(room => (
                <div key={room._id} style={styles.roomCard}>
                  <div style={styles.roomImg}>
                    <span style={styles.roomType}>{room.type}</span>
                    <div style={styles.roomEmoji}>{room.type === 'Presidential Suite' ? '👑' : room.type === 'Suite' ? '🌟' : room.type === 'Deluxe' ? '✨' : '🛏️'}</div>
                  </div>
                  <div style={styles.roomDetails}>
                    <div style={styles.roomHeader}>
                      <h3 style={styles.roomName}>Room {room.roomNumber} - {room.type}</h3>
                      <span style={{ ...styles.statusBadge, background: room.status === 'available' ? '#e8f5e9' : '#fff3e0', color: room.status === 'available' ? '#2e7d32' : '#f57c00' }}>
                        {room.status === 'available' ? '✅ Available' : '⚠️ ' + room.status}
                      </span>
                    </div>
                    <p style={styles.roomDesc}>{room.description}</p>
                    <div style={styles.roomMeta}>
                      <span>👥 Max {room.capacity} guests</span>
                      <span>🏢 Floor {room.floor}</span>
                      {room.bedType && <span>🛏️ {room.bedType}</span>}
                      {room.view && <span>🪟 {room.view}</span>}
                      {room.size && <span>📐 {room.size} sq ft</span>}
                    </div>
                    <div style={styles.amenitiesRow}>
                      {room.amenities?.slice(0, 4).map(a => <span key={a} style={styles.amenityTag}>{a}</span>)}
                      {room.amenities?.length > 4 && <span style={styles.amenityTag}>+{room.amenities.length - 4} more</span>}
                    </div>
                    <div style={styles.roomFooter}>
                      <div>
                        <span style={styles.price}>₹{room.pricePerNight.toLocaleString()}</span>
                        <span style={styles.perNight}>/night</span>
                      </div>
                      <button onClick={() => handleBook(room._id)} style={styles.bookBtn} disabled={room.status !== 'available'}>
                        {room.status === 'available' ? '📅 Book Now' : '❌ Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: { background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200") center/cover', padding: '48px 24px 0', textAlign: 'center', color: '#fff' },
  heroTitle: { fontSize: '32px', fontWeight: 700, margin: '0 0 8px' },
  heroSub: { fontSize: '15px', opacity: 0.9, marginBottom: '24px' },
  searchBar: { background: 'rgba(255,255,255,0.95)', borderRadius: '10px 10px 0 0', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' },
  searchField: { flex: 1, minWidth: '130px' },
  sLabel: { display: 'block', fontSize: '11px', color: '#666', fontWeight: 600, marginBottom: '4px' },
  sInput: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' },
  searchBtn: { padding: '9px 20px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
  content: { display: 'flex', gap: '24px', maxWidth: '1200px', margin: '24px auto', padding: '0 24px' },
  sidebar: { width: '200px', flexShrink: 0, background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '20px', height: 'fit-content' },
  filterTitle: { margin: '0 0 16px', fontSize: '15px', color: '#333' },
  filterSection: { marginBottom: '20px' },
  filterLabel: { fontSize: '12px', color: '#666', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase' },
  checkLabel: { display: 'flex', alignItems: 'center', fontSize: '13px', color: '#444', marginBottom: '6px', cursor: 'pointer' },
  applyBtn: { width: '100%', padding: '8px', background: '#6B35C8', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  results: { flex: 1 },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  resultsTitle: { margin: 0, fontSize: '18px', color: '#333' },
  sortSelect: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '10px', border: '1px solid #eee' },
  newSearchBtn: { marginTop: '12px', padding: '8px 20px', background: '#6B35C8', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  roomsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  roomCard: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', display: 'flex' },
  roomImg: { width: '180px', flexShrink: 0, background: 'linear-gradient(135deg, #4B0082, #6B35C8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  roomType: { position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '12px' },
  roomEmoji: { fontSize: '48px' },
  roomDetails: { flex: 1, padding: '16px 20px' },
  roomHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  roomName: { margin: 0, fontSize: '16px', color: '#333' },
  statusBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 },
  roomDesc: { color: '#666', fontSize: '13px', margin: '0 0 8px' },
  roomMeta: { display: 'flex', gap: '16px', fontSize: '12px', color: '#888', marginBottom: '10px', flexWrap: 'wrap' },
  amenitiesRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' },
  amenityTag: { background: '#f0eaff', color: '#6B35C8', fontSize: '11px', padding: '3px 8px', borderRadius: '12px' },
  roomFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#6B35C8', fontWeight: 700, fontSize: '18px' },
  perNight: { color: '#888', fontSize: '13px', marginLeft: '2px' },
  bookBtn: { padding: '8px 20px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }
};

export default Rooms;