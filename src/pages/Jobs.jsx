import React, { useState, useEffect } from 'react';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock initial job load to simulate the API integrations we have on the bot
  useEffect(() => {
    setTimeout(() => {
      setJobs([
        { id: 1, title: 'Senior Software Engineer', company: 'Google', location: 'Remote', source: 'Google Jobs' },
        { id: 2, title: 'Cybersecurity Analyst', company: 'DefenseTech', location: 'Washington D.C.', source: 'USAJobs' },
        { id: 3, title: 'Full Stack Developer', company: 'Twitch', location: 'San Francisco, CA', source: 'LinkedIn' },
        { id: 4, title: 'Backend Engineer', company: 'Epic Games', location: 'Cary, NC', source: 'Arbeitnow' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Live Job Board</h2>
        <p style={styles.subtitle}>Sourced directly from LinkedIn, USAJobs, Arbeitnow, and Google Jobs.</p>
      </header>
      
      {loading ? (
        <div style={styles.loader}>Loading active listings...</div>
      ) : (
        <div style={styles.jobList}>
          {jobs.map(job => (
            <div key={job.id} className="card" style={styles.jobCard}>
              <div style={styles.jobDetails}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <h4 style={styles.company}>{job.company}</h4>
                <p style={styles.meta}>📍 {job.location}</p>
                <p style={styles.meta}>Source: {job.source}</p>
              </div>
              <div style={styles.action}>
                <button className="button-secondary">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: 'var(--text-light)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-color)',
  },
  loader: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-color)',
    fontSize: '1rem',
  },
  jobList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  jobCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
  },
  jobDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  jobTitle: {
    color: 'var(--text-light)',
    fontSize: '1.1rem',
    marginBottom: '0.1rem',
  },
  company: {
    color: 'var(--text-color)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  meta: {
    fontSize: '0.85rem',
    color: 'var(--secondary-color)',
  },
  action: {
    marginLeft: '1rem',
  }
};

export default Jobs;
