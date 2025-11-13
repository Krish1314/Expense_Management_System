import { API_BASE } from "../../config";
import React, { useState, useEffect } from "react";
import "../../App.css";
import EditProfileModal from "./EditProfile";

export default function FinanceProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API endpoint for finance admin profile
    fetch(`${API_BASE}/api/finance/profile`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((e) => {
        // Fallback data for demo purposes
        setProfile({
          name: "Finance Admin",
          email: "finance.admin@company.com",
          phone: "+1 (555) 123-4567",
          address: "123 Finance Street, Admin City, AC 12345",
          employeeId: "FIN-001",
          department: "Finance Department",
          role: "Finance Administrator",
          manager: "CFO",
          region: "Global",
          currency: "USD"
        });
        setLoading(false);
      });
  }, []);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>Finance Admin Profile</h1>
      <p style={{ color: "#617589", fontSize: "14px" }}>
        Manage your finance administrator account settings and information.
      </p>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-info">
            <div
              className="profile-image"
              style={{
                backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}")`,
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: "16px"
              }}
            ></div>
            <div className="profile-text">
              <h2 style={{ margin: "0 0 4px 0" }}>{profile.name}</h2>
              <p style={{ margin: 0, color: "#617589", fontSize: "14px" }}>Finance Administrator</p>
            </div>
          </div>
          <button className="edit-btn" onClick={openEditModal}>
            ✎ Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Contact Information</h2>
        <div className="profile-grid">
          <div>
            <p className="label">Email Address</p>
            <p className="value">{profile.email}</p>
          </div>
          <div>
            <p className="label">Phone Number</p>
            <p className="value">{profile.phone}</p>
          </div>
          <div>
            <p className="label">Address</p>
            <p className="value">{profile.address}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>Professional Information</h2>
        <div className="profile-grid">
          <div>
            <p className="label">Employee ID</p>
            <p className="value">{profile.employeeId}</p>
          </div>
          <div>
            <p className="label">Department</p>
            <p className="value">{profile.department}</p>
          </div>
          <div>
            <p className="label">Role</p>
            <p className="value">{profile.role}</p>
          </div>
          <div>
            <p className="label">Reporting To</p>
            <p className="value">{profile.manager}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>System Settings</h2>
        <div className="profile-grid">
          <div>
            <p className="label">Region</p>
            <p className="value">{profile.region}</p>
          </div>
          <div>
            <p className="label">Currency</p>
            <p className="value">{profile.currency}</p>
          </div>
          <div>
            <p className="label">Access Level</p>
            <p className="value">Full Admin Access</p>
          </div>
          <div>
            <p className="label">Last Login</p>
            <p className="value">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {isEditOpen && <EditProfileModal onClose={closeEditModal} />}
    </div>
  );
}
