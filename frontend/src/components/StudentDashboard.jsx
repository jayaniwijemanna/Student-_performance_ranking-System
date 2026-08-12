import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Layers, 
  Users, 
  Award, 
  Mail, 
  Building, 
  IdCard, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Calculator,
  ShieldCheck
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [batchInfo, setBatchInfo] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [modules, setModules] = useState([]);
  const [myPerformances, setMyPerformances] = useState([]);
  const [batchRankings, setBatchRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Student Navigation Sub-Tab State: 'performance' | 'modules' | 'batch' | 'lecturers'
  const [activeTab, setActiveTab] = useState('performance');

  useEffect(() => {
    fetchStudentAcademicData();
  }, [user]);

  const fetchStudentAcademicData = async () => {
    setLoading(true);
    try {
      const [bRes, lRes, mRes, pRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/users/role/LECTURER'),
        fetch('/api/modules'),
        fetch('/api/performances/rankings')
      ]);

      if (bRes.ok && lRes.ok && mRes.ok && pRes.ok) {
        const bData = await bRes.json();
        const lData = await lRes.json();
        const mData = await mRes.json();
        const pData = await pRes.json();

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

        // Strict performance matching by student ID, Email, or Mongo ID with 2-way Name check
        const stdStaffId = user?.staffOrStudentId?.trim();
        const stdEmail = user?.email?.trim();
        const stdMongoId = user?.id?.trim();
        const stdName = user?.name?.trim()?.toLowerCase();

        const myPerfs = pData.filter(p => {
          if (!p.studentId || p.studentId.trim() === '') return false;
          const pid = p.studentId.trim();

          const matchesStaffId = stdStaffId && stdStaffId !== '' && pid === stdStaffId;
          const matchesEmail = stdEmail && stdEmail !== '' && pid === stdEmail;
          const matchesMongoId = stdMongoId && stdMongoId !== '' && pid === stdMongoId;

          if (matchesStaffId) {
            // Verify student name consistency if student name is present in record
            if (p.studentName && stdName && p.studentName.trim().toLowerCase() !== stdName) {
              return false; // Prevents matching records of another student who shares the same staff ID
            }
            return true;
          }

          return matchesEmail || matchesMongoId;
        });

        setMyPerformances(myPerfs);
        setBatchRankings(pData);
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCredits = modules.reduce((sum, m) => sum + (m.credits || 0), 0);

  // Overall Performance Statistics
  const evaluatedCount = myPerformances.length;
  const averageScore = evaluatedCount > 0
    ? Math.round((myPerformances.reduce((acc, curr) => acc + curr.performanceScore, 0) / evaluatedCount) * 100) / 100
    : 0;

  const isAtRiskOverall = evaluatedCount > 0 && myPerformances.some(p => p.performanceScore < 50 || p.attendancePercentage < 70 || p.status === 'At Risk');

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
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Academic Standing</span>
            {isAtRiskOverall ? (
              <AlertTriangle size={20} style={{ color: 'var(--color-danger)' }} />
            ) : (
              <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
            )}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isAtRiskOverall ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {evaluatedCount === 0 ? 'Pending' : isAtRiskOverall ? 'At Risk' : 'Good Standing'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Average Score: {averageScore > 0 ? `${averageScore}%` : 'N/A'}
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
          className={`btn ${activeTab === 'performance' ? 'btn-primary' : 'btn-outlined'}`}
          onClick={() => setActiveTab('performance')}
          id="student-tab-performance"
        >
          <Award size={16} />
          My Subject Performances & AVL Standing
        </button>

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

      {/* Tab Content 1: My Subject Performances & AVL Standing */}
      {activeTab === 'performance' && (
        <div>
          {/* Standing Highlight Area (Good Standing vs At-Risk Area Callout) */}
          <div className="scholastic-card" style={{ 
            marginBottom: '1.75rem',
            borderLeft: isAtRiskOverall ? '5px solid var(--color-danger)' : '5px solid var(--color-success)',
            background: isAtRiskOverall ? 'rgba(197, 48, 48, 0.04)' : 'linear-gradient(135deg, rgba(47, 133, 90, 0.05) 0%, rgba(26, 54, 93, 0.05) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {isAtRiskOverall ? (
                    <AlertTriangle size={24} style={{ color: 'var(--color-danger)' }} />
                  ) : (
                    <CheckCircle2 size={24} style={{ color: 'var(--color-success)' }} />
                  )}
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: isAtRiskOverall ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {evaluatedCount === 0
                      ? 'Academic Performance Standing Pending'
                      : isAtRiskOverall
                      ? '⚠️ AT-RISK ACADEMIC AREA DETECTED'
                      : '🏆 GOOD STANDING ACADEMIC AREA'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, maxWidth: '780px' }}>
                  {evaluatedCount === 0
                    ? 'Your lecturers have not submitted module evaluation marks yet. Check back soon after assignment or exam marking.'
                    : isAtRiskOverall
                    ? 'Your self-balancing AVL Tree ranking indicates you have at least 1 module with performance score < 50.0 or attendance < 70%. Academic intervention is recommended.'
                    : 'Congratulations! You are maintained in the Good Standing area of the self-balanced AVL tree across your enrolled modules.'}
                </p>
              </div>

              {evaluatedCount > 0 && (
                <div style={{ textAlign: 'right', background: '#FFFFFF', padding: '0.85rem 1.25rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Cumulative Score
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {averageScore} / 100
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Performance Breakdown Cards */}
          <div className="scholastic-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} style={{ color: 'var(--color-secondary-hover)' }} />
              Module Performance Breakdown & AVL Class Rankings
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading academic performance records...</div>
            ) : modules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
                <BookOpen size={32} style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>No Enrolled Modules Found</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                  No curriculum modules have been added for batch <strong>{user?.batchCode || 'N/A'}</strong> yet.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {modules.map((mod) => {
                  const perf = myPerformances.find(p => p.moduleCode === mod.moduleCode);
                  const isGraded = !!perf;
                  const isModAtRisk = isGraded && (perf.performanceScore < 50 || perf.attendancePercentage < 70 || perf.status === 'At Risk');

                  return (
                    <div 
                      key={mod.id} 
                      style={{ 
                        border: '1px solid var(--color-border)', 
                        borderRadius: '12px', 
                        padding: '1.35rem', 
                        background: '#FFFFFF', 
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative',
                        borderTop: !isGraded 
                          ? '4px solid #CBD5E1' 
                          : isModAtRisk 
                          ? '4px solid var(--color-danger)' 
                          : '4px solid var(--color-success)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                            {mod.moduleCode}
                          </span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.3rem 0 0 0', color: 'var(--color-text-main)' }}>
                            {mod.moduleName}
                          </h4>
                        </div>

                        {isGraded ? (
                          <span className={`badge-role ${perf.performanceScore >= 85 ? 'badge-admin' : perf.performanceScore >= 65 ? 'badge-lecturer' : 'badge-student'}`}>
                            {perf.performanceCategory}
                          </span>
                        ) : (
                          <span className="badge-role" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', fontSize: '0.75rem', fontWeight: 600 }}>
                            ⏳ Marks Pending
                          </span>
                        )}
                      </div>

                      {isGraded ? (
                        <>
                          {/* Score Breakdown Table */}
                          <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Assignment (30%)</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{perf.assignmentMarks}%</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Exam (60%)</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{perf.examMarks}%</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Attendance (10%)</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: perf.attendancePercentage < 70 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                                  {perf.attendancePercentage}%
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Overall Score & Standing Footer */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Performance Score</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                {perf.performanceScore} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 100</span>
                              </div>
                            </div>

                            <div>
                              {isModAtRisk ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                                  ⚠️ At Risk Area
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(47, 133, 90, 0.1)', color: 'var(--color-success)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                                  ✓ Good Standing Area
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px border-dashed var(--color-border)', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem 0' }}>
                            Instructor has not submitted marks for this module yet. Score will appear after evaluation.
                          </p>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                            Instructor: {mod.lecturerName || 'Assigned Lecturer'} &bull; {mod.credits} Credits
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Enrolled Subjects & Modules */}
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

      {/* Tab Content 3: Batch Information Details */}
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

      {/* Tab Content 4: Assigned Lecturers Section */}
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
