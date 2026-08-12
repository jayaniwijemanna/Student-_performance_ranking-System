import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CourseManager from '../components/CourseManager';
import BatchManager from '../components/BatchManager';
import { 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Database, 
  Award, 
  AlertTriangle, 
  PlusCircle, 
  Search,
  Layers,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [mongoHealth, setMongoHealth] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState('ALL');

  // Admin Sub-Tab State
  const [adminTab, setAdminTab] = useState('users'); // 'users' | 'courses' | 'batches'

  useEffect(() => {
    fetchMongoHealth();
    fetchUsersList();
  }, []);

  const fetchMongoHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setMongoHealth(data.mongodb);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = activeRoleFilter === 'ALL' 
    ? usersList 
    : usersList.filter(u => u.role === activeRoleFilter);

  const adminCount = usersList.filter(u => u.role === 'ADMIN').length;
  const lecturerCount = usersList.filter(u => u.role === 'LECTURER').length;
  const studentCount = usersList.filter(u => u.role === 'STUDENT').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Welcome Banner */}
      <div 
        className="scholastic-card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%)',
          color: '#ffffff',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={14} />
              Logged in as {user?.role}
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '1.75rem', marginBottom: '0.4rem' }}>
              Welcome, {user?.name}
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
              Department: {user?.department || 'Academic Administration'} &bull; Staff/ID: {user?.staffOrStudentId || 'N/A'}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.25rem', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
              MongoDB Status
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={16} />
              {mongoHealth?.status === 'CONNECTED' ? `Connected (${mongoHealth?.database || 'student_performance_ranking_db'})` : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Specific View */}
      {user?.role === 'ADMIN' && (
        <>
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="scholastic-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Registered Users</span>
                <Users size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {usersList.length}
              </div>
            </div>

            <div className="scholastic-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>System Administrators</span>
                <ShieldCheck size={20} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary-hover)' }}>
                {adminCount}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
                ✓ Includes Auto-Seeded Admin
              </span>
            </div>

            <div className="scholastic-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Lecturers</span>
                <BookOpen size={20} style={{ color: 'var(--color-tertiary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-tertiary)' }}>
                {lecturerCount}
              </div>
            </div>

            <div className="scholastic-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Students</span>
                <Users size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {studentCount}
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <button 
              className={`btn ${adminTab === 'users' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('users')}
              id="admin-tab-users"
            >
              <Users size={16} />
              User Directory
            </button>

            <button 
              className={`btn ${adminTab === 'courses' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('courses')}
              id="admin-tab-courses"
            >
              <BookOpen size={16} />
              Course Management
            </button>

            <button 
              className={`btn ${adminTab === 'batches' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('batches')}
              id="admin-tab-batches"
            >
              <Layers size={16} />
              Batch Management
            </button>
          </div>

          {/* Tab Content: Users Directory */}
          {adminTab === 'users' && (
            <div className="scholastic-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>User Directory & Role Management</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    All accounts persisted in local MongoDB <code>{mongoHealth?.database || 'student_performance_ranking_db'}.users</code> collection
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['ALL', 'ADMIN', 'LECTURER', 'STUDENT'].map((r) => (
                    <button
                      key={r}
                      className={`btn btn-sm ${activeRoleFilter === r ? 'btn-primary' : 'btn-outlined'}`}
                      onClick={() => setActiveRoleFilter(r)}
                      id={`filter-role-${r.toLowerCase()}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="scholastic-table-container">
                <table className="scholastic-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Batch / Class</th>
                      <th>ID Reference</th>
                      <th>Date Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading user directory...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                          No accounts found for role: {activeRoleFilter}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td style={{ fontWeight: 600 }}>{u.name}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</td>
                          <td>
                            <span className={`badge-role ${u.role === 'ADMIN' ? 'badge-admin' : u.role === 'LECTURER' ? 'badge-lecturer' : 'badge-student'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.department || 'N/A'}</td>
                          <td>
                            {u.batchCode ? (
                              <span className="badge-role badge-lecturer" style={{ fontSize: '0.75rem' }}>
                                {u.batchCode}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{u.staffOrStudentId || 'N/A'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Seed'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Course Management */}
          {adminTab === 'courses' && (
            <div className="scholastic-card">
              <CourseManager />
            </div>
          )}

          {/* Tab Content: Batch Management */}
          {adminTab === 'batches' && (
            <div className="scholastic-card">
              <BatchManager />
            </div>
          )}
        </>
      )}

      {/* Lecturer / Student Specific View */}
      {user?.role !== 'ADMIN' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="scholastic-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Academic Operations & Ranking Engine
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Welcome to the <strong>Student Performance Ranking System</strong>. Use the operations below to manage student records and trigger AVL Tree self-balancing analysis.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#F8FAFC' }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlusCircle size={18} /> Add Student Record
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Enter module marks, exam scores, and attendance percentage.
                </p>
              </div>

              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#F8FAFC' }}>
                <div style={{ color: 'var(--color-secondary-hover)', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} /> AVL Tree Rankings
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Reverse in-order traversal ($O(n)$) to rank top performers.
                </p>
              </div>

              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#F8FAFC' }}>
                <div style={{ color: 'var(--color-danger)', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={18} /> At-Risk Detection
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Identify students with scores &lt; 50 or attendance &lt; 70%.
                </p>
              </div>

              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#F8FAFC' }}>
                <div style={{ color: 'var(--color-tertiary)', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Search size={18} /> AVL Search ($O(\log n)$)
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Fast search student nodes by performance score.
                </p>
              </div>
            </div>
          </div>

          <div className="scholastic-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>User Session</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Full Name:</span>
                <div style={{ fontWeight: 600 }}>{user?.name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Email:</span>
                <div style={{ fontWeight: 600 }}>{user?.email}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Account Role:</span>
                <div>
                  <span className={`badge-role ${user?.role === 'ADMIN' ? 'badge-admin' : user?.role === 'LECTURER' ? 'badge-lecturer' : 'badge-student'}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
