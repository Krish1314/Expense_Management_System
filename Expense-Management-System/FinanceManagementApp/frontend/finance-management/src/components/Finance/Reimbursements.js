import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function StatCard({title, value, sub, color}){
  return (
    <div className="card">
      <div style={{fontSize:13, color:'#6b7280'}}>{title}</div>
      <div style={{fontSize:22, fontWeight:700, color: color||'#111'}}>{value}</div>
      {sub && <div style={{fontSize:12, color:'#10b981'}}>{sub}</div>}
    </div>
  );
}

export default function Reimbursements(){
  const [activeFilter, setActiveFilter] = useState('Status');

  const handleDownloadPDF = () => {
    // Sample reimbursement data
    const reimbursementData = [
      { employee: 'John Doe', team: 'Engineering', date: '2023-10-27', amount: '$150.00', status: 'Approved' },
      { employee: 'Jane Smith', team: 'Marketing', date: '2023-10-26', amount: '$75.50', status: 'Pending' },
      { employee: 'Peter Jones', team: 'Sales', date: '2023-10-25', amount: '$250.00', status: 'Rejected' },
      { employee: 'Alice Johnson', team: 'HR', date: '2023-10-24', amount: '$180.00', status: 'Approved' },
      { employee: 'Bob Wilson', team: 'Finance', date: '2023-10-23', amount: '$95.75', status: 'Pending' }
    ];

    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reimbursement Summary Report', 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Reimbursements Submitted: 1,234', 20, 75);
    doc.text('Total Amount Reimbursed: $56,789', 20, 85);
    doc.text('Pending Reimbursements: 56', 20, 95);
    doc.text('Average Reimbursement Time: 3.2 days', 20, 105);
    
    // Prepare table data
    const tableData = reimbursementData.map(row => [
      row.employee,
      row.team,
      row.date,
      row.amount,
      row.status
    ]);
    
    // Add table
    doc.autoTable({
      head: [['Employee Name', 'Team', 'Submission Date', 'Amount', 'Status']],
      body: tableData,
      startY: 120,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [17, 115, 212],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
      doc.text('Finance Management System', doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
    }
    
    // Download the PDF
    doc.save(`reimbursement-summary-${new Date().toISOString().split('T')[0]}.pdf`);
    
    alert('✅ PDF report downloaded successfully!');
  };

  const handleDownloadExcel = () => {
    // Sample reimbursement data
    const reimbursementData = [
      { employee: 'John Doe', team: 'Engineering', date: '2023-10-27', amount: '$150.00', status: 'Approved' },
      { employee: 'Jane Smith', team: 'Marketing', date: '2023-10-26', amount: '$75.50', status: 'Pending' },
      { employee: 'Peter Jones', team: 'Sales', date: '2023-10-25', amount: '$250.00', status: 'Rejected' },
      { employee: 'Alice Johnson', team: 'HR', date: '2023-10-24', amount: '$180.00', status: 'Approved' },
      { employee: 'Bob Wilson', team: 'Finance', date: '2023-10-23', amount: '$95.75', status: 'Pending' }
    ];

    // Create CSV content
    let csvContent = 'Employee Name,Team,Submission Date,Amount,Status\n';
    reimbursementData.forEach(row => {
      csvContent += `${row.employee},${row.team},${row.date},${row.amount},${row.status}\n`;
    });
    
    // Add summary statistics to CSV
    csvContent += '\n\nSummary Statistics\n';
    csvContent += 'Total Reimbursements Submitted,1234\n';
    csvContent += 'Total Amount Reimbursed,$56789\n';
    csvContent += 'Pending Reimbursements,56\n';
    csvContent += 'Average Reimbursement Time,3.2 days\n';
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reimbursement-summary-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('✅ Excel/CSV report downloaded successfully!');
  };
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <div>
          <h1 style={{margin:0}}>Reimbursement Summary</h1>
          <div style={{color:'#6b7280'}}>View and manage all employee reimbursements.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
          <button className="btn btn-success" onClick={handleDownloadExcel}>Download Excel</button>
        </div>
      </div>

      <div className="card-row">
        <StatCard title="Total Reimbursements Submitted" value="1,234" sub="+5.2%" color="#111" />
        <StatCard title="Total Amount Reimbursed" value="$56,789" sub="+2.1%" color="#111" />
        <StatCard title="Pending Reimbursements" value="56" sub="-1.5%" color="#111" />
        <StatCard title="Average Reimbursement Time" value="3.2 days" sub="+0.2 days" color="#111" />
      </div>

      <div style={{margin:'12px 0 18px 0'}}>
        <div style={{display:'flex', gap:8}}>
          <button 
            className={`pill ${activeFilter === 'Employee' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Employee')}
          >
            Employee
          </button>
          <button 
            className={`pill ${activeFilter === 'Team' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Team')}
          >
            Team
          </button>
          <button 
            className={`pill ${activeFilter === 'Date Range' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Date Range')}
          >
            Date Range
          </button>
          <button 
            className={`pill ${activeFilter === 'Status' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Status')}
          >
            Status
          </button>
        </div>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr><th>EMPLOYEE NAME</th><th>TEAM</th><th>SUBMISSION DATE</th><th>AMOUNT</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            <tr><td>John Doe</td><td>Engineering</td><td>2023-10-27</td><td>$150.00</td><td style={{color:'#10b981'}}>Approved</td><td style={{color:'#2563eb'}}>View Details</td></tr>
            <tr><td>Jane Smith</td><td>Marketing</td><td>2023-10-26</td><td>$75.50</td><td style={{color:'#f59e0b'}}>Pending</td><td style={{color:'#2563eb'}}>View Details</td></tr>
            <tr><td>Peter Jones</td><td>Sales</td><td>2023-10-25</td><td>$250.00</td><td style={{color:'#ef4444'}}>Rejected</td><td style={{color:'#2563eb'}}>View Details</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
