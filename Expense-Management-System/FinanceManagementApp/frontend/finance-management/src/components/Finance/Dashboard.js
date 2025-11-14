import React, { useMemo, useState, useRef, useEffect } from 'react';
import '../../App.css';

export default function FinanceDashboard(){
  const initialRows = useMemo(() => ([
    { id: 1, employee: 'John Doe', team: 'Engineering', date: '2023-10-26', amount: 250.00, status: 'pending', category: 'Travel' },
    { id: 2, employee: 'Jane Smith', team: 'Marketing', date: '2023-10-25', amount: 120.50, status: 'approved', category: 'Meals' },
    { id: 3, employee: 'Sam Wilson', team: 'Sales', date: '2023-10-24', amount: 500.75, status: 'rejected', category: 'Office Supplies' }
  ]), []);
  const [rows, setRows] = useState(initialRows);
  const [selectedVerification, setSelectedVerification] = useState({
    id: 1,
    employee: 'John Doe',
    team: 'Engineering Team',
    amount: 250.00,
    category: 'Travel',
    receiptUrl: 'view_receipt.pdf',
    salaryMonth: 'November 2023'
  });
  const [dashboardStats, setDashboardStats] = useState({
    pending: 12345,
    approved: 87654,
    submissions: 123,
    rejected: 5
  });
  
  // Chart refs
  const annualChartRef = useRef(null);
  const teamChartRef = useRef(null);

  // Calculate live data for charts
  const getChartData = () => {
    const approvedExpenses = rows.filter(r => r.status === 'approved');
    const totalApproved = approvedExpenses.reduce((sum, r) => sum + r.amount, 0);
    
    // Category breakdown
    const categoryData = {};
    approvedExpenses.forEach(expense => {
      categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });
    
    // Team breakdown
    const teamData = {};
    approvedExpenses.forEach(expense => {
      teamData[expense.team] = (teamData[expense.team] || 0) + expense.amount;
    });
    
    return { categoryData, teamData, totalApproved };
  };

  const drawPieChart = (canvasRef, data, colors) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const entries = Object.entries(data);
    if (entries.length === 0) return;
    
    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);
    let currentAngle = -Math.PI / 2;
    
    entries.forEach(([name, amount], index) => {
      const sliceAngle = (amount / total) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });
  };

  useEffect(() => {
    const { categoryData, teamData } = getChartData();
    const categoryColors = ['#1173d4', '#1db897', '#ff9900', '#d0021b', '#6b7280'];
    const teamColors = ['#1173d4', '#1db897', '#ff9900', '#d0021b'];
    
    drawPieChart(annualChartRef, categoryData, categoryColors);
    drawPieChart(teamChartRef, teamData, teamColors);
  }, [rows]);

  const handleApprove = () => {
    // Update the row status
    setRows(prev => prev.map(r => 
      r.id === selectedVerification.id 
        ? { ...r, status: 'approved' }
        : r
    ));
    
    // Update dashboard stats
    setDashboardStats(prev => ({
      ...prev,
      pending: prev.pending - selectedVerification.amount,
      approved: prev.approved + selectedVerification.amount,
      submissions: prev.submissions + 1
    }));
    
    alert(`✅ Approved expense for ${selectedVerification.employee} - $${selectedVerification.amount}`);
    
    // TODO: Integrate with backend
    // fetch(`https://localhost:7086/api/finance/expenses/${selectedVerification.id}/approve`, { method: 'POST' })
  };

  const handleReject = () => {
    // Update the row status
    setRows(prev => prev.map(r => 
      r.id === selectedVerification.id 
        ? { ...r, status: 'rejected' }
        : r
    ));
    
    // Update dashboard stats
    setDashboardStats(prev => ({
      ...prev,
      pending: prev.pending - selectedVerification.amount,
      rejected: prev.rejected + 1
    }));
    
    alert(`❌ Rejected expense for ${selectedVerification.employee} - $${selectedVerification.amount}`);
    
    // TODO: Integrate with backend
    // fetch(`https://localhost:7086/api/finance/expenses/${selectedVerification.id}/reject`, { method: 'POST' })
  };

  return (
    <div>
      <h1>Finance Admin Dashboard</h1>
      <p style={{ color: "#617589", fontSize: "14px" }}>
        Welcome to the Finance Admin Dashboard. Here's an overview of expense management activities.
      </p>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div className="card"><h3>Total Pending Expenses</h3><p className="value" style={{color:'#d97706'}}>${dashboardStats.pending.toLocaleString()}</p><p>awaiting approval</p></div>
        <div className="card success"><h3>Total Approved Expenses</h3><p className="value">${dashboardStats.approved.toLocaleString()}</p><p>approved this month</p></div>
        <div className="card"><h3>Total Submissions</h3><p className="value">{dashboardStats.submissions}</p><p>submissions this month</p></div>
        <div className="card" style={{ borderColor: "#ff9900", color: "#ff9900" }}><h3>Rejected Expenses</h3><p className="value">{dashboardStats.rejected}</p><p>rejected this month</p></div>
      </div>

      <div className="profile-section">
        <h2>Report Overview</h2>
        <div className="profile-grid">
          <div>
            <p className="label">Expense Category Breakdown</p>
            <div style={{height:160, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', marginTop:8, position: 'relative'}}>
              <canvas
                ref={annualChartRef}
                width={140}
                height={140}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {Object.keys(getChartData().categoryData).length === 0 && (
                <div style={{ position: 'absolute', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <div>No approved expenses yet</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              {Object.entries(getChartData().categoryData).map(([category, amount], index) => (
                <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: ['#1173d4', '#1db897', '#ff9900', '#d0021b', '#6b7280'][index % 5],
                      borderRadius: '50%',
                      marginRight: '6px'
                    }}
                  />
                  <span>{category}: ${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Team-wise Expenses</p>
            <div style={{height:160, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', marginTop:8, position: 'relative'}}>
              <canvas
                ref={teamChartRef}
                width={140}
                height={140}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {Object.keys(getChartData().teamData).length === 0 && (
                <div style={{ position: 'absolute', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                  <div>No team expenses yet</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              {Object.entries(getChartData().teamData).map(([team, amount], index) => (
                <div key={team} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: ['#1173d4', '#1db897', '#ff9900', '#d0021b'][index % 4],
                      borderRadius: '50%',
                      marginRight: '6px'
                    }}
                  />
                  <span>{team}: ${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Recent Submissions Table */}
        <div className="expenses-section card" style={{ flex: 2 }}>
          <h2 className="section-title">Recent Submissions</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Team</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.employee}</td>
                  <td>{r.team}</td>
                  <td>{r.date}</td>
                  <td>${r.amount.toFixed(2)}</td>
                  <td className={`status ${r.status}`}>
                    <span>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => setSelectedVerification({
                        id: r.id,
                        employee: r.employee,
                        team: `${r.team} Team`,
                        amount: r.amount,
                        category: 'Travel',
                        receiptUrl: 'view_receipt.pdf',
                        salaryMonth: 'November 2023'
                      })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Final Verification Card */}
        <div className="card" style={{ flex: 1, minWidth: '300px' }}>
          <h2 className="section-title">Final Verification</h2>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>{selectedVerification.employee}</strong>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
              {selectedVerification.team}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Amount: ${selectedVerification.amount.toFixed(2)}</strong>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Category:</strong> {selectedVerification.category}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Receipts:</strong> 
              <a href="#" style={{ color: '#1173d4', textDecoration: 'none', marginLeft: '4px' }}>
                {selectedVerification.receiptUrl}
              </a>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Reimbursement Salary Month:</strong>
              <select 
                value={selectedVerification.salaryMonth}
                onChange={(e) => setSelectedVerification(prev => ({ ...prev, salaryMonth: e.target.value }))}
                style={{ 
                  marginLeft: '8px', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value="November 2023">November 2025</option>
                <option value="December 2023">December 2025</option>
                <option value="January 2024">January 2026</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className="btn btn-success" 
              onClick={handleApprove}
              style={{ width: '100%', padding: '10px' }}
            >
              Approve & Mark Credited
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleReject}
              style={{ width: '100%', padding: '10px' }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
