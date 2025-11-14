import { API_BASE } from "../../config";
import React, { useState, useEffect } from "react";
import "./Expense.css";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function Expense() {
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Currency: "₹ INR",
    Amount: 0,
    Category: "Travel",
    Description: "",
  });
  const [file, setFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const loggedInEmployeeId = 4; // Replace this with dynamic logged-in user ID

  // Fetch employee's expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    fetch(`${API_BASE}/api/employee/expenses`)
      .then(res => res.json())
      .then(data => {
        setExpenses(data);
      })
      .catch(error => console.error("Error fetching expenses:", error));
  };

  // ✅ Form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ Submit new expense
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    // Map UI fields to backend model names
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "Date") {
        data.append("DateSubmitted", value);
      } else {
        data.append(key, value);
      }
    });
    data.append("EmployeeId", loggedInEmployeeId);
    if (file) data.append("receipt", file);

    fetch(`${API_BASE}/api/employee/expenses`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setShowSuccessModal(true);
        setFormData({
          Title: "",
          Date: "",
          Currency: "₹ INR",
          Amount: 0,
          Category: "Travel",
          Description: "",
        });
        setFile(null);
        fetchExpenses(); // Refresh expenses list after submission
      })
      .catch((err) => console.error("Error submitting expense:", err));
  };

  // ✅ Render UI
  return (
    <main className="expense-container">
      <div className="expense-left">
        <div className="expense-header">
          <h1>Submit a New Expense</h1>
          <p>Welcome, John Doe!</p>
        </div>

        <form className="expense-form" onSubmit={handleSubmit}>
          {/* FIRST ROW: Expense Title and Date */}
          <label>
            <span>Expense Title</span>
            <input
              type="text"
              name="Title"
              placeholder="e.g., Team Lunch"
              value={formData.Title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>Expense Date</span>
            <input
              type="date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              required
            />
          </label>

          {/* SECOND ROW: Currency and Amount */}
          <label>
            <span>Currency</span>
            <select
              name="Currency"
              value={formData.Currency}
              onChange={handleChange}
            >
              <option>₹ INR</option>
              <option>£ GBP</option>
              <option>$ USD</option>
            </select>
          </label>
          <label>
            <span>Amount</span>
            <input
              type="number"
              name="Amount"
              placeholder="0.00"
              value={formData.Amount}
              onChange={handleChange}
              required
            />
          </label>

          {/* THIRD ROW: Expense Category */}
          <label className="double">
            <span>Expense Category</span>
            <select
              name="Category"
              value={formData.Category}
              onChange={handleChange}
            >
              <option>Travel</option>
              <option>Food & Dining</option>
              <option>Office Supplies</option>
              <option>Software & Subscriptions</option>
              <option>Client Entertainment</option>
              <option>Other</option>
            </select>
          </label>

          {/* FOURTH ROW: Description */}
          <label className="double">
            <span>Description</span>
            <textarea
              name="Description"
              placeholder="Add a short description..."
              value={formData.Description}
              onChange={handleChange}
            />
          </label>

          {/* Receipt Upload */}
          <div className="file-upload double">
            <span>Upload Receipts</span>
            <label className="upload-box" htmlFor="receipt-file">
              <IoCloudUploadOutline
                size={30}
                style={{ marginTop: "20px" }}
                className="upload-icon"
              />
              <p style={{ marginTop: "2px", color: "grey" }}>
                Click to upload or drag and drop
              </p>
              <p style={{ marginTop: "0px" }}>
                PNG, JPG, or PDF (MAX. 5MB)
              </p>
              <input
                type="file"
                id="receipt-file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
              />
            </label>
            {file && <p style={{ color: "green" }}>File attached: {file.name}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Submit Expense
          </button>
        </form>

      </div>

      {/* Expenses Table */}
      <div style={{ marginTop: "40px" }}>
        <h2>My Expenses</h2>
        <div className="table-container" style={{ marginTop: "20px" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Status</th>
                <th>Manager Comment</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title || expense.Title}</td>
                  <td>{new Date(expense.date || expense.Date).toLocaleDateString()}</td>
                  <td>{expense.currency || "₹"} {expense.amount || expense.Amount}</td>
                  <td>{expense.category || expense.Category}</td>
                  <td>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      background: expense.status?.toLowerCase() === "info requested" ? "#e0e0ff" : 
                                expense.status?.toLowerCase() === "approved" ? "#dcffe4" :
                                expense.status?.toLowerCase() === "rejected" ? "#ffe0e0" : "#fff3dc",
                      color: expense.status?.toLowerCase() === "info requested" ? "#4444ff" :
                            expense.status?.toLowerCase() === "approved" ? "#17b897" :
                            expense.status?.toLowerCase() === "rejected" ? "#ff4444" : "#ffa500"
                    }}>
                      {expense.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    {expense.managerComment ? (
                      <div style={{ 
                        padding: "8px", 
                        background: "#f5f5f5", 
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0"
                      }}>
                        {expense.managerComment}
                      </div>
                    ) : (
                      <span style={{ color: "#999" }}>No comments yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: "center", border: "2px solid #17b897" }}>
            <h2 style={{ color: "#17b897" }}>✓ Successfully Submitted</h2>
            <p>Your expense has been submitted successfully!</p>
            <button
              style={{
                background: "#17b897",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


