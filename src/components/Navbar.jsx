import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>TheGamerLink</Link>
      </div>
      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Jobs</Link>
        <Link to="/login" style={styles.link}>Login</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'var(--panel-bg)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  logoText: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: 'var(--text-light)',
    fontWeight: '500',
    textDecoration: 'none',
  }
};

export default Navbar;
