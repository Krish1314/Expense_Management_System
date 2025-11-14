import React, { useState } from "react";

export default function EditProfileModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "Finance Admin",
    email: "finance.admin@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Finance Street, Admin City, AC 12345",
    department: "Finance Department",
    region: "Global",
    currency: "USD"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Updating profile:", formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Finance Admin Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="Global">Global</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ background: "#606266", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none" }}>
              Cancel
            </button>
            <button type="submit" style={{ background: "#1173d4", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
