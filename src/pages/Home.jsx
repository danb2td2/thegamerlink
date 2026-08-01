import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>TheGamerLink</h1>
        <p style={styles.subtitle}>
          The ultimate destination for gamers to build squads for play and connect with industry employers for professional career growth in gaming.
        </p>
        <div style={styles.actions}>
          <Link to="/jobs">
            <button className="button-primary">Jobs</button>
          </Link>
          <Link to="/login">
            <button className="button-secondary">Login</button>
          </Link>
        </div>
      </header>
      
      <section style={styles.features}>
        <div className="card" style={styles.cardLayout}>
          <div>
            <h3>Build Your Squad</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '0.5rem' }}>Find like-minded players and team up for competitive or casual play across all your favorite titles.</p>
          </div>
        </div>
        <div className="card" style={styles.cardLayout}>
          <div>
            <h3>Grow Your Career</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '0.5rem' }}>Connect with top employers in the gaming and tech industries. Live job feeds integrated directly with our Discord.</p>
          </div>
        </div>
        <div className="card" style={styles.cardLayout}>
          <div>
            <h3>Community Events</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '0.5rem' }}>Join exclusive tournaments, networking events, and community showcases to elevate your profile.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '3rem',
    marginTop: '1rem',
  },
  header: {
    textAlign: 'left',
    maxWidth: '600px',
  },
  title: {
    fontSize: '3rem',
    color: 'var(--text-light)',
    marginBottom: '1rem',
    letterSpacing: '-0.05em',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-color)',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  cardLayout: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
  }
};

export default Home;
