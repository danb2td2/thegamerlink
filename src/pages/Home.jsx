import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="main-content">
      <header className="hero">
        <h1 className="hero-title">Play together. Level up together. Get hired together.</h1>
        <p className="hero-sub">
          TheGamerLink is the job seeker community that works like your favorite game:
          hang out in live voice and video rooms, chat in real time, earn XP for being active,
          and find your next role in a job board built for gamers.
        </p>
        <div className="hero-actions">
          <Link to="/community"><button className="button-primary">Enter the Community</button></Link>
          <Link to="/jobs"><button className="button-secondary">Browse Jobs</button></Link>
          {!user && <Link to="/login"><button className="button-secondary">Create your Gamertag</button></Link>}
        </div>
      </header>

      <section className="features">
        <div className="card">
          <div className="feature-icon">💬</div>
          <h3>Real-Time Chat</h3>
          <p>Discord-style channels for #general, #introductions, and #job-leads — with reactions, typing indicators, and live member presence.</p>
        </div>
        <div className="card">
          <div className="feature-icon">🎙️</div>
          <h3>Voice & Video Rooms</h3>
          <p>Jump into the Lounge for casual hangouts or Interview Prep to mock-interview with live video, just like partying up on console.</p>
        </div>
        <div className="card">
          <div className="feature-icon">🎯</div>
          <h3>Gamer Job Board</h3>
          <p>Roles from Epic, Riot, Twitch, and more. Apply with a quick note and track it from your profile while you grind XP in the community.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
