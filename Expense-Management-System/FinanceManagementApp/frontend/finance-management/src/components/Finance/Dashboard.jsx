import React, { useEffect, useState } from "react";
import "../../App.css";
import * as XLSX from 'xlsx';

const MOCK_DATA = [
  { 
    id: 1, 
    title: "Team Lunch", 
    dateSubmitted: "2025-10-18", 
    amount: 120.5, 
    status: "pending",
    managerName: "BanuHarshini",
    managerId: "MGR-67890",
    managerApproved: true,
    managerComment: "Approved - within policy limits"
  },
  { 
    id: 2, 
    title: "Client Travel", 
    dateSubmitted: "2025-10-17", 
    amount: 560.0, 
    status: "approved",
    managerName: "BanuHarshini",
    managerId: "MGR-67890",
    managerApproved: true,
    managerComment: "Travel expenses verified with receipts"
  },
  { 
    id: 3, 
    title: "Office Supplies", 
    dateSubmitted: "2025-10-16", 
    amount: 45.0, 
    status: "rejected",
    managerName: "BanuHarshini",
    managerId: "MGR-67890",
    managerApproved: false,
    managerComment: "Missing itemized receipt"
  },
  { 
    id: 4, 
    title: "Software Subscription", 
    dateSubmitted: "2025-10-15", 
    amount: 299.99, 
    status: "info requested",
    managerName: "BanuHarshini",
    managerId: "MGR-67890",
    managerApproved: false,
    managerComment: "Need approval from IT department"
  }
];

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // submission selected for final verification
  const [modalOpen, setModalOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    region: "",
    manager: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch submissions when component mounts or when refresh is triggered
  useEffect(() => {
    let mounted = true;

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      // Finance should query finance-specific expenses endpoint
      const url = `${base}/api/finance/expenses`;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          // fallback to mock data
          throw new Error(`${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const expenses = Array.isArray(data) ? data : [];

        // Only keep items that have been manager-approved
        const managerApproved = expenses.filter(e => e.managerApproved === true || (e.status || '').toLowerCase() === 'approved');

        if (!mounted) return;
        setSubmissions(managerApproved);
        setFiltered(managerApproved); // Initialize filtered with manager-approved expenses
      } catch (e) {
        console.warn("Failed to load finance submissions, using mock data:", e.message);
        setError(e.toString());
        // For mock data, only include those with managerApproved true
        const approvedMock = MOCK_DATA.filter(m => m.managerApproved);
        setSubmissions(approvedMock);
        setFiltered(approvedMock);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSubmissions();

    return () => { mounted = false; };
  }, []);

  // Apply filters when submissions or filter values change
  useEffect(() => {
    let result = [...submissions];
    
    if (filters.status) {
      result = result.filter(e => 
        (e.status || "").toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.region) {
      result = result.filter(e => 
        (e.region || "").toLowerCase() === filters.region.toLowerCase()
      );
    }
    
    if (filters.manager) {
      const search = filters.manager.toLowerCase();
      result = result.filter(e =>
        (e.managerName || "").toLowerCase().includes(search) ||
        (e.managerId || "").toLowerCase().includes(search)
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(e => 
        new Date(e.dateSubmitted || e.Date) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(e => 
        new Date(e.dateSubmitted || e.Date) <= toDate
      );
    }
    
    setFiltered(result);
  }, [filters, submissions]);

  // Calculate totals from filtered results
  const totals = {
    total: filtered.length,
    pending: filtered.filter((s) => ((s.status || "").toLowerCase() === "pending") && s.managerApproved).length,
    approved: filtered.filter((s) => ((s.status || "").toLowerCase() === "approved") && s.managerApproved).length,
    rejected: filtered.filter((s) => ((s.status || "").toLowerCase() === "rejected")).length,
    infoRequested: filtered.filter((s) => ((s.status || "").toLowerCase() === "info requested")).length
  };

  // Export filtered data to Excel
  const exportToExcel = () => {
    const exportData = filtered.map(expense => ({
      'Employee ID': expense.employeeName || 
                    expense.employee || 
                    expense.name || 
                    expense.employeeId || 
                    expense.userName || 
                    "Unknown Employee",
      'Title': expense.title,
      'Date Submitted': expense.dateSubmitted,
      'Amount': expense.amount,
      'Manager': expense.managerName,
      'Manager ID': expense.managerId,
      'Manager Comment': expense.managerComment || 'N/A',
      'Status': expense.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finance Review");
    XLSX.writeFile(wb, "finance_review.xlsx");
  };

  const refresh = () => {
    // re-run the fetch by toggling loading state and re-calling the effect
    setLoading(true);
    // Simple approach: re-run same fetch logic by invoking effect-encapsulated function via creating a new timestamp filter
    // But here we'll directly call the finance endpoint again
    (async () => {
      setError(null);
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const url = `${base}/api/finance/expenses`;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        const expenses = Array.isArray(data) ? data : [];
        const managerApproved = expenses.filter(e => e.managerApproved === true || (e.status || '').toLowerCase() === 'approved');
        setSubmissions(managerApproved);
        setFiltered(managerApproved);
      } catch (e) {
        console.warn("Refresh failed, keeping existing list:", e.message);
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    })();
  };

  // View receipt
  const viewReceipt = (receipt) => {
    setReceiptUrl(receipt);
    setShowReceipt(true);
  };

  function openFinalVerify(sub) {
    setSelected(sub);
    setModalOpen(true);
  }

  async function performFinalVerification(id, newStatus) {
    // Optimistic update
    const prev = submissions.slice();
    setSubmissions((arr) => arr.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    setModalOpen(false);

  const { API_BASE } = await import("../../config");
  const base = API_BASE;
  // Finance final verification should hit finance endpoint
  const url = `${base}/api/finance/expenses/${id}/${newStatus === 'approved' ? 'approve' : 'reject'}`;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
      }

      // If backend returns updated object we could merge it here; for now assume success
    } catch (e) {
      alert("Final verification failed: " + e.toString());
      // revert optimistic update
      setSubmissions(prev);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Finance Dashboard</h1>
      <p>Welcome, Finance Admin!</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Finance Dashboard</h1>
          <p style={{ color: "#617589", fontSize: "14px", margin: 0 }}>
            Welcome, Finance Admin! Review and verify manager-approved expenses.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={refresh}
            style={{
              background: "#ffffff",
              color: "#333",
              border: "1px solid #e6eef3",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportToExcel}
          style={{
            background: "#17b897",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📊 Export to Excel
        </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 24 }}>
        <div className="card">
          <h3>Manager Approved (Total)</h3>
          <p className="value">{totals.total}</p>
        </div>
        <div className="card">
          <h3>Pending Expenses</h3>
          <p className="value">{totals.pending}</p>
        </div>
        <div className="card success">
          <h3>Approved Expenses</h3>
          <p className="value">{totals.approved}</p>
        </div>
        <div className="card danger">
          <h3>Rejected Expenses</h3>
          <p className="value">{totals.rejected}</p>
        </div>
        <div className="card" style={{ borderColor: "#ff9900", color: "#ff9900" }}>
          <h3>Info Requested</h3>
          <p className="value">{totals.infoRequested}</p>
        </div>
      </div>

      <div className="filter-section" style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "12px",
        marginTop: "20px",
        marginBottom: "20px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#495057", fontSize: "18px", fontWeight: "600" }}>
          Filter Expenses
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "16px",
          alignItems: "end"
        }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "6px", 
              fontSize: "14px", 
              fontWeight: "500", 
              color: "#495057" 
            }}>
              Status
            </label>
            <select 
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))} 
              value={filters.status}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white"
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="info requested">Info Requested</option>
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "6px", 
              fontSize: "14px", 
              fontWeight: "500", 
              color: "#495057" 
            }}>
              Manager
            </label>
            <input 
              type="text"
              placeholder="Search by manager name or ID"
              value={filters.manager}
              onChange={(e) => setFilters(f => ({ ...f, manager: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white"
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "6px", 
              fontSize: "14px", 
              fontWeight: "500", 
              color: "#495057" 
            }}>
              From Date
            </label>
            <input 
              type="date" 
              value={filters.dateFrom} 
              onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white"
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "6px", 
              fontSize: "14px", 
              fontWeight: "500", 
              color: "#495057" 
            }}>
              To Date
            </label>
            <input 
              type="date" 
              value={filters.dateTo} 
              onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white"
              }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Submissions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Manager</th>
                <th>Manager Comment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.dateSubmitted || s.date || s.Date}</td>
                  <td>{s.amount}</td>
                  <td>{s.managerName || "Unknown"}<br/><small>{s.managerId}</small></td>
                  <td>
                    {s.managerComment || "No comment"}
                    {s.receipt && (
                      <button
                        onClick={() => viewReceipt(s.receipt)}
                        style={{
                          marginLeft: "8px",
                          background: "none",
                          border: "none",
                          color: "#0066cc",
                          cursor: "pointer",
                          padding: "2px 6px",
                          fontSize: "12px"
                        }}
                      >
                        View Receipt
                      </button>
                    )}
                  </td>
                  <td className={`status ${((s.status || "").toLowerCase())}`}>
                    <span>{(s.status || "").toString().charAt(0).toUpperCase() + (s.status || "").toString().slice(1)}</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => openFinalVerify(s)} 
                      disabled={!s.managerApproved || s.status === "info requested"}
                      title={!s.managerApproved ? "Waiting for manager approval" : s.status === "info requested" ? "Waiting for additional info" : ""}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        background: !s.managerApproved || s.status === "info requested" ? "#f5f5f5" : "#fff",
                        cursor: !s.managerApproved || s.status === "info requested" ? "not-allowed" : "pointer"
                      }}
                    >
                      Final Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <p style={{ color: "#b00", marginTop: 8 }}>Notice: using mock data due to: {error}</p>}
      </div>

      {/* Modal */}
      {/* Receipt Modal */}
      {showReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: 600, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Receipt Viewer</h2>
              <button 
                style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }} 
                onClick={() => setShowReceipt(false)}
              >
                ✕
              </button>
            </div>
            <hr />
            {receiptUrl && receiptUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
              <img 
                src={receiptUrl.startsWith("http") ? receiptUrl : `${base}${receiptUrl}`} 
                alt="Receipt" 
                style={{ maxWidth: "100%", maxHeight: 450, display: "block", margin: "auto" }} 
              />
            ) : receiptUrl && receiptUrl.match(/\.pdf$/i) ? (
              <iframe 
                src={receiptUrl.startsWith("http") ? receiptUrl : `${base}${receiptUrl}`}
                title="Receipt PDF" 
                style={{ width: "100%", height: 500, border: "none" }} 
              />
            ) : (
              <div>
                <p>File type not supported for preview.</p>
                <a 
                  href={receiptUrl.startsWith("http") ? receiptUrl : `${base}${receiptUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Verification Modal */}
      {modalOpen && selected && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Final Verification</h3>
            <p>
              <strong>{selected.title}</strong> ({selected.managerId})
            </p>
            <p>Date: {selected.dateSubmitted || selected.date}</p>
            <p>Amount: ₹ {selected.amount}</p>
            <div style={{ 
              background: "#f8f9fa", 
              padding: "12px", 
              borderRadius: "6px", 
              marginBottom: "16px",
              border: "1px solid #e9ecef" 
            }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>Manager Review</p>
              <p style={{ margin: 0, fontSize: "14px" }}>
                <strong>{selected.managerName}</strong><br/>
                {selected.managerComment || "No comment provided"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                className="btn-approve"
                onClick={() => performFinalVerification(selected.id, "approved")}
                style={{ flex: 1, background: "#16a34a", color: "white", padding: "8px 12px", border: "none", borderRadius: 4 }}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => performFinalVerification(selected.id, "rejected")}
                style={{ flex: 1, background: "#dc2626", color: "white", padding: "8px 12px", border: "none", borderRadius: 4 }}
              >
                Reject
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
