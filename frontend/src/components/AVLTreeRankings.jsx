import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Search, AlertTriangle, Layers, BookOpen, RefreshCw, GitCommit, ChevronRight, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';

export default function AVLTreeRankings() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState([]);
  const [treeGraph, setTreeGraph] = useState(null);
  const [atRiskList, setAtRiskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchScore, setSearchScore] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');
  const [batches, setBatches] = useState([]);
  const [modules, setModules] = useState([]);
  const [treeZoom, setTreeZoom] = useState(85); // Default scale 85% for clear fit

  useEffect(() => {
    fetchRankingsAndTree();
  }, [selectedBatchFilter, selectedModuleFilter]);

  const fetchRankingsAndTree = async () => {
    setLoading(true);
    try {
      let rankingsUrl = '/api/performances/rankings';
      let treeUrl = '/api/performances/tree-view';
      const params = new URLSearchParams();
      if (selectedBatchFilter !== 'ALL') params.append('batchCode', selectedBatchFilter);
      if (selectedModuleFilter !== 'ALL') params.append('moduleCode', selectedModuleFilter);
      if (params.toString()) {
        rankingsUrl += `?${params.toString()}`;
        treeUrl += `?${params.toString()}`;
      }

      const [rRes, tRes, aRes, bRes, mRes] = await Promise.all([
        fetch(rankingsUrl),
        fetch(treeUrl),
        fetch('/api/performances/at-risk'),
        fetch('/api/batches'),
        fetch('/api/modules')
      ]);

      if (rRes.ok && tRes.ok && aRes.ok && bRes.ok && mRes.ok) {
        const rData = await rRes.json();
        const tData = await tRes.json();
        const aData = await aRes.json();
        const bData = await bRes.json();
        const mData = await mRes.json();

        const assignedBatchCodes = user?.assignedBatchCodes || [];
        const hasBatchRestrictions = user?.role === 'LECTURER' && assignedBatchCodes.length > 0;

        // Filter rankings for lecturer scope
        const finalRankings = hasBatchRestrictions
          ? rData.filter(r => (r.lecturerId && r.lecturerId === user?.id) || assignedBatchCodes.includes(r.batchCode))
          : rData;

        // Filter at-risk list for lecturer scope and active batch/module filters
        const finalAtRisk = aData.filter(a => {
          const matchesLecturer = !hasBatchRestrictions || (a.lecturerId && a.lecturerId === user?.id) || assignedBatchCodes.includes(a.batchCode);
          const matchesBatch = selectedBatchFilter === 'ALL' || a.batchCode === selectedBatchFilter;
          const matchesModule = selectedModuleFilter === 'ALL' || a.moduleCode === selectedModuleFilter;
          return matchesLecturer && matchesBatch && matchesModule;
        });

        setRankings(finalRankings);
        setTreeGraph(tData);
        setAtRiskList(finalAtRisk);
        setBatches(bData);
        setModules(mData);
      }
    } catch (err) {
      console.error('Failed to fetch AVL Tree rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchScore) {
      setSearchResults(null);
      return;
    }
    try {
      let searchUrl = `/api/performances/search?score=${searchScore}`;
      if (selectedBatchFilter !== 'ALL') searchUrl += `&batchCode=${selectedBatchFilter}`;
      if (selectedModuleFilter !== 'ALL') searchUrl += `&moduleCode=${selectedModuleFilter}`;

      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderTreeNode = (node, isRoot = true) => {
    if (!node || !node.studentId) return null;
    const isBalanced = Math.abs(node.balanceFactor || 0) <= 1;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0.5rem 1rem',
        position: 'relative'
      }}>
        {/* Node Box */}
        <div style={{
          background: isRoot 
            ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          color: '#FFFFFF',
          padding: '0.75rem 1.15rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          minWidth: '150px',
          border: isRoot ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
          zIndex: 2
        }}>
          {isRoot && (
            <div style={{ fontSize: '0.65rem', color: '#FCD34D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              🌳 Root Node
            </div>
          )}
          <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
            Score: {node.performanceScore} / 100
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0.1rem 0' }}>{node.studentName}</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{node.studentId}</div>

          {/* Metrics Footer: Height & Balance Factor */}
          <div style={{ 
            display: 'flex', 
            justify: 'space-between', 
            marginTop: '0.4rem', 
            fontSize: '0.7rem', 
            borderTop: '1px solid rgba(255,255,255,0.15)', 
            paddingTop: '0.3rem' 
          }}>
            <span>Height (H): <strong>{node.height}</strong></span>
            <span style={{ 
              fontWeight: 700,
              color: isBalanced ? '#34D399' : '#EF4444',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px'
            }}>
              BF: {node.balanceFactor} {isBalanced ? '✓' : '⚠️'}
            </span>
          </div>
        </div>

        {/* Child Subtree Connectors */}
        {(node.left || node.right) && (
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.25rem', position: 'relative' }}>
            {node.left && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', background: '#E2E8F0', padding: '0.1rem 0.5rem', borderRadius: '9999px', marginBottom: '0.2rem' }}>
                  Left Subtree (Score &lt; {node.performanceScore})
                </span>
                {renderTreeNode(node.left, false)}
              </div>
            )}
            {node.right && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-tertiary)', background: '#E2E8F0', padding: '0.1rem 0.5rem', borderRadius: '9999px', marginBottom: '0.2rem' }}>
                  Right Subtree (Score &gt; {node.performanceScore})
                </span>
                {renderTreeNode(node.right, false)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const displayRankings = rankings.filter(r => {
    const matchesBatch = selectedBatchFilter === 'ALL' || (r.batchCode && r.batchCode.trim().toLowerCase() === selectedBatchFilter.trim().toLowerCase());
    const matchesModule = selectedModuleFilter === 'ALL' || (r.moduleCode && r.moduleCode.trim().toLowerCase() === selectedModuleFilter.trim().toLowerCase());
    return matchesBatch && matchesModule;
  });

  const displayTreeGraph = (selectedModuleFilter !== 'ALL' && displayRankings.length === 0)
    ? null
    : treeGraph;

  return (
    <div>
      {/* Top Banner & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} style={{ color: 'var(--color-secondary)' }} />
            AVL Tree Self-Balancing Performance Rankings
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Sorted via Reverse In-Order Traversal (Right → Root → Left) with O(log n) search efficiency
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filtered Batches: Lecturers see assigned batches, Admins see all */}
          <select 
            className="form-control" 
            style={{ width: '180px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            id="ranking-filter-batch"
          >
            <option value="ALL">All Batches</option>
            {(user?.role === 'ADMIN' || !user?.assignedBatchCodes || user.assignedBatchCodes.length === 0
              ? batches 
              : batches.filter(b => user.assignedBatchCodes.includes(b.batchCode))
            ).map(b => (
              <option key={b.id} value={b.batchCode}>{b.batchCode}</option>
            ))}
          </select>

          {/* Filtered Modules: Format as "moduleCode - moduleName" */}
          <select 
            className="form-control" 
            style={{ width: '220px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value)}
            id="ranking-filter-module"
          >
            <option value="ALL">All Modules</option>
            {(user?.role === 'ADMIN' || !user?.assignedBatchCodes || user.assignedBatchCodes.length === 0
              ? modules 
              : modules.filter(m => user.assignedBatchCodes.includes(m.batchCode) || m.lecturerId === user?.id)
            ).map(m => (
              <option key={m.id} value={m.moduleCode}>
                {m.moduleCode} - {m.moduleName}
              </option>
            ))}
          </select>

          <button className="btn btn-outlined btn-sm" onClick={fetchRankingsAndTree} id="btn-refresh-avl">
            <RefreshCw size={14} /> Refresh AVL Tree
          </button>
        </div>
      </div>

      {/* Score Search Bar O(log n) */}
      <div className="scholastic-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)', border: '1px solid var(--color-border)' }}>
        <form onSubmit={handleScoreSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={18} /> AVL Score Search ($O(\log n)$):
          </div>
          <input 
            type="number" 
            step="0.1"
            className="form-control"
            style={{ width: '180px' }}
            placeholder="e.g. 84.0"
            value={searchScore}
            onChange={(e) => setSearchScore(e.target.value)}
            id="input-avl-search-score"
          />
          <button type="submit" className="btn btn-primary btn-sm" id="btn-search-score">
            Search Tree Node
          </button>
          {searchResults && (
            <button type="button" className="btn btn-outlined btn-sm" onClick={() => { setSearchResults(null); setSearchScore(''); }}>
              Clear Search
            </button>
          )}
        </form>

        {searchResults && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Search Results for Score {searchScore} ({searchResults.length} node(s) found):
            </div>
            {searchResults.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No student node matches performance score {searchScore}.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {searchResults.map((n, idx) => (
                  <div key={idx} style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{n.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {n.studentId} &bull; Batch: {n.batchCode}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--color-secondary-hover)' }}>
                      Score: {n.performanceScore} ({n.performanceCategory})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard Table (Reverse In-Order Traversal) */}
      <div className="scholastic-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} style={{ color: 'var(--color-secondary)' }} />
          Official Academic Rankings Leaderboard
        </h3>

        <div className="scholastic-table-container">
          <table className="scholastic-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name & ID</th>
                <th>Batch</th>
                <th>Module</th>
                <th>Assignment</th>
                <th>Exam</th>
                <th>Attendance</th>
                <th>Performance Score</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>Executing Reverse In-Order Traversal...</td>
                </tr>
              ) : displayRankings.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No performance records entered for the selected filter ({selectedBatchFilter !== 'ALL' ? `Batch: ${selectedBatchFilter}` : ''} {selectedModuleFilter !== 'ALL' ? `Module: ${selectedModuleFilter}` : ''}).
                  </td>
                </tr>
              ) : (
                displayRankings.map((r, index) => (
                  <tr key={r.id} style={{ backgroundColor: r.rank === 1 ? 'rgba(214, 158, 46, 0.08)' : 'transparent' }}>
                    <td>
                      {r.rank === 1 ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'var(--color-secondary)', color: '#FFFFFF', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}>
                          🏆 Rank #1
                        </div>
                      ) : r.rank <= 3 ? (
                        <div style={{ fontWeight: 800, color: 'var(--color-secondary-hover)', fontSize: '0.95rem' }}>
                          🥈 Rank #{r.rank}
                        </div>
                      ) : (
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          #{r.rank}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>ID: {r.studentId}</div>
                    </td>
                    <td><span className="badge-role badge-student" style={{ fontSize: '0.75rem' }}>{r.batchCode}</span></td>
                    <td><span className="badge-role badge-lecturer" style={{ fontSize: '0.75rem' }}>{r.moduleCode}</span></td>
                    <td>{r.assignmentMarks}%</td>
                    <td>{r.examMarks}%</td>
                    <td>{r.attendancePercentage}%</td>
                    <td>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {r.performanceScore}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-role ${r.performanceCategory === 'Excellent' ? 'badge-admin' : r.performanceCategory === 'Very Good' ? 'badge-lecturer' : 'badge-student'}`}>
                        {r.performanceCategory}
                      </span>
                    </td>
                    <td>
                      {r.status === 'At Risk' ? (
                        <span className="badge-role badge-student" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                          ⚠️ At Risk
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 600 }}>
                          ✓ Good Standing
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual AVL Tree Structure (For Viva Demo) */}
      <div className="scholastic-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCommit size={20} style={{ color: 'var(--color-primary)' }} />
              Live AVL Tree Data Structure Graph (Self-Balanced View)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Self-balancing binary tree visualizer showing Height (H) and Balance Factor (BF = Height(Left) - Height(Right))
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="badge-role badge-admin" style={{ background: 'rgba(47, 133, 90, 0.1)', color: 'var(--color-success)', marginRight: '0.25rem' }}>
              ✓ Tree Balanced (|BF| ≤ 1)
            </span>

            {/* Tree Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#EDF2F7', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <button 
                type="button" 
                className="btn btn-outlined btn-sm" 
                style={{ padding: '0.25rem 0.5rem', height: '28px' }}
                onClick={() => setTreeZoom(prev => Math.max(40, prev - 15))}
                title="Zoom Out Tree"
                id="btn-tree-zoom-out"
              >
                <ZoomOut size={14} />
              </button>

              <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--color-primary)', minWidth: '45px', textAlign: 'center' }}>
                {treeZoom}%
              </span>

              <button 
                type="button" 
                className="btn btn-outlined btn-sm" 
                style={{ padding: '0.25rem 0.5rem', height: '28px' }}
                onClick={() => setTreeZoom(prev => Math.min(200, prev + 15))}
                title="Zoom In Tree"
                id="btn-tree-zoom-in"
              >
                <ZoomIn size={14} />
              </button>

              <button 
                type="button" 
                className="btn btn-outlined btn-sm" 
                style={{ padding: '0.25rem 0.5rem', height: '28px', marginLeft: '0.3rem', fontSize: '0.75rem' }}
                onClick={() => setTreeZoom(100)}
                title="Reset Zoom to 100%"
                id="btn-tree-zoom-100"
              >
                100%
              </button>

              <button 
                type="button" 
                className="btn btn-outlined btn-sm" 
                style={{ padding: '0.25rem 0.5rem', height: '28px', marginLeft: '0.2rem', fontSize: '0.75rem' }}
                onClick={() => setTreeZoom(65)}
                title="Fit Tree to Viewport"
                id="btn-tree-zoom-fit"
              >
                <Minimize2 size={12} style={{ marginRight: '2px' }} /> Fit
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '1.5rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--color-border)', minHeight: '260px', display: 'flex', justifyContent: 'center' }}>
          {displayTreeGraph && displayTreeGraph.studentId ? (
            <div style={{ 
              transform: `scale(${treeZoom / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
              display: 'inline-block'
            }}>
              {renderTreeNode(displayTreeGraph)}
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              No performance records entered for the selected module ({selectedModuleFilter !== 'ALL' ? selectedModuleFilter : 'Selected Filter'}). Click "Enter Student Marks" to evaluate students.
            </div>
          )}
        </div>
      </div>

      {/* At-Risk Warning Section */}
      {atRiskList.length > 0 && (
        <div className="scholastic-card" style={{ borderLeft: '4px solid var(--color-danger)', background: 'rgba(197, 48, 48, 0.03)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            Academic Intervention Required: At-Risk Students ({atRiskList.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {atRiskList.map((st, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(197, 48, 48, 0.2)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{st.studentName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {st.studentId} &bull; Batch: {st.batchCode}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Score: <strong style={{ color: 'var(--color-danger)' }}>{st.performanceScore}</strong></span>
                  <span>Attendance: <strong style={{ color: st.attendancePercentage < 70 ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{st.attendancePercentage}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
