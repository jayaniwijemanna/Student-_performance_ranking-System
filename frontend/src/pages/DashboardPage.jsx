import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CourseManager from '../components/CourseManager';
import BatchManager from '../components/BatchManager';
import LecturerManager from '../components/LecturerManager';
import StudentManager from '../components/StudentManager';
import LecturerDashboard from '../components/LecturerDashboard';
import StudentDashboard from '../components/StudentDashboard';
import { 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Database, 
  Layers,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [mongoHealth, setMongoHealth] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState('ALL');

  // Admin Sub-Tab State
  const [adminTab, setAdminTab] = useState('lecturers'); // 'lecturers' | 'students' | 'courses' | 'batches' | 'users'

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
              Department: {user?.department || 'Academic Administration'} &bull; Staff/Student ID: {user?.staffOrStudentId || 'N/A'} {user?.batchCode ? `• Batch: ${user.batchCode}` : ''}
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

      {/* Admin View */}
      {user?.role === 'ADMIN' && (
        <>
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
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
                <GraduationCap size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {studentCount}
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${adminTab === 'lecturers' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('lecturers')}
              id="admin-tab-lecturers"
            >
              <BookOpen size={16} />
              Lecturer Management
            </button>

            <button 
              className={`btn ${adminTab === 'students' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('students')}
              id="admin-tab-students"
            >
              <GraduationCap size={16} />
              Student Management
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

            <button 
              className={`btn ${adminTab === 'users' ? 'btn-primary' : 'btn-outlined'}`}
              onClick={() => setAdminTab('users')}
              id="admin-tab-users"
            >
              <Users size={16} />
              All Users Directory
            </button>
          </div>

          {/* Tab Content: Lecturer Management */}
          {adminTab === 'lecturers' && (
            <div className="scholastic-card">
              <LecturerManager />
            </div>
          )}

          {/* Tab Content: Student Management */}
          {adminTab === 'students' && (
            <div className="scholastic-card">
              <StudentManager />
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
                            ) : u.assignedBatchCodes && u.assignedBatchCodes.length > 0 ? (
                              <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap' }}>
                                {u.assignedBatchCodes.map((bc, i) => (
                                  <span key={i} className="badge-role badge-lecturer" style={{ fontSize: '0.7rem' }}>
                                    {bc}
                                  </span>
                                ))}
                              </div>
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
        </>
      )}

      {/* Lecturer View */}
      {user?.role === 'LECTURER' && (
        <LecturerDashboard />
      )}

      {/* Student View */}
      {user?.role === 'STUDENT' && (
        <StudentDashboard />
      )}
    </div>
  );
}
