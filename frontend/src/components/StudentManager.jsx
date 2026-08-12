import React, { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle2, Layers, BookOpen } from 'lucide-react';

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [studentId, setStudentId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [batchCode, setBatchCode] = useState('');

  useEffect(() => {
    fetchStudentsAndBatches();
  }, []);

  const fetchStudentsAndBatches = async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        fetch('/api/users/role/STUDENT'),
        fetch('/api/batches')
      ]);

      if (sRes.ok && bRes.ok) {
        const sData = await sRes.json();
        const bData = await bRes.json();
        setStudents(sData);
        setBatches(bData);
      }
    } catch (err) {
      setError('Failed to load students or batches');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setPassword('');
    setDepartment('Computer Science');
    setStudentId('');
    if (batches.length > 0) {
      setBatchId(batches[0].id);
      setBatchCode(batches[0].batchCode);
    } else {
      setBatchId('');
      setBatchCode('');
    }
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (std) => {
    setEditingStudent(std);
    setName(std.name);
    setEmail(std.email);
    setPassword('');
    setDepartment(std.department || 'Computer Science');
    setStudentId(std.staffOrStudentId || '');
    setBatchId(std.batchId || (batches.length > 0 ? batches[0].id : ''));
    setBatchCode(std.batchCode || (batches.length > 0 ? batches[0].batchCode : ''));
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleBatchSelectChange = (e) => {
    const bId = e.target.value;
    setBatchId(bId);
    const found = batches.find(b => b.id === bId);
    if (found) {
      setBatchCode(found.batchCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      name,
      email,
      password: password || undefined,
      role: 'STUDENT',
      department,
      staffOrStudentId: studentId,
      batchId,
      batchCode
    };

    const method = editingStudent ? 'PUT' : 'POST';
    const url = editingStudent ? `/api/users/${editingStudent.id}` : '/api/users';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save student record');
      }

      setSuccess(`Student '${name}' ${editingStudent ? 'updated' : 'registered'} successfully!`);
      closeModal();
      fetchStudentsAndBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, stdName) => {
    if (!window.confirm(`Are you sure you want to delete Student '${stdName}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Student '${stdName}' deleted successfully.`);
        fetchStudentsAndBatches();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete student');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.email.toLowerCase().includes(search.toLowerCase()) ||
                          (s.staffOrStudentId && s.staffOrStudentId.toLowerCase().includes(search.toLowerCase())) ||
                          (s.batchCode && s.batchCode.toLowerCase().includes(search.toLowerCase()));

    const matchesBatch = selectedBatchFilter === 'ALL' || s.batchId === selectedBatchFilter;

    return matchesSearch && matchesBatch;
  });

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Student Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Register student accounts and manage enrolled academic batches
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Batch Filter Dropdown */}
          <select 
            className="form-control" 
            style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            id="select-filter-student-batch"
          >
            <option value="ALL">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.batchCode} - {b.batchName}</option>
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
              id="input-search-student"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} id="btn-add-student">
            <Plus size={16} />
            Register Student
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

      {/* Students Data Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Enrolled Batch</th>
              <th>Department</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading student directory...</td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  No student records found. Click "Register Student" to add a new student.
                </td>
              </tr>
            ) : (
              filteredStudents.map((std) => (
                <tr key={std.id}>
                  <td style={{ fontWeight: 600 }}>{std.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{std.email}</td>
                  <td style={{ fontWeight: 700 }}>{std.staffOrStudentId || 'N/A'}</td>
                  <td>
                    {std.batchCode ? (
                      <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem' }}>
                        {std.batchCode}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </td>
                  <td>{std.department || 'Computing'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outlined btn-sm" 
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openEditModal(std)}
                      id={`btn-edit-std-${std.id}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(std.id, std.name)}
                      id={`btn-delete-std-${std.id}`}
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

      {/* Add / Edit Student Modal */}
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
          <div className="scholastic-card" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', position: 'relative' }}>
            <button 
              onClick={closeModal}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--color-primary)' }} />
              {editingStudent ? `Edit Student (${editingStudent.name})` : 'Register New Student'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Student Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Amal Perera"
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
                  placeholder="amal.perera@university.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enrolled Batch *</label>
                <select 
                  className="form-control"
                  value={batchId}
                  onChange={handleBatchSelectChange}
                  required
                >
                  {batches.length === 0 ? (
                    <option value="">No batches available</option>
                  ) : (
                    batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchCode} — {b.batchName} ({b.courseCode})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Student ID</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="ST001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
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
                  Password {editingStudent ? '(Leave blank to keep unchanged)' : '*'}
                </label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingStudent}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outlined" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
