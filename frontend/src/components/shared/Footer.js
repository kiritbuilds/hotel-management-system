import React from 'react';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.brand}>🏨 Grand Palace Hotel</div>
        <div style={styles.socials}>
          <span style={styles.social}>f</span>
          <span style={styles.social}>t</span>
          <span style={styles.social}>in</span>
          <span style={styles.social}>ig</span>
        </div>
      </div>
      <div style={styles.section}>
        <h4 style={styles.heading}>QUICK LINKS</h4>
        <p style={styles.footerLink}>Home</p>
        <p style={styles.footerLink}>Search Rooms</p>
        <p style={styles.footerLink}>Services</p>
        <p style={styles.footerLink}>Contact</p>
      </div>
      <div style={styles.section}>
        <h4 style={styles.heading}>CONTACT INFO</h4>
        <p style={styles.text}>📍 123 Luxury Avenue, City Center</p>
        <p style={styles.text}>📞 +91 98765 43210</p>
        <p style={styles.text}>✉️ reservations@grandpalace.com</p>
      </div>
      <div style={styles.section}>
        <h4 style={styles.heading}>BUSINESS HOURS</h4>
        <p style={styles.text}>Check-in: 2:00 PM</p>
        <p style={styles.text}>Check-out: 11:00 AM</p>
        <p style={styles.text}>Front Desk: 24/7</p>
      </div>
    </div>
    <div style={styles.bottom}>
      <span>© 2024 Grand Palace Hotel. All rights reserved.</span>
      <span style={styles.credit}>TSS Consultancy Services</span>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#1a1a2e', color: '#aaa', padding: '40px 0 0', marginTop: '60px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' },
  section: {},
  brand: { color: '#6B35C8', fontWeight: 700, fontSize: '16px', marginBottom: '12px' },
  socials: { display: 'flex', gap: '8px' },
  social: { background: '#333', color: '#fff', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  heading: { color: '#fff', fontSize: '12px', letterSpacing: '1px', marginBottom: '12px', marginTop: 0 },
  footerLink: { fontSize: '13px', margin: '4px 0', cursor: 'pointer' },
  text: { fontSize: '13px', margin: '4px 0' },
  bottom: { borderTop: '1px solid #333', marginTop: '32px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  credit: { color: '#6B35C8' }
};

export default Footer;