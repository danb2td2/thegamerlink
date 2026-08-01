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
    }, 1500);
  }, []);

  return (
    <div style={styles.container}>
      <h2>Live Job Board</h2>
      <p style={{ marginBottom: '2rem' }}>Sourced directly from LinkedIn, USAJobs, Arbeitnow, and Google Jobs.</p>
      
      {loading ? (
        <div style={styles.loader}>Loading active listings...</div>
      ) : (
        <div style={styles.jobList}>
          {jobs.map(job => (
            <div key={job.id} className="card" style={styles.jobCard}>
              <div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>{job.title}</h3>
                <h4 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>{job.company}</h4>
                <p style={{ fontSize: '0.9rem' }}>📍 {job.location}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', marginTop: '0.5rem' }}>Source: {job.source}</p>
              </div>
              <div>
                <button className="button-primary">Apply Now</button>
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
  loader: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--secondary-color)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
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
  }
};

export default Jobs;
