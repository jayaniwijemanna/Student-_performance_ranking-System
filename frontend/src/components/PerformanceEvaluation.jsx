import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle2, Calculator, Layers, BookOpen, AlertTriangle } from 'lucide-react';

export default function PerformanceEvaluation() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [batches, setBatches] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerf, setEditingPerf] = useState(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [assignmentMarks, setAssignmentMarks] = useState(80);
  const [examMarks, setExamMarks] = useState(80);
  const [attendancePercentage, setAttendancePercentage] = useState(90);

  useEffect(() => {
    fetchEvaluationData();
  }, []);

  const fetchEvaluationData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, bRes, pRes] = await Promise.all([
        fetch('/api/users/role/STUDENT'),
        fetch('/api/modules'),
        fetch('/api/batches'),
        fetch('/api/performances/rankings')
      ]);

      if (sRes.ok && mRes.ok && bRes.ok && pRes.ok) {
        const sData = await sRes.json();
        const mData = await mRes.json();
        const bData = await bRes.json();
        const pData = await pRes.json();

        setStudents(sData);
        setModules(mData);
        setBatches(bData);
        setPerformances(pData);
      }
    } catch (err) {
      setError('Failed to fetch evaluation data');
    } finally {
      setLoading(false);
    }
  };

  const assignedBatchCodes = user?.assignedBatchCodes || [];

  // Filter students accessible to lecturer
  const accessibleStudents = user?.role === 'ADMIN'
    ? students
    : students.filter(s => s.batchCode && assignedBatchCodes.includes(s.batchCode));

  // Filter modules accessible to lecturer
  const accessibleModules = user?.role === 'ADMIN'
    ? modules
    : modules.filter(m => assignedBatchCodes.includes(m.batchCode) || m.lecturerId === user?.id);

  // Fallback to all students or modules if role filter returns empty
  const targetStudents = accessibleStudents.length > 0 ? accessibleStudents : students;
  const targetModules = accessibleModules.length > 0 ? accessibleModules : modules;

  const openAddModal = () => {
    setEditingPerf(null);
    if (targetStudents.length > 0) {
      const firstStd = targetStudents[0];
      setStudentId(firstStd.staffOrStudentId && firstStd.staffOrStudentId.trim() !== '' ? firstStd.staffOrStudentId : (firstStd.email || firstStd.id));
      setStudentName(firstStd.name);
      setBatchCode(firstStd.batchCode || '');
    } else {
      setStudentId('');
      setStudentName('');
      setBatchCode('');
    }

    if (targetModules.length > 0) {
      const firstMod = targetModules[0];
      setModuleCode(firstMod.moduleCode);
      setModuleName(firstMod.moduleName);
      if (!batchCode && firstMod.batchCode) {
        setBatchCode(firstMod.batchCode);
      }
    } else {
      setModuleCode('');
      setModuleName('');
    }

    setAssignmentMarks(80);
    setExamMarks(80);
    setAttendancePercentage(90);
    setError(null);
    setIsModalOpen(true);
  };

  const handleStudentSelect = (e) => {
    const selectedStdId = e.target.value;
    const found = students.find(s => s.id === selectedStdId || s.staffOrStudentId === selectedStdId || s.email === selectedStdId);
    if (found) {
      setStudentId(found.staffOrStudentId && found.staffOrStudentId.trim() !== '' ? found.staffOrStudentId : (found.email || found.id));
      setStudentName(found.name);
      setBatchCode(found.batchCode || '');
    }
  };

  const handleModuleSelect = (e) => {
    const selectedMId = e.target.value;
    const found = modules.find(m => m.id === selectedMId || m.moduleCode === selectedMId);
    if (found) {
      setModuleCode(found.moduleCode);
      setModuleName(found.moduleName);
      if (found.batchCode) {
        setBatchCode(found.batchCode);
      }
    }
  };

  // Formula: Score = (Assignment * 0.30) + (Exam * 0.60) + (Attendance * 0.10)
  const currentCalculatedScore = Math.round(
    ((parseFloat(assignmentMarks) || 0) * 0.30 +
     (parseFloat(examMarks) || 0) * 0.60 +
     (parseFloat(attendancePercentage) || 0) * 0.10) * 100
  ) / 100;

  const getCategory = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Satisfactory';
    return 'At Risk';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      studentId,
      studentName,
      batchCode,
      moduleCode,
      moduleName,
      lecturerId: user?.id,
      lecturerName: user?.name,
      assignmentMarks: parseFloat(assignmentMarks),
      examMarks: parseFloat(examMarks),
      attendancePercentage: parseFloat(attendancePercentage)
    };

    try {
      const res = await fetch('/api/performances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit evaluation');
      }

      setSuccess(`Evaluation recorded for '${studentName}' (Score: ${data.performanceScore} - ${data.performanceCategory})! Node inserted into AVL Tree.`);
      setIsModalOpen(false);
      fetchEvaluationData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete performance record for '${name}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/performances/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Performance record deleted and AVL tree rebalanced.`);
        fetchEvaluationData();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete record');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPerformances = performances.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          p.studentId.toLowerCase().includes(search.toLowerCase()) ||
                          p.moduleCode.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = selectedBatchFilter === 'ALL' || p.batchCode === selectedBatchFilter;
    const matchesModule = selectedModuleFilter === 'ALL' || p.moduleCode === selectedModuleFilter;

    return matchesSearch && matchesBatch && matchesModule;
  });

  return (
    <div>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Student Performance Evaluation</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Enter assignment marks, exam scores & attendance to insert into AVL Tree ($O(\log n)$)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Batch Filter */}
          <select 
            className="form-control" 
            style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            id="eval-filter-batch"
          >
            <option value="ALL">All Batches</option>
            {(user?.role === 'ADMIN' || !user?.assignedBatchCodes || user.assignedBatchCodes.length === 0
              ? batches 
              : batches.filter(b => user.assignedBatchCodes.includes(b.batchCode))
            ).map(b => (
              <option key={b.id} value={b.batchCode}>{b.batchCode}</option>
            ))}
          </select>

          {/* Module Filter: Formatted as "moduleCode - moduleName" */}
          <select 
            className="form-control" 
            style={{ width: '220px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value)}
            id="eval-filter-module"
          >
            <option value="ALL">All Modules</option>
            {targetModules.map(m => (
              <option key={m.id} value={m.moduleCode}>
                {m.moduleCode} - {m.moduleName}
              </option>
            ))}
          </select>

          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '180px', paddingRight: '1rem' }}
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-eval"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} disabled={accessibleStudents.length === 0} id="btn-enter-marks">
            <Plus size={16} />
            Enter Student Marks
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Evaluations Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name & ID</th>
              <th>Module</th>
              <th>Assignment (30%)</th>
              <th>Exam (60%)</th>
              <th>Attendance (10%)</th>
              <th>Overall Score</th>
              <th>Performance Category</th>
              <th>Standing</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>Loading student evaluations...</td>
              </tr>
            ) : filteredPerformances.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  No performance records found. Click "Enter Student Marks" to evaluate student performance.
                </td>
              </tr>
            ) : (
              filteredPerformances.map((perf, index) => (
                <tr key={perf.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    #{index + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{perf.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>ID: {perf.studentId}</div>
                  </td>
                  <td>
                    <span className="badge-role badge-lecturer" style={{ fontSize: '0.75rem' }}>{perf.moduleCode}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Batch: {perf.batchCode}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{perf.assignmentMarks}%</td>
                  <td style={{ fontWeight: 600 }}>{perf.examMarks}%</td>
                  <td style={{ fontWeight: 600 }}>{perf.attendancePercentage}%</td>
                  <td>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {perf.performanceScore}
                    </div>
                  </td>
                  <td>
                    <span className={`badge-role ${perf.performanceScore >= 85 ? 'badge-admin' : perf.performanceScore >= 65 ? 'badge-lecturer' : 'badge-student'}`}>
                      {perf.performanceCategory}
                    </span>
                  </td>
                  <td>
                    {perf.status === 'At Risk' ? (
                      <span className="badge-role badge-student" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.3)' }}>
                        ⚠️ At Risk
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 600 }}>
                        ✓ Good Standing
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(perf.id, perf.studentName)}
                      id={`btn-delete-perf-${perf.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enter Student Marks Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="scholastic-card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} style={{ color: 'var(--color-secondary-hover)' }} />
              Enter Module Performance Marks
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Student *</label>
                <select 
                  className="form-control"
                  value={studentId}
                  onChange={handleStudentSelect}
                  required
                  id="modal-eval-student"
                >
                  {targetStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.staffOrStudentId || s.email || s.id}) — Batch: {s.batchCode || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Subject / Module *</label>
                <select 
                  className="form-control"
                  onChange={handleModuleSelect}
                  required
                  id="modal-eval-module"
                >
                  {targetModules.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.moduleCode} - {m.moduleName} ({m.credits} Credits)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Assignment (30%)</label>
                  <input 
                    type="number" 
                    min="0" max="100" step="0.5"
                    className="form-control"
                    value={assignmentMarks}
                    onChange={(e) => setAssignmentMarks(e.target.value)}
                    required
                    id="modal-eval-assignment"
                  />
                </div>

                <div>
                  <label className="form-label">Exam (60%)</label>
                  <input 
                    type="number" 
                    min="0" max="100" step="0.5"
                    className="form-control"
                    value={examMarks}
                    onChange={(e) => setExamMarks(e.target.value)}
                    required
                    id="modal-eval-exam"
                  />
                </div>

                <div>
                  <label className="form-label">Attendance (10%)</label>
                  <input 
                    type="number" 
                    min="0" max="100" step="0.5"
                    className="form-control"
                    value={attendancePercentage}
                    onChange={(e) => setAttendancePercentage(e.target.value)}
                    required
                    id="modal-eval-attendance"
                  />
                </div>
              </div>

              {/* Live Formula Preview Box */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Live Performance Score Preview
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {currentCalculatedScore} / 100
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Category: <strong style={{ color: 'var(--color-secondary-hover)' }}>{getCategory(currentCalculatedScore)}</strong>
                    </div>
                  </div>
                  <div>
                    {currentCalculatedScore < 50 || attendancePercentage < 70 ? (
                      <span className="badge-role badge-student" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                        ⚠️ At-Risk Trigger
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.85rem' }}>
                        ✓ Good Standing
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outlined" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-evaluation">
                  Insert into AVL Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
