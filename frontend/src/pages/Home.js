import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: '2', type: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(search).toString();
    navigate(`/rooms?${params}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Welcome to Grand Palace Hotel</h1>
          <p style={styles.heroSubtitle}>Experience luxury and comfort in the heart of the city</p>
          <div style={styles.heroBtns}>
            <Link to="/rooms" style={styles.heroBtn}>🛏️ Book Now</Link>
            <Link to="/rooms" style={{ ...styles.heroBtn, background: 'transparent', border: '2px solid white' }}>🔍 Explore Rooms</Link>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div style={styles.searchContainer}>
        <h3 style={styles.searchTitle}>🔍 Find Your Perfect Stay</h3>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Check-in Date</label>
            <input type="date" value={search.checkIn} onChange={e => setSearch({ ...search, checkIn: e.target.value })} style={styles.searchInput} />
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Check-out Date</label>
            <input type="date" value={search.checkOut} onChange={e => setSearch({ ...search, checkOut: e.target.value })} style={styles.searchInput} />
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Guests</label>
            <select value={search.guests} onChange={e => setSearch({ ...search, guests: e.target.value })} style={styles.searchInput}>
              {[1,2,3,4,5,6].map(n => <option key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
            </select>
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Room Type</label>
            <select value={search.type} onChange={e => setSearch({ ...search, type: e.target.value })} style={styles.searchInput}>
              <option value="">All Types</option>
              <option>Standard</option><option>Deluxe</option><option>Suite</option>
              <option>Presidential Suite</option><option>Family Room</option>
            </select>
          </div>
          <button type="submit" style={styles.searchBtn}>🔍 Search</button>
        </form>
      </div>

      {/* Features */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Grand Palace?</h2>
        <p style={styles.sectionSubtitle}>Experience world-class hospitality and premium amenities</p>
        <div style={styles.featuresGrid}>
          {[
            { icon: '🎩', title: '24/7 Concierge', desc: 'Round-the-clock personalized service to make your stay memorable' },
            { icon: '🧖', title: 'Luxury Spa', desc: 'Rejuvenate your body and mind at our world-class spa facilities' },
            { icon: '🍽️', title: 'Fine Dining', desc: 'Savor exquisite cuisine at our award-winning restaurants' }
          ].map(f => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Rooms Preview */}
      <div style={{ ...styles.section, background: '#f9f9ff' }}>
        <h2 style={styles.sectionTitle}>Our Premium Rooms</h2>
        <p style={styles.sectionSubtitle}>Choose from our collection of luxurious accommodations</p>
        <div style={styles.roomsGrid}>
          {[
            { name: 'Deluxe Suite', desc: 'Spacious suite with city view, king bed, and premium amenities', price: '₹8,500/night', emoji: '🛏️' },
            { name: 'Presidential Suite', desc: 'Ultimate luxury with panoramic views and exclusive services', price: '₹15,000/night', emoji: '👑' }
          ].map(r => (
            <div key={r.name} style={styles.roomCard}>
              <div style={styles.roomImg}>{r.emoji}</div>
              <div style={styles.roomInfo}>
                <h3 style={styles.roomName}>{r.name}</h3>
                <p style={styles.roomDesc}>{r.desc}</p>
                <div style={styles.roomFooter}>
                  <span style={styles.roomPrice}>{r.price}</span>
                  <Link to="/rooms" style={styles.viewBtn}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>What Our Guests Say</h2>
        <div style={styles.reviewsGrid}>
          {[
            { text: 'Exceptional service and luxurious amenities. The staff went above and beyond to make our stay perfect.', name: 'Sarah Johnson', role: 'Business Traveler' },
            { text: 'Beautiful rooms, amazing food, and the spa was incredible. Will definitely be back!', name: 'Michael Chen', role: 'Vacation Guest' },
            { text: 'Perfect location, impeccable service, and attention to detail. Highly recommended!', name: 'Emily Davis', role: 'Wedding Guest' }
          ].map(r => (
            <div key={r.name} style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>{r.text}</p>
              <strong style={styles.reviewer}>{r.name}</strong>
              <p style={styles.reviewRole}>{r.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={styles.contactSection}>
        <div style={styles.contactInfo}>
          <h2 style={styles.contactTitle}>Get In Touch</h2>
          <p>📍 123 Luxury Avenue, City Center, State 12345</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ reservations@grandpalacehotel.com</p>
        </div>
        <div style={styles.contactForm}>
          <h3 style={styles.contactTitle}>Quick Inquiry</h3>
          <input placeholder="Your Name" style={styles.contactInput} />
          <input placeholder="Your Email" style={styles.contactInput} />
          <textarea placeholder="Your Message" rows={4} style={{ ...styles.contactInput, resize: 'vertical' }} />
          <button style={styles.contactBtn}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: { height: '320px', background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200") center/cover', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { textAlign: 'center', color: '#fff', padding: '24px' },
  heroTitle: { fontSize: '36px', fontWeight: 700, margin: '0 0 12px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
  heroSubtitle: { fontSize: '16px', margin: '0 0 24px', opacity: 0.9 },
  heroBtns: { display: 'flex', gap: '16px', justifyContent: 'center' },
  heroBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '14px' },
  searchContainer: { maxWidth: '900px', margin: '-30px auto 0', background: '#fff', borderRadius: '12px', padding: '24px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative', zIndex: 10, marginLeft: 'auto', marginRight: 'auto' },
  searchTitle: { textAlign: 'center', color: '#333', margin: '0 0 16px', fontSize: '16px' },
  searchForm: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  searchField: { flex: 1, minWidth: '140px' },
  searchLabel: { display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: 600 },
  searchInput: { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  searchBtn: { padding: '10px 24px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  section: { padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { textAlign: 'center', fontSize: '28px', color: '#222', marginBottom: '8px' },
  sectionSubtitle: { textAlign: 'center', color: '#888', marginBottom: '40px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  featureCard: { border: '1px solid #eee', borderRadius: '10px', padding: '28px', textAlign: 'center' },
  featureIcon: { fontSize: '40px', marginBottom: '12px' },
  featureTitle: { fontSize: '18px', color: '#333', margin: '0 0 8px' },
  featureDesc: { color: '#666', fontSize: '14px', lineHeight: 1.6 },
  roomsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  roomCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff' },
  roomImg: { height: '160px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' },
  roomInfo: { padding: '20px' },
  roomName: { margin: '0 0 8px', fontSize: '18px', color: '#333' },
  roomDesc: { color: '#666', fontSize: '14px', marginBottom: '16px' },
  roomFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  roomPrice: { color: '#6B35C8', fontWeight: 700, fontSize: '16px' },
  viewBtn: { padding: '7px 16px', border: '1px solid #ddd', borderRadius: '5px', textDecoration: 'none', color: '#444', fontSize: '13px' },
  reviewsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  reviewCard: { border: '1px solid #eee', borderRadius: '10px', padding: '24px' },
  stars: { fontSize: '14px', marginBottom: '8px' },
  reviewText: { color: '#555', fontSize: '13px', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.6 },
  reviewer: { color: '#333', fontSize: '14px' },
  reviewRole: { color: '#888', fontSize: '12px', margin: '2px 0 0' },
  contactSection: { background: '#f9f9ff', padding: '60px 24px', display: 'flex', gap: '60px', maxWidth: '1000px', margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' },
  contactInfo: { color: '#444', lineHeight: 2, fontSize: '15px' },
  contactTitle: { color: '#3300aa', marginBottom: '16px' },
  contactForm: { flex: 1, minWidth: '300px', maxWidth: '360px' },
  contactInput: { display: 'block', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' },
  contactBtn: { padding: '10px 24px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }
};

export default Home;