import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, AlertCircle, X, Layers, CheckCircle2 } from 'lucide-react';

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // null = Add, Object = Edit

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computing & Technology');
  const [credits, setCredits] = useState(120);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setCode('');
    setName('');
    setDepartment('Computing & Technology');
    setCredits(120);
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setCode(course.code);
    setName(course.name);
    setDepartment(course.department || 'Computing & Technology');
    setCredits(course.credits || 120);
    setDescription(course.description || '');
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = { code, name, department, credits: Number(credits), description };
    const method = editingCourse ? 'PUT' : 'POST';
    const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save course');
      }

      setSuccess(`Course '${code}' ${editingCourse ? 'updated' : 'created'} successfully!`);
      closeModal();
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, courseCode) => {
    if (!window.confirm(`Are you sure you want to delete Course '${courseCode}'? All associated batches will also be deleted.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Course '${courseCode}' deleted successfully.`);
        fetchCourses();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete course');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.department && c.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Course Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Define and manage degree programs and course codes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '220px', paddingRight: '1rem' }}
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-course"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} id="btn-add-course">
            <Plus size={16} />
            Create Course
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

      {/* Courses Data Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading course directory...</td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  No courses found. Click "Create Course" to add one.
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    <span className="badge-role badge-admin" style={{ fontSize: '0.8rem' }}>{c.code}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.department || 'Computing'}</td>
                  <td>{c.credits || 120} Cr</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '280px' }}>
                    {c.description || 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outlined btn-sm" 
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openEditModal(c)}
                      id={`btn-edit-course-${c.code}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(c.id, c.code)}
                      id={`btn-delete-course-${c.code}`}
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

      {/* Modal Dialog */}
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
              <BookOpen size={20} style={{ color: 'var(--color-primary)' }} />
              {editingCourse ? `Edit Course (${editingCourse.code})` : 'Create New Course'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Course Code *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. SE202"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    id="modal-course-code"
                  />
                </div>

                <div>
                  <label className="form-label">Credits</label>
                  <input 
                    type="number" 
                    className="form-control"
                    placeholder="120"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    id="modal-course-credits"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. BSc (Hons) in Software Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  id="modal-course-name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Computing & Technology"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  id="modal-course-dept"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Program objectives, degree overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="modal-course-desc"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outlined" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-course">
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
