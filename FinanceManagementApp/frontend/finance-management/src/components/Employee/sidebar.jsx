import React from "react";
import { MdOutlineDashboard, MdOutlineHelpOutline } from "react-icons/md";
import { CiMoneyCheck1 } from "react-icons/ci";
import { BiBarChartSquare } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../assests/image.png";

export default function Sidebar() {
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
      {/* Profile */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <img src={image} alt="profile" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>John Doe</p>
          <p style={{ fontSize: "12px", color: "#617589", margin: 0 }}>Employee</p>
        </div>
      </div>

      {/* Links */}
      <nav className="nav-links">
        <Link
          className={location.pathname === "/employee/dashboard" ? "active" : ""}
          to="/employee/dashboard"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <MdOutlineDashboard size={20} /> Dashboard
        </Link>

        <Link
          className={location.pathname === "/employee/profile" ? "active" : ""}
          to="/employee/profile"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <CgProfile size={20} /> Profile
        </Link>

        <Link
          className={location.pathname === "/employee/expenses" ? "active" : ""}
          to="/employee/expenses"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <BiBarChartSquare size={20} /> Expenses
        </Link>

        <Link
          className={location.pathname === "/employee/reimbursements" ? "active" : ""}
          to="/employee/reimbursements"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <CiMoneyCheck1 size={20} /> Reimbursements
        </Link>
      </nav>

      {/* Bottom */}
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
