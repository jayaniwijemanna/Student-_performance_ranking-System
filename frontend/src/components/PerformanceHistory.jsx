import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Clock, TrendingUp, TrendingDown, Minus, History,
  ChevronDown, ChevronRight, BookOpen, Link2, ArrowRight
} from 'lucide-react';

/**
 * PerformanceHistory — Displays the Singly Linked List based
 * performance history tracker.
 *
 * Props:
 *   - viewMode: "student" | "lecturer"
 *     - "student": Shows the logged-in student's own history
 *     - "lecturer": Shows all students in the lecturer's batches
 *
 * Data Structure Visualization:
 *   Each history entry is a node in the Singly Linked List.
 *   Nodes are displayed with visual chain links (→) from newest to oldest.
 */
export default function PerformanceHistory({ viewMode = 'student' }) {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState(null);       // Student's own history
  const [batchHistories, setBatchHistories] = useState([]);    // Lecturer's batch view
  const [moduleHistories, setModuleHistories] = useState([]);  // Module-grouped view
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [batches, setBatches] = useState([]);
  const [expandedStudents, setExpandedStudents] = useState({}); // Track expanded accordion
  const [viewType, setViewType] = useState('overall'); // 'overall' | 'byModule'

  useEffect(() => {
    if (viewMode === 'student') {
      fetchStudentHistory();
    } else {
      fetchLecturerBatches();
    }
  }, [user, viewMode]);

  // --- Student View: Fetch own history ---
  const fetchStudentHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const studentId = user.staffOrStudentId || user.id;

      // Fetch overall history
      const res = await fetch(`/api/history/student/${encodeURIComponent(studentId)}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }

      // Fetch module-grouped history
      const mRes = await fetch(`/api/history/student/${encodeURIComponent(studentId)}/modules`);
      if (mRes.ok) {
        const mData = await mRes.json();
        setModuleHistories(mData);
      }
    } catch (err) {
      console.error('Failed to load student history:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Lecturer View: Get assigned batches ---
  const fetchLecturerBatches = async () => {
    try {
      const bRes = await fetch('/api/batches');
      if (bRes.ok) {
        const bData = await bRes.json();
        const assignedCodes = user?.assignedBatchCodes || [];
        const myBatches = bData.filter(b => assignedCodes.includes(b.batchCode));
        setBatches(myBatches);
        if (myBatches.length > 0) {
          setSelectedBatch(myBatches[0].batchCode);
          fetchBatchHistory(myBatches[0].batchCode);
        }
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  // --- Lecturer View: Fetch batch history ---
  const fetchBatchHistory = async (batchCode) => {
    if (!batchCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/history/batch/${encodeURIComponent(batchCode)}`);
      if (res.ok) {
        const data = await res.json();
        setBatchHistories(data);
      }
    } catch (err) {
      console.error('Failed to load batch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (code) => {
    setSelectedBatch(code);
    fetchBatchHistory(code);
  };

  const toggleStudent = (studentId) => {
    setExpandedStudents(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // --- Trend Badge ---
  const TrendBadge = ({ trend }) => {
    const config = {
      'Improving': { icon: <TrendingUp size={14} />, color: '#2F855A', bg: 'rgba(47, 133, 90, 0.12)', label: '📈 Improving' },
      'Declining': { icon: <TrendingDown size={14} />, color: '#C53030', bg: 'rgba(197, 48, 48, 0.12)', label: '📉 Declining' },
      'Stable': { icon: <Minus size={14} />, color: '#D69E2E', bg: 'rgba(214, 158, 46, 0.12)', label: '➡️ Stable' },
      'Insufficient Data': { icon: <Clock size={14} />, color: '#718096', bg: 'rgba(113, 128, 150, 0.12)', label: '⏳ Awaiting Data' }
    };
    const c = config[trend] || config['Insufficient Data'];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        padding: '0.25rem 0.75rem', borderRadius: '999px',
        fontSize: '0.78rem', fontWeight: 700,
        color: c.color, background: c.bg
      }}>
        {c.icon} {c.label}
      </span>
    );
  };

  // --- Score Change Badge ---
  const ScoreChangeBadge = ({ change }) => {
    if (change === 0) return <span style={{ color: '#718096', fontSize: '0.8rem' }}>No change</span>;
    const isPositive = change > 0;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        fontSize: '0.8rem', fontWeight: 700,
        color: isPositive ? '#2F855A' : '#C53030'
      }}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(1)} pts
      </span>
    );
  };

  // --- Linked List Node Card ---
  const LinkedListNodeCard = ({ entry, isLast }) => {
    const catColors = {
      'Excellent': '#2F855A',
      'Very Good': '#38A169',
      'Good': '#D69E2E',
      'Satisfactory': '#DD6B20',
      'At Risk': '#C53030'
    };
    const catColor = catColors[entry.performanceCategory] || '#718096';

    return (
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
        {/* Node */}
        <div style={{
          flex: 1,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {/* Node Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: entry.action === 'CREATED' ? 'rgba(47, 133, 90, 0.15)' : entry.action === 'UPDATED' ? 'rgba(49, 130, 206, 0.15)' : 'rgba(197, 48, 48, 0.15)',
                color: entry.action === 'CREATED' ? '#2F855A' : entry.action === 'UPDATED' ? '#3182CE' : '#C53030',
                padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700
              }}>
                {entry.action}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Entry #{entry.entryNumber}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A'}
            </span>
          </div>

          {/* Node Data Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Module</div>
              <div style={{ fontWeight: 600 }}>{entry.moduleCode || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Assignment</div>
              <div style={{ fontWeight: 600 }}>{entry.assignmentMarks?.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Exam</div>
              <div style={{ fontWeight: 600 }}>{entry.examMarks?.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Attendance</div>
              <div style={{ fontWeight: 600 }}>{entry.attendancePercentage?.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Score</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: catColor }}>{entry.performanceScore?.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Category</div>
              <span style={{ fontWeight: 700, color: catColor, fontSize: '0.78rem' }}>{entry.performanceCategory}</span>
            </div>
          </div>
        </div>

        {/* Linked List Arrow (→ next pointer) */}
        {!isLast && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minWidth: '50px', padding: '0 0.25rem'
          }}>
            <div style={{
              width: '2px', height: '20px',
              background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))'
            }} />
            <ArrowRight size={18} style={{ color: 'var(--color-primary)', transform: 'rotate(90deg)' }} />
            <span style={{
              fontSize: '0.6rem', color: 'var(--color-text-muted)',
              fontWeight: 600, fontFamily: 'monospace', marginTop: '2px'
            }}>
              next
            </span>
            <div style={{
              width: '2px', height: '20px',
              background: 'linear-gradient(to bottom, var(--color-secondary), var(--color-primary))'
            }} />
          </div>
        )}
      </div>
    );
  };

  // --- Render Student View ---
  const renderStudentView = () => {
    if (!historyData && moduleHistories.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <History size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Performance History Yet</p>
          <p style={{ fontSize: '0.85rem' }}>History entries will appear here once your lecturer records evaluations.</p>
        </div>
      );
    }

    return (
      <div>
        {/* Overall Summary */}
        {historyData && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem', marginBottom: '1.5rem'
          }}>
            <div className="scholastic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>Overall Trend</div>
              <TrendBadge trend={historyData.trend} />
            </div>
            <div className="scholastic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>Latest Change</div>
              <ScoreChangeBadge change={historyData.scoreChange} />
            </div>
            <div className="scholastic-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>Total Entries</div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{historyData.totalEntries}</span>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            className={`btn ${viewType === 'overall' ? 'btn-primary' : 'btn-outlined'}`}
            onClick={() => setViewType('overall')}
            style={{ fontSize: '0.8rem' }}
          >
            <Link2 size={14} /> Full Linked List
          </button>
          <button
            className={`btn ${viewType === 'byModule' ? 'btn-primary' : 'btn-outlined'}`}
            onClick={() => setViewType('byModule')}
            style={{ fontSize: '0.8rem' }}
          >
            <BookOpen size={14} /> By Module
          </button>
        </div>

        {/* Full Linked List View */}
        {viewType === 'overall' && historyData && (
          <div>
            {/* DS Label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1rem', padding: '0.5rem 0.75rem',
              background: 'rgba(49, 130, 206, 0.08)', borderRadius: '8px',
              border: '1px solid rgba(49, 130, 206, 0.2)'
            }}>
              <Link2 size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                Singly Linked List — Head (Newest) → Tail (Oldest)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                Insertion: O(1) | Traversal: O(n)
              </span>
            </div>

            {/* HEAD label */}
            {historyData.entries.length > 0 && (
              <div style={{
                textAlign: 'center', marginBottom: '0.5rem',
                fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-success)',
                fontFamily: 'monospace', letterSpacing: '0.1em'
              }}>
                ▼ HEAD (newest)
              </div>
            )}

            {/* Linked List Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
              {historyData.entries.map((entry, idx) => (
                <div key={entry.entryId || idx} style={{ width: '100%', maxWidth: '600px' }}>
                  <LinkedListNodeCard
                    entry={entry}
                    isLast={idx === historyData.entries.length - 1}
                  />
                </div>
              ))}
            </div>

            {/* NULL terminator */}
            {historyData.entries.length > 0 && (
              <div style={{
                textAlign: 'center', marginTop: '0.5rem',
                fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-danger)',
                fontFamily: 'monospace', letterSpacing: '0.1em'
              }}>
                ▼ NULL (end)
              </div>
            )}
          </div>
        )}

        {/* Module-Grouped View */}
        {viewType === 'byModule' && moduleHistories.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {moduleHistories.map((mod, modIdx) => (
              <div key={mod.moduleCode || modIdx} className="scholastic-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{mod.moduleCode}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>{mod.moduleName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <TrendBadge trend={mod.trend} />
                    <ScoreChangeBadge change={mod.scoreChange} />
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--color-text-muted)',
                      background: 'var(--color-bg-card)', padding: '0.2rem 0.5rem', borderRadius: '6px'
                    }}>
                      {mod.totalEntries} entries
                    </span>
                  </div>
                </div>

                {/* Module Linked List Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                  {mod.entries.map((entry, idx) => (
                    <div key={entry.entryId || idx} style={{ width: '100%', maxWidth: '580px' }}>
                      <LinkedListNodeCard
                        entry={entry}
                        isLast={idx === mod.entries.length - 1}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Render Lecturer View ---
  const renderLecturerView = () => {
    return (
      <div>
        {/* Batch Selector */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Select Batch:</label>
          <select
            className="input"
            value={selectedBatch}
            onChange={e => handleBatchChange(e.target.value)}
            style={{ maxWidth: '260px' }}
          >
            {batches.map(b => (
              <option key={b.id} value={b.batchCode}>{b.batchCode} — {b.batchName}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Loading history...
          </div>
        )}

        {!loading && batchHistories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <History size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No History for This Batch</p>
            <p style={{ fontSize: '0.85rem' }}>Enter student marks first — history entries will be recorded automatically.</p>
          </div>
        )}

        {/* Student Accordions */}
        {!loading && batchHistories.map((student, sIdx) => (
          <div key={student.studentId || sIdx} className="scholastic-card" style={{ marginBottom: '0.75rem', overflow: 'hidden' }}>
            {/* Accordion Header */}
            <div
              onClick={() => toggleStudent(student.studentId)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.25rem', cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(49, 130, 206, 0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {expandedStudents[student.studentId]
                  ? <ChevronDown size={18} style={{ color: 'var(--color-primary)' }} />
                  : <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                }
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{student.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ID: {student.studentId} • {student.totalEntries} history entries
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <TrendBadge trend={student.trend} />
                <ScoreChangeBadge change={student.scoreChange} />
              </div>
            </div>

            {/* Accordion Body — Linked List */}
            {expandedStudents[student.studentId] && (
              <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                {/* DS Label */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  margin: '1rem 0 0.75rem', padding: '0.4rem 0.6rem',
                  background: 'rgba(49, 130, 206, 0.06)', borderRadius: '6px',
                  border: '1px dashed rgba(49, 130, 206, 0.2)'
                }}>
                  <Link2 size={14} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                    SinglyLinkedList → HEAD (newest) ... TAIL (oldest) → NULL
                  </span>
                </div>

                {/* Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                  {student.entries.map((entry, idx) => (
                    <div key={entry.entryId || idx} style={{ width: '100%', maxWidth: '560px' }}>
                      <LinkedListNodeCard
                        entry={entry}
                        isLast={idx === student.entries.length - 1}
                      />
                    </div>
                  ))}
                </div>

                {student.entries.length > 0 && (
                  <div style={{
                    textAlign: 'center', marginTop: '0.5rem',
                    fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-danger)',
                    fontFamily: 'monospace', letterSpacing: '0.1em'
                  }}>
                    ▼ NULL
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <History size={24} style={{ color: 'var(--color-primary)' }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Performance History Tracker
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Singly Linked List Data Structure — O(1) Insert at Head • O(n) Traversal
          </p>
        </div>
      </div>

      {loading && !historyData ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          Loading history data...
        </div>
      ) : viewMode === 'student' ? renderStudentView() : renderLecturerView()}
    </div>
  );
}
