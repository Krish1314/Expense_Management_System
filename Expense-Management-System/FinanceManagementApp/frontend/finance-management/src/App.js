import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Employee/sidebar";
import Dashboard from "./components/Employee/Dashboard";
import Profile from "./components/Employee/Profile";
import Expenses from "./components/Employee/Expense";
import Reimbursements from "./components/Employee/Reimbursement";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import ManagerLayout from "./components/Manager/Layout";
import ManagerDashboard from "./components/Manager/Dashboard";
import ManagerProfile from "./components/Manager/Profile";
import FinanceDashboard from "./components/Finance/Dashboard";
import FinanceReports from "./components/Finance/Reports";
import FinanceReimbursements from "./components/Finance/Reimbursements";
import FinanceMasterData from "./components/Finance/MasterData";
import FinanceProfile from "./components/Finance/Profile";
import FinanceSidebar from "./components/Finance/sidebar";
import "./App.css";

function EmployeeLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function FinanceLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <FinanceSidebar />
      <div style={{ flex: 1, padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Employee dashboard routes with sidebar */}
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeLayout>
              <Dashboard />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <EmployeeLayout>
              <Profile />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/expenses"
          element={
            <EmployeeLayout>
              <Expenses />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/reimbursements"
          element={
            <EmployeeLayout>
              <Reimbursements />
            </EmployeeLayout>
          }
        />

        {/* Manager routes (sidebar and dashboard/profile to the right) */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>
        
        {/* Finance routes with sidebar */}
        <Route
          path="/finance/dashboard"
          element={
            <FinanceLayout>
              <FinanceDashboard />
            </FinanceLayout>
          }
        />
        <Route
          path="/finance/reports"
          element={
            <FinanceLayout>
              <FinanceReports />
            </FinanceLayout>
          }
        />
        <Route
          path="/finance/reimbursements"
          element={
            <FinanceLayout>
              <FinanceReimbursements />
            </FinanceLayout>
          }
        />
        <Route
          path="/finance/master-data"
          element={
            <FinanceLayout>
              <FinanceMasterData />
            </FinanceLayout>
          }
        />
        <Route
          path="/finance/profile"
          element={
            <FinanceLayout>
              <FinanceProfile />
            </FinanceLayout>
          }
        />
      </Routes>
    </Router>
  );
}
