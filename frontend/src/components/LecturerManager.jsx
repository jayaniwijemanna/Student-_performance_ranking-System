import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle2, Layers, CheckSquare, Square } from 'lucide-react';

export default function LecturerManager() {
  const [lecturers, setLecturers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add/Edit Lecturer Modal State
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [staffId, setStaffId] = useState('');

  // Assign Batches Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningLecturer, setAssigningLecturer] = useState(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);

  useEffect(() => {
    fetchLecturersAndBatches();
  }, []);

  const fetchLecturersAndBatches = async () => {
    setLoading(true);
    try {
      const [lRes, bRes] = await Promise.all([
        fetch('/api/users/role/LECTURER'),
        fetch('/api/batches')
      ]);

      if (lRes.ok && bRes.ok) {
        const lData = await lRes.json();
        const bData = await bRes.json();
        setLecturers(lData);
        setBatches(bData);
      }
    } catch (err) {
      setError('Failed to load lecturers or batches');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingLecturer(null);
    setName('');
    setEmail('');
    setPassword('');
    setDepartment('Computer Science');
    setStaffId('');
    setError(null);
    setIsLecturerModalOpen(true);
  };

  const openEditModal = (lec) => {
    setEditingLecturer(lec);
    setName(lec.name);
    setEmail(lec.email);
    setPassword('');
    setDepartment(lec.department || 'Computer Science');
    setStaffId(lec.staffOrStudentId || '');
    setError(null);
    setIsLecturerModalOpen(true);
  };

  const openAssignModal = (lec) => {
    setAssigningLecturer(lec);
    setSelectedBatchIds(lec.assignedBatchIds || []);
    setError(null);
    setIsAssignModalOpen(true);
  };

  const closeLecturerModal = () => {
    setIsLecturerModalOpen(false);
    setEditingLecturer(null);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssigningLecturer(null);
  };

  const handleLecturerSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      name,
      email,
      password: password || undefined,
      role: 'LECTURER',
      department,
      staffOrStudentId: staffId
    };

    const method = editingLecturer ? 'PUT' : 'POST';
    const url = editingLecturer ? `/api/users/${editingLecturer.id}` : '/api/users';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save lecturer');
      }

      setSuccess(`Lecturer '${name}' ${editingLecturer ? 'updated' : 'registered'} successfully!`);
      closeLecturerModal();
      fetchLecturersAndBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleBatchSelection = (bId) => {
    if (selectedBatchIds.includes(bId)) {
      setSelectedBatchIds(selectedBatchIds.filter(id => id !== bId));
    } else {
      setSelectedBatchIds([...selectedBatchIds, bId]);
    }
  };

  const handleAssignBatchesSubmit = async (e) => {
    e.preventDefault();
    if (!assigningLecturer) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/users/${assigningLecturer.id}/assign-batches`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchIds: selectedBatchIds })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to assign batches');
      }

      setSuccess(`Batches successfully assigned to '${assigningLecturer.name}'!`);
      closeAssignModal();
      fetchLecturersAndBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, lecName) => {
    if (!window.confirm(`Are you sure you want to delete Lecturer '${lecName}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Lecturer '${lecName}' deleted successfully.`);
        fetchLecturersAndBatches();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete lecturer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLecturers = lecturers.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.staffOrStudentId && l.staffOrStudentId.toLowerCase().includes(search.toLowerCase())) ||
    (l.department && l.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Lecturer Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Register lecturers and assign teaching batches for module evaluation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '220px', paddingRight: '1rem' }}
              placeholder="Search lecturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-lecturer"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} id="btn-add-lecturer">
            <Plus size={16} />
            Register Lecturer
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

      {/* Lecturers Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Lecturer Name</th>
              <th>Email</th>
              <th>Staff ID</th>
              <th>Department</th>
              <th>Assigned Batches</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading lecturer accounts...</td>
              </tr>
            ) : filteredLecturers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  No lecturers found. Click "Register Lecturer" to add one.
                </td>
              </tr>
            ) : (
              filteredLecturers.map((lec) => (
                <tr key={lec.id}>
                  <td style={{ fontWeight: 600 }}>{lec.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{lec.email}</td>
                  <td>{lec.staffOrStudentId || 'N/A'}</td>
                  <td>{lec.department || 'Computing'}</td>
                  <td>
                    {lec.assignedBatchCodes && lec.assignedBatchCodes.length > 0 ? (
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {lec.assignedBatchCodes.map((code, idx) => (
                          <span key={idx} className="badge-role badge-lecturer" style={{ fontSize: '0.75rem' }}>
                            {code}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', italic: true }}>No batches assigned</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openAssignModal(lec)}
                      id={`btn-assign-batch-lec-${lec.id}`}
                    >
                      <Layers size={13} /> Assign Batches
                    </button>

                    <button 
                      className="btn btn-outlined btn-sm" 
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openEditModal(lec)}
                      id={`btn-edit-lec-${lec.id}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(lec.id, lec.name)}
                      id={`btn-delete-lec-${lec.id}`}
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

      {/* Add / Edit Lecturer Modal */}
      {isLecturerModalOpen && (
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
          <div className="scholastic-card" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', position: 'relative' }}>
            <button 
              onClick={closeLecturerModal}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} style={{ color: 'var(--color-primary)' }} />
              {editingLecturer ? `Edit Lecturer (${editingLecturer.name})` : 'Register New Lecturer'}
            </h3>

            <form onSubmit={handleLecturerSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Dr. Kamal Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="kamal.perera@university.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Staff ID</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="LEC-102"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Department</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password {editingLecturer ? '(Leave blank to keep unchanged)' : '*'}
                </label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingLecturer}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outlined" onClick={closeLecturerModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLecturer ? 'Save Changes' : 'Register Lecturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Batches Modal */}
      {isAssignModalOpen && assigningLecturer && (
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
              onClick={closeAssignModal}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--color-secondary-hover)' }} />
              Assign Batches to Lecturer
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Select teaching batches for <strong>{assigningLecturer.name}</strong> ({assigningLecturer.email})
            </p>

            <form onSubmit={handleAssignBatchesSubmit}>
              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '0.75rem', background: '#F8FAFC', marginBottom: '1.25rem' }}>
                {batches.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    No active batches available. Create batches in Batch Management first.
                  </p>
                ) : (
                  batches.map((b) => {
                    const isChecked = selectedBatchIds.includes(b.id);
                    return (
                      <div 
                        key={b.id} 
                        onClick={() => toggleBatchSelection(b.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          background: isChecked ? '#FFFFFF' : 'transparent',
                          border: isChecked ? '1px solid var(--color-primary)' : '1px solid transparent',
                          marginBottom: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isChecked ? (
                          <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
                        ) : (
                          <Square size={18} style={{ color: 'var(--color-text-light)' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                            {b.batchCode} &bull; {b.batchName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            Course: {b.courseCode} &bull; Term: {b.academicYear} ({b.semester})
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Selected: <strong>{selectedBatchIds.length}</strong> batch(es)
                </span>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-outlined" onClick={closeAssignModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Assignments
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
