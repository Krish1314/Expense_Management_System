import React from "react";
import { MdOutlineDashboard, MdOutlineHelpOutline, MdOutlineReceipt, MdOutlineAssessment, MdOutlineStorage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../assests/image.png";

export default function FinanceSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Profile Section */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <img src={image} alt="profile" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>Finance Admin</p>
          <p style={{ fontSize: "12px", color: "#617589", margin: 0 }}>Finance Department</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link
          className={location.pathname === "/finance/dashboard" ? "active" : ""}
          to="/finance/dashboard"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <MdOutlineDashboard size={20} /> Dashboard
        </Link>

        <Link
          className={location.pathname === "/finance/reports" ? "active" : ""}
          to="/finance/reports"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <MdOutlineAssessment size={20} /> Reports
        </Link>

        <Link
          className={location.pathname === "/finance/reimbursements" ? "active" : ""}
          to="/finance/reimbursements"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <MdOutlineReceipt size={20} /> Reimbursements
        </Link>

        <Link
          className={location.pathname === "/finance/master-data" ? "active" : ""}
          to="/finance/master-data"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <MdOutlineStorage size={20} /> Master Data
        </Link>

        <Link
          className={location.pathname === "/finance/profile" ? "active" : ""}
          to="/finance/profile"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <CgProfile size={20} /> Profile
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <div className="bottom-links">
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
            <IoSettings size={20} /> Settings
          </a>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
            <MdOutlineHelpOutline size={20} /> Help
          </a>
        </div>
      </div>
    </aside>
  );
}
