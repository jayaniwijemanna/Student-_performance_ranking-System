import React, { useState, Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('scholastic_user');
    localStorage.removeItem('scholastic_token');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: '540px',
          margin: '5rem auto',
          padding: '2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <AlertCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            Application Session Recovered
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            A temporary session parsing issue occurred ({this.state.error?.message || 'Unknown error'}). Click below to clear stored state and restore your sign-in view.
          </p>
          <button className="btn btn-primary" onClick={this.handleReset} style={{ width: '100%' }}>
            <RefreshCw size={16} /> Restore & Refresh Session
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => (user ? 'dashboard' : 'signin'));

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="scholastic-app">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main style={{ flex: 1 }}>
        {user ? (
          <DashboardPage />
        ) : currentPage === 'signup' ? (
          <SignUpPage onNavigate={handleNavigate} />
        ) : (
          <SignInPage onNavigate={handleNavigate} />
        )}
      </main>

      <footer style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderTop: '1px solid var(--color-border)', 
        padding: '1.25rem 2rem', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--color-text-muted)',
        marginTop: '3rem' 
      }}>
        <p><strong>Scholastic Insight</strong> &bull; Student Performance Ranking System &bull; Powered by Spring Boot & React Vite</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ErrorBoundary>
  );
}
