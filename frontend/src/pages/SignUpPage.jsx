import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, IdCard, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

export default function SignUpPage({ onNavigate }) {
  const { signUp, loading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('LECTURER');
  const [department, setDepartment] = useState('Computer Science');
  const [staffOrStudentId, setStaffOrStudentId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        name,
        email,
        password,
        role,
        department,
        staffOrStudentId
      });
      onNavigate('dashboard');
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="auth-page-container">
      <div className="scholastic-card">
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Register as a Lecturer or Student</p>
        </div>

        {error && (
          <div className="alert alert-danger" id="signup-alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector Pills (Lecturer & Student only) */}
          <div className="form-group">
            <label className="form-label">Select Account Role</label>
            <div className="role-selector" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div 
                className={`role-pill ${role === 'LECTURER' ? 'active' : ''}`}
                onClick={() => setRole('LECTURER')}
                id="role-select-lecturer"
              >
                <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Lecturer
              </div>
              <div 
                className={`role-pill ${role === 'STUDENT' ? 'active' : ''}`}
                onClick={() => setRole('STUDENT')}
                id="role-select-student"
              >
                <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Student
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-name"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Dr. Amal Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="amal.perera@university.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-dept">Department</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-dept"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Computing"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <Building size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-id">Staff / Student ID</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-id"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. ST001 / LEC05"
                  value={staffOrStudentId}
                  onChange={(e) => setStaffOrStudentId(e.target.value)}
                />
                <IdCard size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
            id="btn-submit-signup"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <span 
            style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => onNavigate('signin')}
            id="link-goto-signin"
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}
