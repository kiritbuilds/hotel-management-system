import React from 'react';

const services = {
  spa: [
    { name: 'Relaxing Massage', desc: 'Full body massage with aromatic oils to relieve stress and tension.', price: '₹2,500', duration: '60 minutes', emoji: '💆' },
    { name: 'Rejuvenating Facial', desc: 'Deep cleansing facial treatment for glowing and healthy skin.', price: '₹1,800', duration: '45 minutes', emoji: '✨' },
    { name: 'Sauna Session', desc: 'Detoxify and relax in our premium sauna facilities.', price: '₹800', duration: '30 minutes', emoji: '🧖' },
  ],
  dining: [
    { name: 'The Royal Restaurant', desc: 'Experience fine dining with chef special multi-cuisine menu.', timing: '7:00 AM - 11:00 PM', cuisine: 'Multi-cuisine', price: '₹1,200 per person', emoji: '🍽️' },
    { name: 'Sky Lounge Bar', desc: 'Enjoy premium cocktails and breathtaking city views with live music every weekend.', timing: '6:00 PM - 2:00 AM', cuisine: 'Live Music', price: '₹800 per person', emoji: '🍸' },
  ],
  recreation: [
    { name: 'Swimming Pool', desc: 'Olympic-size swimming pool with poolside service and comfortable loungers.', price: 'Free for Guests', emoji: '🏊' },
    { name: 'Fitness Center', desc: 'State-of-the-art gym equipment with personal trainer services available.', price: 'Free for Guests', emoji: '🏋️' },
    { name: 'Tennis Court', desc: 'Professional tennis court with equipment rental and coaching available.', price: '₹500/hour', emoji: '🎾' },
  ],
  amenities: [
    { name: 'Free Wi-Fi', desc: 'High-speed internet throughout the hotel', emoji: '📶' },
    { name: 'Valet Parking', desc: 'Complimentary valet parking service', emoji: '🚗' },
    { name: 'Airport Shuttle', desc: 'Free shuttle service to/from airport', emoji: '🚌' },
    { name: '24/7 Concierge', desc: 'Round-the-clock guest assistance', emoji: '🎩' },
    { name: 'Babysitting', desc: 'Professional childcare services', emoji: '👶' },
    { name: 'Laundry Service', desc: 'Same-day laundry and dry cleaning', emoji: '👕' },
    { name: 'Business Center', desc: 'Meeting rooms and office facilities', emoji: '💼' },
    { name: 'Gift Shop', desc: 'Souvenirs and travel essentials', emoji: '🎁' },
  ]
};

const Services = () => (
  <div>
    <div style={styles.hero}>
      <h1 style={styles.heroTitle}>Premium Hotel Services</h1>
      <p style={styles.heroSub}>Experience luxury and comfort with our world-class amenities</p>
    </div>

    <div style={styles.content}>
      {/* Spa */}
      <h2 style={styles.sectionTitle}>🧖 Spa & Wellness</h2>
      <div style={styles.spaGrid}>
        {services.spa.map(s => (
          <div key={s.name} style={styles.spaCard}>
            <div style={styles.spaPrice}>{s.price}</div>
            <div style={styles.spaEmoji}>{s.emoji}</div>
            <h3 style={styles.serviceName}>{s.name}</h3>
            <p style={styles.serviceDesc}>{s.desc}</p>
            <div style={styles.serviceFooter}>
              <span style={styles.duration}>⏱️ {s.duration}</span>
              <button style={styles.bookBtn}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Dining */}
      <h2 style={styles.sectionTitle}>🍽️ Dining Experiences</h2>
      <div style={styles.diningGrid}>
        {services.dining.map(d => (
          <div key={d.name} style={styles.diningCard}>
            <div style={styles.diningImg}>{d.emoji}</div>
            <div style={styles.diningInfo}>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px' }}>{d.name}</h3>
              <p style={styles.serviceDesc}>{d.desc}</p>
              <div style={styles.diningMeta}>
                <div><span style={styles.metaLabel}>Timing</span><br /><strong>{d.timing}</strong></div>
                <div><span style={styles.metaLabel}>Cuisine / Special</span><br /><strong>{d.cuisine}</strong></div>
              </div>
              <div style={styles.diningFooter}>
                <span style={styles.diningPrice}>{d.price}</span>
                <button style={styles.bookBtn}>Reserve Table</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recreation */}
      <h2 style={styles.sectionTitle}>🏊 Recreation & Fitness</h2>
      <div style={styles.spaGrid}>
        {services.recreation.map(r => (
          <div key={r.name} style={styles.spaCard}>
            <div style={styles.spaEmoji}>{r.emoji}</div>
            <h3 style={styles.serviceName}>{r.name}</h3>
            <p style={styles.serviceDesc}>{r.desc}</p>
            <div style={{ padding: '12px 16px', fontWeight: 600, color: r.price.includes('Free') ? '#2e7d32' : '#6B35C8', borderTop: '1px solid #eee' }}>{r.price}</div>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <h2 style={styles.sectionTitle}>🏨 Hotel Amenities</h2>
      <div style={styles.amenitiesGrid}>
        {services.amenities.map(a => (
          <div key={a.name} style={styles.amenityCard}>
            <div style={styles.amenityIcon}>{a.emoji}</div>
            <strong style={styles.amenityName}>{a.name}</strong>
            <p style={styles.amenityDesc}>{a.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <div>
          <strong style={{ fontSize: '16px' }}>Need Help Booking Services?</strong>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>Our concierge team is available 24/7 to assist with reservations and recommendations.</p>
        </div>
        <div style={styles.ctaBtns}>
          <button style={styles.ctaBtn}>📞 Call Concierge</button>
          <button style={{ ...styles.ctaBtn, background: '#2e7d32' }}>💬 Live Chat</button>
        </div>
      </div>
    </div>
  </div>
);

const styles = {
  hero: { background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200") center/cover', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' },
  heroTitle: { margin: 0, fontSize: '30px', fontWeight: 700 },
  heroSub: { margin: '8px 0 0', opacity: 0.9 },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  sectionTitle: { margin: '40px 0 20px', color: '#333', fontSize: '22px' },
  spaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '16px' },
  spaCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: '#fff' },
  spaPrice: { position: 'absolute', top: '12px', right: '12px', background: '#1a1a1a', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 },
  spaEmoji: { fontSize: '56px', textAlign: 'center', padding: '24px 0 8px', background: '#f9f9ff' },
  serviceName: { margin: '0', padding: '12px 16px 4px', fontSize: '15px', color: '#333' },
  serviceDesc: { color: '#666', fontSize: '13px', padding: '0 16px', margin: '0 0 8px', lineHeight: 1.5 },
  serviceFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f5f5f5' },
  duration: { color: '#888', fontSize: '12px' },
  bookBtn: { padding: '6px 16px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  diningGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' },
  diningCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff' },
  diningImg: { height: '130px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' },
  diningInfo: { padding: '16px' },
  diningMeta: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#444', margin: '12px 0' },
  metaLabel: { color: '#888', fontSize: '11px', textTransform: 'uppercase' },
  diningFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' },
  diningPrice: { color: '#6B35C8', fontWeight: 700, fontSize: '15px' },
  amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
  amenityCard: { textAlign: 'center', padding: '20px 16px', border: '1px solid #eee', borderRadius: '10px', background: '#fff' },
  amenityIcon: { width: '52px', height: '52px', background: 'linear-gradient(135deg, #4B0082, #6B35C8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px' },
  amenityName: { display: 'block', color: '#333', fontSize: '14px', marginBottom: '6px' },
  amenityDesc: { color: '#888', fontSize: '12px', margin: 0 },
  cta: { background: '#f9f9ff', border: '1px solid #e0d0ff', borderRadius: '10px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  ctaBtns: { display: 'flex', gap: '12px' },
  ctaBtn: { padding: '9px 20px', background: '#4B0082', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }
};

export default Services;