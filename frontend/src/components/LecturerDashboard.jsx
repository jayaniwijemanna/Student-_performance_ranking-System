import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ModuleManager from './ModuleManager';
import { Layers, Users, BookOpen, Search, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');

  // Lecturer Sub-Tab State
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'batches' | 'students'

  useEffect(() => {
    fetchLecturerData();
  }, []);

  const fetchLecturerData = async () => {
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/users/role/STUDENT')
      ]);

      if (bRes.ok && sRes.ok) {
        const bData = await bRes.json();
        const sData = await sRes.json();
        setBatches(bData);
        setStudents(sData);
      }
    } catch (err) {
      console.error('Failed to load lecturer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter batches assigned to this lecturer
  const assignedBatchCodes = user?.assignedBatchCodes || [];
  const assignedBatchIds = user?.assignedBatchIds || [];

  const myBatches = batches.filter(b => 
    assignedBatchCodes.includes(b.batchCode) || assignedBatchIds.includes(b.id)
  );

  // Filter students belonging to assigned batches
  const myStudents = students.filter(s => 
    s.batchCode && assignedBatchCodes.includes(s.batchCode)
  );

  const filteredStudents = (selectedBatchFilter === 'ALL' 
    ? myStudents 
    : myStudents.filter(s => s.batchCode === selectedBatchFilter)
  ).filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.staffOrStudentId && s.staffOrStudentId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Lecturer Summary Metrics Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Assigned Batches</span>
            <Layers size={20} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary-hover)' }}>
            {myBatches.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Active Teaching Load
          </span>
        </div>

        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Enrolled Students</span>
            <Users size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {myStudents.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            Across {myBatches.length} Batches
          </span>
        </div>

        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Department</span>
            <BookOpen size={20} style={{ color: 'var(--color-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-tertiary)' }}>
            {user?.department || 'Computing'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Staff ID: {user?.staffOrStudentId || 'N/A'}
          </span>
        </div>
      </div>

      {/* Lecturer Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'modules' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('modules')}
          id="lecturer-tab-modules"
        >
          <BookOpen size={16} />
          Subject / Module Management
        </button>

        <button 
          className={`btn ${activeTab === 'batches' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('batches')}
          id="lecturer-tab-batches"
        >
          <Layers size={16} />
          My Assigned Batches
        </button>

        <button 
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('students')}
          id="lecturer-tab-students"
        >
          <Users size={16} />
          Student Roster
        </button>
      </div>

      {/* Tab Content: Subject / Module Management */}
      {activeTab === 'modules' && (
        <div className="scholastic-card">
          <ModuleManager />
        </div>
      )}

      {/* Tab Content: Assigned Batches View */}
      {activeTab === 'batches' && (
        <div className="scholastic-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} style={{ color: 'var(--color-secondary)' }} />
            My Assigned Teaching Batches
          </h3>

          {myBatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px border-dashed var(--color-border)' }}>
              <AlertCircle size={32} style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.3rem' }}>No Batches Assigned Yet</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Your administrator has not assigned any teaching batches to your account yet. Please request batch assignment from the System Administrator.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {myBatches.map((b) => (
                <div key={b.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span className="badge-role badge-lecturer" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {b.batchCode}
                    </span>
                    <span className="badge-role badge-admin" style={{ background: 'rgba(47, 133, 90, 0.1)', color: 'var(--color-success)', fontSize: '0.75rem' }}>
                      {b.status || 'ACTIVE'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
                    {b.batchName}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Course Code: <strong style={{ color: 'var(--color-primary)' }}>{b.courseCode}</strong> &bull; Term: {b.academicYear} ({b.semester})
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Enrolled Students:
                    </span>
                    <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      {students.filter(s => s.batchCode === b.batchCode).length} Students
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Student Roster View */}
      {activeTab === 'students' && (
        <div className="scholastic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Student Roster by Assigned Batch</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Students enrolled under your teaching batches ready for mark evaluation
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="form-control"
                style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                id="lecturer-select-batch-filter-roster"
              >
                <option value="ALL">All My Batches ({myStudents.length})</option>
                {assignedBatchCodes.map((code) => (
                  <option key={code} value={code}>
                    Batch: {code}
                  </option>
                ))}
              </select>

              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control"
                  style={{ paddingLeft: '2.2rem', width: '200px', paddingRight: '1rem' }}
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="lecturer-search-student-roster"
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              </div>
            </div>
          </div>

          <div className="scholastic-table-container">
            <table className="scholastic-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Enrolled Batch</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading student roster...</td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      {myBatches.length === 0 
                        ? 'No batches assigned to your lecturer account yet.' 
                        : 'No students enrolled in the selected batch filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
                    <tr key={std.id}>
                      <td style={{ fontWeight: 600 }}>{std.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{std.email}</td>
                      <td style={{ fontWeight: 700 }}>{std.staffOrStudentId || 'N/A'}</td>
                      <td>
                        <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem' }}>
                          {std.batchCode || 'N/A'}
                        </span>
                      </td>
                      <td>{std.department || 'Computing'}</td>
                      <td>
                        <span className="badge-role badge-admin" style={{ background: 'rgba(47, 133, 90, 0.1)', color: 'var(--color-success)', fontSize: '0.75rem' }}>
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
