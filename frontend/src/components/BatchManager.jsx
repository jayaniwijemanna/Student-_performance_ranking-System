import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle2, Calendar, BookOpen } from 'lucide-react';

export default function BatchManager() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null); // null = Add, Object = Edit

  // Form State
  const [courseId, setCourseId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [batchName, setBatchName] = useState('');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('Semester 1');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    fetchCoursesAndBatches();
  }, []);

  const fetchCoursesAndBatches = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/batches')
      ]);

      if (cRes.ok && bRes.ok) {
        const cData = await cRes.json();
        const bData = await bRes.json();
        setCourses(cData);
        setBatches(bData);
        if (cData.length > 0 && !courseId) {
          setCourseId(cData[0].id);
        }
      }
    } catch (err) {
      setError('Failed to fetch batches or courses');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBatch(null);
    setCourseId(courses.length > 0 ? courses[0].id : '');
    setBatchCode('');
    setBatchName('');
    setAcademicYear('2024/2025');
    setSemester('Semester 1');
    setStatus('ACTIVE');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (batch) => {
    setEditingBatch(batch);
    setCourseId(batch.courseId || (courses.length > 0 ? courses[0].id : ''));
    setBatchCode(batch.batchCode);
    setBatchName(batch.batchName);
    setAcademicYear(batch.academicYear || '2024/2025');
    setSemester(batch.semester || 'Semester 1');
    setStatus(batch.status || 'ACTIVE');
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      courseId,
      batchCode,
      batchName,
      academicYear,
      semester,
      status
    };

    const method = editingBatch ? 'PUT' : 'POST';
    const url = editingBatch ? `/api/batches/${editingBatch.id}` : '/api/batches';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save batch');
      }

      setSuccess(`Batch '${batchCode}' ${editingBatch ? 'updated' : 'created'} successfully!`);
      closeModal();
      fetchCoursesAndBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete Batch '${code}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/batches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Batch '${code}' deleted successfully.`);
        fetchCoursesAndBatches();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete batch');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (bStatus) => {
    switch (bStatus) {
      case 'ACTIVE':
        return <span className="badge-role badge-admin" style={{ background: 'rgba(47, 133, 90, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(47, 133, 90, 0.2)' }}>Active</span>;
      case 'UPCOMING':
        return <span className="badge-role badge-lecturer">Upcoming</span>;
      default:
        return <span className="badge-role badge-student">Completed</span>;
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.batchCode.toLowerCase().includes(search.toLowerCase()) || 
                          b.batchName.toLowerCase().includes(search.toLowerCase()) ||
                          (b.courseCode && b.courseCode.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCourse = selectedCourseFilter === 'ALL' || b.courseId === selectedCourseFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Batch Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Manage student batches under assigned courses and academic semesters
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Course Filter Dropdown */}
          <select 
            className="form-control" 
            style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            id="select-filter-course"
          >
            <option value="ALL">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            className="form-control" 
            style={{ width: '140px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            id="select-filter-status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '190px', paddingRight: '1rem' }}
              placeholder="Search batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-batch"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} disabled={courses.length === 0} id="btn-add-batch">
            <Plus size={16} />
            Create Batch
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

      {/* Batches Data Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Batch Name</th>
              <th>Assigned Course</th>
              <th>Academic Term</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading batch directory...</td>
              </tr>
            ) : filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  No batches found. Click "Create Batch" to assign a new batch to a course.
                </td>
              </tr>
            ) : (
              filteredBatches.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem' }}>{b.batchCode}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.batchName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={14} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{b.courseCode || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{b.academicYear} &bull; {b.semester}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outlined btn-sm" 
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openEditModal(b)}
                      id={`btn-edit-batch-${b.batchCode}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(b.id, b.batchCode)}
                      id={`btn-delete-batch-${b.batchCode}`}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Batch Modal */}
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
              onClick={closeModal}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--color-secondary)' }} />
              {editingBatch ? `Edit Batch (${editingBatch.batchCode})` : 'Create New Batch'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Parent Course *</label>
                <select 
                  className="form-control"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                  id="modal-batch-course"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Batch Code *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. SE-2024-B1"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    required
                    id="modal-batch-code"
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="modal-batch-status"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Batch Title *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Software Engineering 2024 - Batch 1"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                  id="modal-batch-title"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Academic Year</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="2024/2025"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    id="modal-batch-year"
                  />
                </div>

                <div>
                  <label className="form-label">Semester</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Semester 1"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    id="modal-batch-semester"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outlined" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-batch">
                  {editingBatch ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
