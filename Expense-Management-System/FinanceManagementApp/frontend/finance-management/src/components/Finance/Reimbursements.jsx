import React, { useState, useEffect } from "react";
import "../../App.css";

export default function Reimbursements() {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("pending");

  useEffect(() => {
    fetchReimbursements();
  }, [selectedTab]);

  const fetchReimbursements = async () => {
    try {
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const response = await fetch(`${base}/api/finance/reimbursements?status=${selectedTab}`);
      if (response.ok) {
        const data = await response.json();
        setReimbursements(data);
      } else {
        // Use mock data for development
        setReimbursements([
          {
            id: 1,
            employeeName: "John Doe",
            department: "Engineering",
            amount: 12345.67,
            submissionDate: "2025-10-15",
            status: "pending",
            description: "Travel expenses for client meeting"
          },
          {
            id: 2,
            employeeName: "Jane Smith",
            department: "Marketing",
            amount: 5432.10,
            submissionDate: "2025-10-14",
            status: "approved",
            description: "Conference registration fees"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching reimbursements:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const response = await fetch(`${base}/api/finance/reimbursements/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchReimbursements();
      }
    } catch (error) {
      console.error("Error updating reimbursement status:", error);
    }
  };

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setSelectedTab(tab)}
      style={{
        padding: "10px 20px",
        border: "none",
        background: selectedTab === tab ? "#17b897" : "transparent",
        color: selectedTab === tab ? "#fff" : "#333",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.3s ease"
      }}
    >
      {label}
    </button>
  );

  const getStatusBadge = (status) => {
    const styles = {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "capitalize"
    };

    const colors = {
      pending: { background: "#fff3dc", color: "#ffa500" },
      approved: { background: "#dcffe4", color: "#17b897" },
      rejected: { background: "#ffe0e0", color: "#ff4444" }
    };

    return (
      <span style={{ ...styles, ...colors[status] }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Reimbursements</h1>
        <p style={{ color: "#617589", fontSize: "14px", margin: 0 }}>
          Review and process employee reimbursement requests
        </p>
      </div>

      <div style={{ 
        background: "#f8f9fa",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "20px",
        display: "flex",
        gap: "12px"
      }}>
        <TabButton tab="pending" label="Pending" />
        <TabButton tab="approved" label="Approved" />
        <TabButton tab="rejected" label="Rejected" />
      </div>

      {loading ? (
        <p>Loading reimbursements...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reimbursements.map((reimbursement) => (
                <tr key={reimbursement.id}>
                  <td>{reimbursement.employeeName}</td>
                  <td>{reimbursement.department}</td>
                  <td>₹ {reimbursement.amount.toFixed(2)}</td>
                  <td>{reimbursement.description}</td>
                  <td>{new Date(reimbursement.submissionDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(reimbursement.status)}</td>
                  <td>
                    {reimbursement.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => updateStatus(reimbursement.id, "approved")}
                          style={{
                            background: "#17b897",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer"
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(reimbursement.id, "rejected")}
                          style={{
                            background: "#ff4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer"
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}