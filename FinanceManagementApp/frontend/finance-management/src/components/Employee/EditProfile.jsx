import React, { useState } from "react";
import "./Profile.css";

export default function EditProfileModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123-456-7890",
    address: "123 Main St, Anytown, USA",
    department: "Engineering",
    role: "Software Engineer",
    reportingManager: "Jane Smith",
    region: "North America",
    currency: "USD ($)",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose(); // Close modal and go back to profile
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="department">Department</label>
            <input id="department" type="text" value={formData.department} disabled />
          </div>
          <div className="form-row">
            <label htmlFor="role">Role</label>
            <input id="role" type="text" value={formData.role} disabled />
          </div>
          <div className="form-row">
            <label htmlFor="reportingManager">Reporting Manager</label>
            <input id="reportingManager" type="text" value={formData.reportingManager} disabled />
          </div>

          <div className="form-row">
            <label htmlFor="region">Region</label>
            <input id="region" type="text" value={formData.region} disabled />
          </div>
          <div className="form-row">
            <label htmlFor="currency">Currency</label>
            <input id="currency" type="text" value={formData.currency} disabled />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
