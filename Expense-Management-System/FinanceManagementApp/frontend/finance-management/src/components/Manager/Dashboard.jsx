import { API_BASE } from "../../config";
import React, { useState, useEffect } from "react";
import "../../App.css";
import * as XLSX from 'xlsx';

function RequestInfoModal({ show, onClose, expense, onCommentSubmit }) {
  const [comment, setComment] = useState("");
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ border: "2px solid #ff9900" }}>
        <h2 style={{ color: "#ff9900" }}>Request More Information</h2>
        <p>Comment for {expense?.employeeName || expense?.employee || "User"}</p>
        <textarea
          rows={4}
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderColor: "#ff9900",
          }}
        />
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#606266",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              background: "#ff9900",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
            }}
            onClick={() => {
              onCommentSubmit(comment);
              setComment("");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// Corrected Receipt Modal: always uses absolute URL
function ReceiptModal({ show, url, onClose }) {
  if (!show) return null;

  const fullUrl =
    url && !url.startsWith("http")
      ? `${API_BASE}${url}`
      : url || "";

  const isImage = fullUrl && /\.(jpeg|jpg|png|gif|webp)$/i.test(fullUrl);
  const isPDF = fullUrl && /\.pdf$/i.test(fullUrl);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: 600, maxWidth: "95vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Receipt Viewer</h2>
          <button style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }} onClick={onClose}>✕</button>
        </div>
        <hr />
        {isImage && (
          <img src={fullUrl} alt="Receipt" style={{ maxWidth: "100%", maxHeight: 450, display: "block", margin: "auto" }} />
        )}
        {isPDF && (
          <iframe src={fullUrl} title="Receipt PDF" style={{ width: "100%", height: 500, border: "none" }} />
        )}
        {!isImage && !isPDF && (
          <div>
            <p>File type not supported for preview.</p>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer">Download</a>
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: "center", border: "2px solid #17b897" }}>
        <h2 style={{ color: "#17b897" }}>✓ Successfully Submitted</h2>
        <p>Your comment has been submitted successfully.</p>
        <button
          style={{
            background: "#17b897",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    region: "",
    employee: "",
    dateFrom: "",
    dateTo: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalExpense, setModalExpense] = useState(null);

  // For receipt modal
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    fetch(`${API_BASE}/api/manager/expenses`)
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setFiltered(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    let result = [...expenses];
    if (filters.status)
      result = result.filter(
        (e) => (e.status || "").toLowerCase() === filters.status.toLowerCase()
      );
    if (filters.region)
      result = result.filter(
        (e) => (e.region || "").toLowerCase() === filters.region.toLowerCase()
      );
    if (filters.employee) {
      const search = filters.employee.toLowerCase();
      result = result.filter(
        (e) =>
          (e.employeeName || e.employee || "")
            .toLowerCase()
            .includes(search) ||
          (e.employeeId || "").toLowerCase().includes(search)
      );
    }
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(
        (e) => new Date(e.dateSubmitted || e.Date) >= fromDate
      );
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(
        (e) => new Date(e.dateSubmitted || e.Date) <= toDate
      );
    }
    setFiltered(result);
  }, [filters, expenses]);

  const updateStatus = (id, status) => {
    const endpoint =
      status === "approved"
        ? `${API_BASE}/api/manager/expenses/${id}/approve`
        : `${API_BASE}/api/manager/expenses/${id}/reject`;
    fetch(endpoint, { method: "POST" }).then(() => fetchExpenses());
  };

  const handleRequestInfo = (comment) => {
    fetch(`${API_BASE}/api/manager/expenses/${modalExpense.id}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        comment,
        status: "info requested",
        managerComment: comment
      }),
    }).then(() => {
      setShowModal(false);
      setShowSuccessModal(true);
      fetchExpenses();
    });
  };

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
      'Status': expense.status,
      'Manager Comment': expense.managerComment || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Team Expenses");
    XLSX.writeFile(wb, "team_expenses.xlsx");
  };

  const pendingCount = expenses.filter(
    (e) => (e.status || "").toLowerCase() === "pending"
  ).length;
  const approvedCount = expenses.filter(
    (e) => (e.status || "").toLowerCase() === "approved"
  ).length;
  const rejectedCount = expenses.filter(
    (e) => (e.status || "").toLowerCase() === "rejected"
  ).length;
  const infoCount = expenses.filter(
    (e) => (e.status || "").toLowerCase() === "info requested"
  ).length;

  const regionOptions = ["", "india", "uk", "region 3"];

  return (
    <div>
      <main className="main" style={{ padding: "30px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1>Manager Dashboard</h1>
            <p style={{ color: "#617589", fontSize: "14px", margin: 0 }}>
              Welcome back, Manager! Here's a summary of your team's activities.
            </p>
          </div>
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
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div className="card"><h3>Pending Request</h3><p className="value">{pendingCount}</p></div>
          <div className="card success"><h3>Approved Request</h3><p className="value">{approvedCount}</p></div>
          <div className="card danger"><h3>Rejected Request</h3><p className="value">{rejectedCount}</p></div>
          <div className="card" style={{ borderColor: "#ff9900", color: "#ff9900" }}><h3>Info Requested</h3><p className="value">{infoCount}</p></div>
        </div>
        <div className="profile-section">
          <h2>My Profile</h2>
          <div className="profile-grid">
            <div><p className="label">Full Name</p><p className="value">BanuHarshini</p></div>
            <div><p className="label">Manager ID</p><p className="value">MGR-67890</p></div>
            <div><p className="label">Email Address</p><p className="value">banumanager@Abstract.com</p></div>
            <div><p className="label">Department</p><p className="value">Management</p></div>
          </div>
        </div>
         <div className="filter-section" style={{ 
           background: "#f8f9fa", 
           padding: "20px", 
           borderRadius: "12px", 
           marginTop: "30px",
           border: "1px solid #e9ecef"
         }}>
           <h3 style={{ margin: "0 0 16px 0", color: "#495057", fontSize: "18px", fontWeight: "600" }}>
             Filter Team Requests
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
                 onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} 
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
                 Region
               </label>
               <select 
                 onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))} 
                 value={filters.region}
                 style={{
                   width: "100%",
                   padding: "8px 12px",
                   border: "1px solid #ced4da",
                   borderRadius: "6px",
                   fontSize: "14px",
                   backgroundColor: "white"
                 }}
               >
                 {regionOptions.map((r) => (
                   <option key={r} value={r}>
                     {r ? r.charAt(0).toUpperCase() + r.slice(1) : "All Regions"}
                   </option>
                 ))}
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
                 From Date
               </label>
               <input 
                 type="date" 
                 value={filters.dateFrom} 
                 onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
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
                 onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
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
                 Employee Search
               </label>
               <input 
                 type="text" 
                 placeholder="Search by name or ID..." 
                 value={filters.employee} 
                 onChange={(e) => setFilters((f) => ({ ...f, employee: e.target.value }))} 
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
             
             <div style={{ display: "flex", alignItems: "end" }}>
               <button
                 onClick={() => setFilters({ status: "", region: "", employee: "", dateFrom: "", dateTo: "" })}
                 style={{
                   padding: "8px 16px",
                   backgroundColor: "#6c757d",
                   color: "white",
                   border: "none",
                   borderRadius: "6px",
                   fontSize: "14px",
                   cursor: "pointer",
                   fontWeight: "500"
                 }}
               >
                 Clear Filters
               </button>
             </div>
           </div>
         </div>
        <div className="expenses-section card">
          <h2 className="section-title">Team Requests</h2>
          <table className="table">
             <thead>
               <tr>
                 <th>Employee ID</th>
                 <th>Title</th>
                 <th>Date Submitted</th>
                 <th>Amount</th>
                 <th>Status</th>
                 <th>Receipt</th>
                 <th>Actions</th>
               </tr>
             </thead>
            <tbody>
              {filtered.map((exp, index) => (
                <tr key={exp.id || index}>
                  <td>{exp.employeeName || exp.employee || "Unknown"}</td>
                  <td>{exp.title}</td>
                  <td>{exp.dateSubmitted}</td>
                  <td>{exp.amount}</td>
                  <td className={`status ${(exp.status || "").toLowerCase()}`}>
                    <span>{exp.status ? exp.status.charAt(0).toUpperCase() + exp.status.slice(1) : ""}</span>
                  </td>
                  <td>
                    {exp.receiptUrl ? (
                      <button
                        style={{
                          background: "#1173d4",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px 10px"
                        }}
                        onClick={() => { setShowReceipt(true); setReceiptUrl(exp.receiptUrl); }}
                      >
                        View Receipt
                      </button>
                    ) : (
                      <span style={{ color: "grey" }}>No Receipt</span>
                    )}
                  </td>
                  <td>
                    <button
                      style={{ marginRight: 8, background: "#1db897", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 10px" }}
                      onClick={() => updateStatus(exp.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      style={{ marginRight: 8, background: "#d0021b", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 10px" }}
                      onClick={() => updateStatus(exp.id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      style={{ background: "#ff9900", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 10px" }}
                      onClick={() => { setModalExpense(exp); setShowModal(true); }}
                    >
                      Request Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RequestInfoModal show={showModal} onClose={() => setShowModal(false)} expense={modalExpense} onCommentSubmit={handleRequestInfo} />
        <ReceiptModal show={showReceipt} url={receiptUrl} onClose={() => setShowReceipt(false)} />
        <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      </main>
    </div>
  );
}


