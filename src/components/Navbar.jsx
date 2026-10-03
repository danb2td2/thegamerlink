import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/" className="logo-text">TheGamerLink</Link>
      </div>
      <div className="nav-links">
        <Link to="/community" className="nav-link">Community</Link>
        <Link to="/jobs" className="nav-link">Jobs</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-link nav-user">
              <span className="avatar-dot" style={{ background: user.accent }}>{user.gamertag[0]}</span>
              {user.gamertag}
            </Link>
            <button className="button-secondary" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login" className="button-primary">Sign in</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
