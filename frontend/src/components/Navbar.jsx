import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, BookOpen, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge-role badge-admin"><Shield size={12} /> Admin</span>;
      case 'LECTURER':
        return <span className="badge-role badge-lecturer"><BookOpen size={12} /> Lecturer</span>;
      default:
        return <span className="badge-role badge-student"><UserIcon size={12} /> Student</span>;
    }
  };

  return (
    <nav className="scholastic-navbar">
      <div className="brand-container" onClick={() => onNavigate('dashboard')}>
        <div className="brand-icon-box">
          <BookOpen size={22} />
        </div>
        <div>
          <h1 className="brand-title">Scholastic Insight</h1>
          <span className="brand-subtitle">Student Performance Ranking System</span>
        </div>
      </div>

      <div className="user-nav-actions">
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {user.email}
                </div>
              </div>
              {getRoleBadge(user.role)}
            </div>

            <button className="btn btn-outlined btn-sm" onClick={logout} id="nav-btn-logout">
              <LogOut size={14} />
              Sign Out
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button 
              className={`btn ${currentPage === 'signin' ? 'btn-primary' : 'btn-outlined'}`} 
              onClick={() => onNavigate('signin')}
              id="nav-btn-signin"
            >
              Sign In
            </button>
            <button 
              className={`btn ${currentPage === 'signup' ? 'btn-secondary' : 'btn-outlined'}`} 
              onClick={() => onNavigate('signup')}
              id="nav-btn-signup"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
