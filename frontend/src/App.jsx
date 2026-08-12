import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Layers, CheckCircle2, XCircle } from 'lucide-react';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [status, setStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setLatency(Math.round(performance.now() - start));
      setHealthData(data);
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      setHealthData({
        error: "Cannot reach Spring Boot backend",
        message: err.message,
        hint: "Make sure Spring Boot backend is running on http://localhost:8080"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-group">
          <div className="logo-badge">
            <Layers size={26} color="#ffffff" />
          </div>
          <div>
            <h1 className="brand-title">Application Dashboard</h1>
            <p className="brand-subtitle">Spring Boot Backend & React Vite Frontend</p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={checkHealth} disabled={loading} id="btn-check-health">
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Check Health
        </button>
      </header>

      <main>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="icon-box"><Activity size={20} /></span>
              Backend Status: GET /api/health
            </h2>
            
            {status === 'online' && (
              <span className="badge badge-success" id="status-badge-online">
                <span className="pulse-dot"></span>
                Backend Online {latency && `(${latency}ms)`}
              </span>
            )}
            {status === 'offline' && (
              <span className="badge badge-danger" id="status-badge-offline">
                <XCircle size={14} />
                Backend Offline
              </span>
            )}
            {status === 'checking' && (
              <span className="badge badge-warning" id="status-badge-checking">
                <RefreshCw size={14} className="spin" />
                Connecting...
              </span>
            )}
          </div>

          <div className="code-window" style={{ marginTop: '1rem' }}>
            <div className="code-header">
              <span>Response Payload</span>
              <span>{status === 'online' ? '200 OK' : 'Service Check'}</span>
            </div>
            <pre className="code-body" id="health-response-body">
              {healthData ? JSON.stringify(healthData, null, 2) : 'Loading status...'}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
