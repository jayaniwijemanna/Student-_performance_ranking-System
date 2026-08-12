import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

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
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
