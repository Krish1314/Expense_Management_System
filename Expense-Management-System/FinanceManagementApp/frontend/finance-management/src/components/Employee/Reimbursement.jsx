import { API_BASE } from "../../config";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineDownload } from "react-icons/ai";
import { CiMoneyCheck1 } from "react-icons/ci";
import "./Reimbursement.css";

const statusColors = {
  Approved: "green",
  Pending: "yellow",
  Rejected: "red",
};

export default function Reimbursements() {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchText, setSearchText] = useState("");  // added search
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [reimbursements, setReimbursements] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/employee/reimbursement`)
      .then((res) => res.json())
      .then(setReimbursements)
      .catch(console.error);
  }, []);

  const filteredReimbursements = reimbursements.filter((item) => {
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    const dateMatch = dateFilter ? item.date === dateFilter : true;
    const searchMatch = searchText
      ? item.desc.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return statusMatch && dateMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredReimbursements.length / itemsPerPage);
  const paginatedData = filteredReimbursements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="reimbursements-container">
      <header className="header">
        <div className="title">
          <CiMoneyCheck1 size={25} />
          <h1>My Reimbursements</h1>
        </div>
        <div className="actions">
          <div className="search-download">
            <div className="search-box">
              <AiOutlineSearch size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button className="download-btn">
              <AiOutlineDownload size={18} />
              Download PDF
            </button>
          </div>
        </div>
      </header>
      <div className="filters">
        <select
          className="filter-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          className="filter-dropdown"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reimbursement ID</th>
              <th>Date Submitted</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Credited Month</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.desc}</td>
                <td>{item.amount}</td>
                <td>
                  <span className={`status-badge ${statusColors[item.status] || ""}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.credited}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
