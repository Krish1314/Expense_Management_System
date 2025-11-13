import { API_BASE } from "../../config";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import EditProfileModal from "./EditProfile";

export default function Profile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/employee/profile`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <main className="profile-main">
      <div className="layout-content-container">
        <div className="profile-headers">
          <div className="profile-top">
            <div className="profile-info">
              <div
                className="profile-image"
                style={{
                  backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}")`,
                }}
              ></div>
              <div className="profile-text">
                <p className="profile-name">{profile.name}</p>
                <p className="profile-role">{profile.role}</p>
              </div>
            </div>
            <button className="edit-btn" onClick={openEditModal}>
              ✎ Edit Profile
            </button>
          </div>
        </div>
        <div className="info-grid-wrapper">
          <div className="info-card">
            <h2>Contact Information</h2>
            <div className="info-grid">
              <p className="label">Email</p>
              <p className="value">{profile.email}</p>
              <p className="label">Phone Number</p>
              <p className="value">{profile.phone}</p>
              <p className="label">Address</p>
              <p className="value">{profile.address}</p>
            </div>
          </div>
          <div className="info-card">
            <h2>Professional Information</h2>
            <div className="info-grid">
              <p className="label">Employee ID</p>
              <p className="value">{profile.employeeId}</p>
              <p className="label">Department</p>
              <p className="value">{profile.department}</p>
              <p className="label">Role</p>
              <p className="value">{profile.role}</p>
              <p className="label">Reporting Manager</p>
              <p className="value">{profile.manager}</p>
            </div>
          </div>
        </div>
        <div className="info-card settings-card">
          <h2>Settings</h2>
          <div className="info-grid">
            <p className="label">Region</p>
            <p className="value">{profile.region}</p>
            <p className="label">Currency</p>
            <p className="value">{profile.currency}</p>
          </div>
        </div>
      </div>
      {isEditOpen && <EditProfileModal onClose={closeEditModal} />}
    </main>
  );
}
