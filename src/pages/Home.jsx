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
            <button className="button-primary">Find a Job</button>
          </Link>
          <Link to="/login">
            <button className="button-secondary">Sign In</button>
          </Link>
        </div>
      </header>
      
      <section style={styles.features}>
        <div className="card">
          <h3>🎮 Build Your Squad</h3>
          <p>Find like-minded players and team up for competitive or casual play across all your favorite titles.</p>
        </div>
        <div className="card">
          <h3>💼 Grow Your Career</h3>
          <p>Connect with top employers in the gaming and tech industries. Live job feeds integrated directly with our Discord.</p>
        </div>
        <div className="card">
          <h3>🏆 Community Events</h3>
          <p>Join exclusive tournaments, networking events, and community showcases to elevate your profile.</p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4rem',
    marginTop: '2rem',
  },
  header: {
    textAlign: 'center',
    maxWidth: '800px',
  },
  title: {
    fontSize: '4rem',
    color: 'var(--primary-color)',
    marginBottom: '1rem',
    textShadow: '0 0 20px rgba(102, 252, 241, 0.4)',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-color)',
    marginBottom: '2.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    width: '100%',
  }
};

export default Home;
