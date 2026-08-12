import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle2, Award, Layers } from 'lucide-react';

export default function ModuleManager() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // Form State
  const [moduleCode, setModuleCode] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [credits, setCredits] = useState(3);
  const [batchId, setBatchId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchModulesAndBatches();
  }, []);

  const fetchModulesAndBatches = async () => {
    setLoading(true);
    try {
      const [mRes, bRes] = await Promise.all([
        fetch('/api/modules'),
        fetch('/api/batches')
      ]);

      if (mRes.ok && bRes.ok) {
        const mData = await mRes.json();
        const bData = await bRes.json();
        setModules(mData);
        setBatches(bData);
      }
    } catch (err) {
      setError('Failed to fetch subjects/modules');
    } finally {
      setLoading(false);
    }
  };

  const assignedBatchCodes = user?.assignedBatchCodes || [];
  const assignedBatchIds = user?.assignedBatchIds || [];

  // Filter batches accessible to this lecturer (if Admin, all batches)
  const accessibleBatches = user?.role === 'ADMIN' 
    ? batches 
    : batches.filter(b => assignedBatchCodes.includes(b.batchCode) || assignedBatchIds.includes(b.id));

  const openAddModal = () => {
    setEditingModule(null);
    setModuleCode('');
    setModuleName('');
    setCredits(3);
    if (accessibleBatches.length > 0) {
      setBatchId(accessibleBatches[0].id);
      setBatchCode(accessibleBatches[0].batchCode);
    } else {
      setBatchId('');
      setBatchCode('');
    }
    setSemester('Semester 1');
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mod) => {
    setEditingModule(mod);
    setModuleCode(mod.moduleCode);
    setModuleName(mod.moduleName);
    setCredits(mod.credits || 3);
    setBatchId(mod.batchId || (accessibleBatches.length > 0 ? accessibleBatches[0].id : ''));
    setBatchCode(mod.batchCode || (accessibleBatches.length > 0 ? accessibleBatches[0].batchCode : ''));
    setSemester(mod.semester || 'Semester 1');
    setDescription(mod.description || '');
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleBatchSelect = (e) => {
    const selectedBId = e.target.value;
    setBatchId(selectedBId);
    const found = batches.find(b => b.id === selectedBId);
    if (found) {
      setBatchCode(found.batchCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      moduleCode,
      moduleName,
      credits: parseInt(credits, 10),
      batchId,
      batchCode,
      lecturerId: user?.id,
      lecturerName: user?.name,
      semester,
      description
    };

    const method = editingModule ? 'PUT' : 'POST';
    const url = editingModule ? `/api/modules/${editingModule.id}` : '/api/modules';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save subject/module');
      }

      setSuccess(`Subject '${moduleCode}' ${editingModule ? 'updated' : 'added'} successfully!`);
      closeModal();
      fetchModulesAndBatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete Subject '${code}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Subject '${code}' deleted successfully.`);
        fetchModulesAndBatches();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete module');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter modules visible to this lecturer
  const myModules = user?.role === 'ADMIN'
    ? modules
    : modules.filter(m => assignedBatchCodes.includes(m.batchCode) || m.lecturerId === user?.id);

  const filteredModules = myModules.filter(m => {
    const matchesSearch = m.moduleCode.toLowerCase().includes(search.toLowerCase()) || 
                          m.moduleName.toLowerCase().includes(search.toLowerCase()) ||
                          (m.batchCode && m.batchCode.toLowerCase().includes(search.toLowerCase()));

    const matchesBatch = selectedBatchFilter === 'ALL' || m.batchId === selectedBatchFilter || m.batchCode === selectedBatchFilter;

    return matchesSearch && matchesBatch;
  });

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Subject & Module Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Manage academic subjects, module credits, and assigned batch curriculums
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Batch Filter Dropdown */}
          <select 
            className="form-control" 
            style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            id="select-filter-module-batch"
          >
            <option value="ALL">All Batches</option>
            {accessibleBatches.map(b => (
              <option key={b.id} value={b.batchCode}>{b.batchCode} - {b.batchName}</option>
            ))}
          </select>

          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '190px', paddingRight: '1rem' }}
              placeholder="Search module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-module"
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          </div>

          <button className="btn btn-primary" onClick={openAddModal} disabled={accessibleBatches.length === 0} id="btn-add-subject">
            <Plus size={16} />
            Add Subject
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

      {/* Modules Data Table */}
      <div className="scholastic-table-container">
        <table className="scholastic-table">
          <thead>
            <tr>
              <th>Module Code</th>
              <th>Subject / Module Title</th>
              <th>Assigned Batch</th>
              <th>Academic Credits</th>
              <th>Semester</th>
              <th>Instructor</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading subject directory...</td>
              </tr>
            ) : filteredModules.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  {accessibleBatches.length === 0 
                    ? 'No assigned batches found. Please ask Admin to assign teaching batches first.' 
                    : 'No subjects created yet. Click "Add Subject" to create one.'}
                </td>
              </tr>
            ) : (
              filteredModules.map((mod) => (
                <tr key={mod.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    <span className="badge-role badge-lecturer" style={{ fontSize: '0.8rem' }}>{mod.moduleCode}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{mod.moduleName}</td>
                  <td>
                    <span className="badge-role badge-student" style={{ fontSize: '0.8rem' }}>
                      {mod.batchCode || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(214, 158, 46, 0.15)', color: 'var(--color-secondary-hover)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Award size={13} />
                      {mod.credits} Credits
                    </div>
                  </td>
                  <td>{mod.semester || 'Semester 1'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{mod.lecturerName || user?.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outlined btn-sm" 
                      style={{ marginRight: '0.4rem' }}
                      onClick={() => openEditModal(mod)}
                      id={`btn-edit-module-${mod.moduleCode}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button 
                      className="btn btn-sm" 
                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(197, 48, 48, 0.2)' }}
                      onClick={() => handleDelete(mod.id, mod.moduleCode)}
                      id={`btn-delete-module-${mod.moduleCode}`}
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

      {/* Create / Edit Subject Modal */}
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
              {editingModule ? `Edit Subject (${editingModule.moduleCode})` : 'Add New Subject / Module'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Target Batch *</label>
                <select 
                  className="form-control"
                  value={batchId}
                  onChange={handleBatchSelect}
                  required
                  id="modal-module-batch"
                >
                  {accessibleBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.batchCode} — {b.batchName}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Module Code *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. CS101 / DSA301"
                    value={moduleCode}
                    onChange={(e) => setModuleCode(e.target.value)}
                    required
                    id="modal-module-code"
                  />
                </div>

                <div>
                  <label className="form-label">Credits *</label>
                  <input 
                    type="number" 
                    min="1"
                    max="12"
                    className="form-control"
                    placeholder="3"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    required
                    id="modal-module-credits"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Module Title *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Data Structures and Algorithms"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  required
                  id="modal-module-title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Semester / Term</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Semester 1"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  id="modal-module-semester"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Syllabus Summary</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Brief overview of module content, grading criteria, and learning outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="modal-module-desc"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outlined" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-module">
                  {editingModule ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
