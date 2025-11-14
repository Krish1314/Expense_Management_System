import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import "../../App.css";
import * as XLSX from 'xlsx';

export default function EmployeeDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    dateSubmitted: "",
    status: "pending"
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const fetchExpenses = () => {
    fetch(`${API_BASE}/api/employee/expenses`)
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setFilteredExpenses(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchExpenses();
    // Refresh data every 30 seconds to get updated comments
    const interval = setInterval(fetchExpenses, 30000);
    return () => clearInterval(interval);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(expense => {
        const title = (expense.title || expense.Title || "").toLowerCase();
        const amount = (expense.amount || expense.Amount || "").toString();
        const status = (expense.status || expense.Status || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return title.includes(search) || 
               amount.includes(search) || 
               status.includes(search);
      });
      setFilteredExpenses(filtered);
    }
  }, [searchTerm, expenses]);

  function handleFormChange(e) {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  }

  function handleExpenseSubmit(e) {
    e.preventDefault();
    fetch(`${API_BASE}/api/employee/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense)
    })
      .then((res) => res.json())
      .then(() => {
        setShowForm(false);
        setNewExpense({ title: "", amount: "", dateSubmitted: "", status: "pending" });
        // Fetch updated expenses
        fetchExpenses();
      });
  }

  const exportToExcel = () => {
    const exportData = filteredExpenses.map(expense => ({
      'Title': expense.title || expense.Title || "",
      'Date Submitted': expense.dateSubmitted || expense.Date || "",
      'Amount': expense.amount || expense.Amount || "",
      'Status': expense.status || expense.Status || "",
      'Manager Comment': expense.managerComment || expense.ManagerComment || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Expenses");
    XLSX.writeFile(wb, "my_expenses.xlsx");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <main className="main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1 style={{ marginBottom: "6px" }}>Employee Dashboard</h1>
            <p style={{ color: "#617589", fontSize: "14px", marginTop: "0" }}>
              Welcome back, John! Here's a summary of your activities.
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
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="card">
            <h3 style={{ marginBottom: "10px" }}>Pending Approval</h3>
            <p className="value">{expenses.filter(e => ((e.status || e.Status) || "").toString().toLowerCase() === "pending").length}</p>
            <p>expenses awaiting manager approval</p>
          </div>
          <div className="card success">
            <h3 style={{ marginBottom: "10px" }}>Reimbursed this month</h3>
            <p className="value">
              ₹ {expenses.filter(e => ((e.status || e.Status) || "").toString().toLowerCase() === "approved").reduce((sum, e) => sum + Number(e.amount || e.Amount || 0), 0)}
            </p>
            <p>across {expenses.filter(e => ((e.status || e.Status) || "").toString().toLowerCase() === "approved").length} approved expenses</p>
          </div>
          <div className="card danger">
            <h3 style={{ marginBottom: "10px" }}>Rejected Expenses</h3>
            <p className="value">{expenses.filter(e => ((e.status || e.Status) || "").toString().toLowerCase() === "rejected").length}</p>
            <p>requires your attention</p>
          </div>
        </div>
        <div className="profile-section">
          <h2>My Profile</h2>
          <div className="profile-grid">
            <div>
              <p className="label">Full Name</p>
              <p className="value">John Doe</p>
            </div>
            <div>
              <p className="label">Employee ID</p>
              <p className="value">EMP-12345</p>
            </div>
            <div>
              <p className="label">Email Address</p>
              <p className="value">johndoe@abstract.com</p>
            </div>
            <div>
              <p className="label">Reporting Manager</p>
              <p className="value">Jane Smith</p>
            </div>
          </div>
        </div>
        <div className="expenses-section card">
          <div className="expenses-header-container">
            <h2 className="section-title">My Expenses</h2>
            <div className="expenses-controls">
              <input 
                type="text" 
                placeholder="Search expenses..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="add-expense-btn" onClick={() => setShowForm(true)}>
                <span className="material-symbols-outlined">+</span>
                Submit New Expense
              </button>
            </div>
          </div>
          {/* Expense Form Modal */}
          {showForm && (
            <form onSubmit={handleExpenseSubmit} className="expense-form" style={{ marginTop: "15px", marginBottom: "15px" }}>
              <input name="title" value={newExpense.title} onChange={handleFormChange} placeholder="Title" required />
              <input name="amount" value={newExpense.amount} type="number" onChange={handleFormChange} placeholder="Amount" required />
              <input name="dateSubmitted" value={newExpense.dateSubmitted} type="date" onChange={handleFormChange} required />
              <select name="status" value={newExpense.status} onChange={handleFormChange}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          )}
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date Submitted</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Manager Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, index) => {
                const statusVal = ((exp.status || exp.Status) || "").toString();
                const statusLower = statusVal.toLowerCase();
                const title = exp.title || exp.Title || "";
                const dateSubmitted = exp.dateSubmitted || exp.dateSubmitted || exp.Date || "";
                const amount = exp.amount || exp.Amount || "";
                const managerComment = exp.managerComment || exp.ManagerComment || "N/A";
                return (
                  <tr key={index}>
                    <td>{title}</td>
                    <td>{dateSubmitted}</td>
                    <td>{amount}</td>
                    <td className={`status ${statusLower}`}>
                      <span>{statusVal ? statusVal.charAt(0).toUpperCase() + statusVal.slice(1) : ""}</span>
                    </td>
                    <td style={{ 
                      color: managerComment !== "N/A" ? "#333" : "#999",
                      fontStyle: managerComment !== "N/A" ? "normal" : "italic"
                    }}>
                      {managerComment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
