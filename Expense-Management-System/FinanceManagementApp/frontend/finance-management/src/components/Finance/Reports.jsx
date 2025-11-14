import React, { useState, useEffect } from "react";
import "../../App.css";
import * as XLSX from 'xlsx';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    department: ""
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const response = await fetch(`${base}/api/finance/reports`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        // Use mock data for development
        setReports([
          {
            id: 1,
            department: "Engineering",
            category: "Travel",
            total: 12345.67,
            count: 5,
            averageAmount: 2469.13,
            monthYear: "October 2025"
          },
          {
            id: 2,
            department: "Marketing",
            category: "Meals",
            total: 5432.10,
            count: 8,
            averageAmount: 679.01,
            monthYear: "October 2025"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = reports.map(report => ({
      'Department': report.department,
      'Category': report.category,
      'Total Amount': report.total,
      'Number of Expenses': report.count,
      'Average Amount': report.averageAmount,
      'Month/Year': report.monthYear
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finance Reports");
    XLSX.writeFile(wb, "finance_reports.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Financial Reports</h1>
          <p style={{ color: "#617589", fontSize: "14px", margin: 0 }}>
            View and analyze expense reports across departments
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

      <div className="filter-section" style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "12px",
        marginBottom: "20px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ margin: "0 0 16px 0" }}>Filter Reports</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <label>From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>
          <div>
            <label>To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            >
              <option value="">All Categories</option>
              <option value="Travel">Travel</option>
              <option value="Meals">Meals</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
          <div>
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Category</th>
                <th>Total Amount</th>
                <th>Number of Expenses</th>
                <th>Average Amount</th>
                <th>Month/Year</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.department}</td>
                  <td>{report.category}</td>
                  <td>₹ {report.total.toFixed(2)}</td>
                  <td>{report.count}</td>
                  <td>₹ {report.averageAmount.toFixed(2)}</td>
                  <td>{report.monthYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}