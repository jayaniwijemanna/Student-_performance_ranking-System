import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Layers, Users, Award, Mail, Building, IdCard, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [batchInfo, setBatchInfo] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Student Navigation Sub-Tab State
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'batch' | 'lecturers'

  useEffect(() => {
    fetchStudentAcademicData();
  }, [user]);

  const fetchStudentAcademicData = async () => {
    setLoading(true);
    try {
      const [bRes, lRes, mRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/users/role/LECTURER'),
        fetch('/api/modules')
      ]);

      if (bRes.ok && lRes.ok && mRes.ok) {
        const bData = await bRes.json();
        const lData = await lRes.json();
        const mData = await mRes.json();

        // Match student batch
        const studentBatch = bData.find(b => b.batchCode === user?.batchCode || b.id === user?.batchId);
        setBatchInfo(studentBatch);

        // Filter lecturers assigned to student's batch
        const assignedLecs = lData.filter(l => 
          (l.assignedBatchCodes && l.assignedBatchCodes.includes(user?.batchCode)) ||
          (l.assignedBatchIds && l.assignedBatchIds.includes(user?.batchId))
        );
        setLecturers(assignedLecs);

        // Filter modules for student's batch
        const batchModules = mData.filter(m => 
          m.batchCode === user?.batchCode || m.batchId === user?.batchId
        );
        setModules(batchModules);
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCredits = modules.reduce((sum, m) => sum + (m.credits || 0), 0);

  return (
    <div>
      {/* Top Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Enrolled Batch</span>
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {user?.batchCode || 'Unassigned'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {batchInfo ? batchInfo.batchName : 'Student Batch Group'}
          </span>
        </div>

        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Assigned Lecturers</span>
            <Users size={20} style={{ color: 'var(--color-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-tertiary)' }}>
            {lecturers.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            Academic Faculty
          </span>
        </div>

        <div className="scholastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Curriculum Modules</span>
            <BookOpen size={20} style={{ color: 'var(--color-secondary-hover)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary-hover)' }}>
            {modules.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-hover)', fontWeight: 700 }}>
            Total Credits: {totalCredits} Credits
          </span>
        </div>
      </div>

      {/* Student Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'modules' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('modules')}
          id="student-tab-modules"
        >
          <BookOpen size={16} />
          Enrolled Subjects & Modules
        </button>

        <button 
          className={`btn ${activeTab === 'batch' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('batch')}
          id="student-tab-batch"
        >
          <Layers size={16} />
          My Batch Details
        </button>

        <button 
          className={`btn ${activeTab === 'lecturers' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('lecturers')}
          id="student-tab-lecturers"
        >
          <Users size={16} />
          Assigned Faculty & Lecturers
        </button>
      </div>

      {/* Tab Content 1: Enrolled Subjects & Modules */}
      {activeTab === 'modules' && (
        <div className="scholastic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: 'var(--color-secondary-hover)' }} />
                Enrolled Subjects & Curriculum Modules
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Registered academic modules for batch <strong>{user?.batchCode || 'N/A'}</strong>
              </p>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(214, 158, 46, 0.15)', color: 'var(--color-secondary-hover)', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>
              <Award size={16} />
              Total Credits: {totalCredits}
            </div>
          </div>

          <div className="scholastic-table-container">
            <table className="scholastic-table">
              <thead>
                <tr>
                  <th>Module Code</th>
                  <th>Subject Title</th>
                  <th>Academic Credits</th>
                  <th>Semester</th>
                  <th>Instructor</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading curriculum modules...</td>
                  </tr>
                ) : modules.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                      No subjects/modules have been added for batch <strong>{user?.batchCode}</strong> yet.
                    </td>
                  </tr>
                ) : (
                  modules.map((mod) => (
                    <tr key={mod.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem' }}>{mod.moduleCode}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{mod.moduleName}</td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(214, 158, 46, 0.15)', color: 'var(--color-secondary-hover)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Award size={13} />
                          {mod.credits} Credits
                        </div>
                      </td>
                      <td>{mod.semester || 'Semester 1'}</td>
                      <td>{mod.lecturerName || 'Assigned Faculty'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '300px' }}>
                        {mod.description || 'Core academic module'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Batch Information Details */}
      {activeTab === 'batch' && (
        <div className="scholastic-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
            My Enrolled Batch Details
          </h3>

          {!user?.batchCode ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
              <AlertCircle size={28} style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                No batch assigned to your account. Please contact your administrator.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Batch Code</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{user.batchCode}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Batch Name</div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{batchInfo ? batchInfo.batchName : 'Software Engineering Batch'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Parent Course</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{batchInfo ? batchInfo.courseCode : 'N/A'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Academic Term</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{batchInfo ? `${batchInfo.academicYear} (${batchInfo.semester})` : 'Semester 1'}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Assigned Lecturers Section */}
      {activeTab === 'lecturers' && (
        <div className="scholastic-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} style={{ color: 'var(--color-tertiary)' }} />
            Assigned Faculty & Lecturers
          </h3>

          {lecturers.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                No lecturers have been assigned to your batch yet by administrator.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {lecturers.map((lec) => (
                <div key={lec.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', background: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                      {lec.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>{lec.name}</h4>
                      <span className="badge-role badge-lecturer" style={{ fontSize: '0.7rem' }}>LECTURER</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontFamily: 'monospace' }}>{lec.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building size={14} style={{ color: 'var(--color-secondary)' }} />
                      <span>Dept: {lec.department || 'Computing'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <IdCard size={14} style={{ color: 'var(--color-tertiary)' }} />
                      <span>Staff ID: {lec.staffOrStudentId || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
