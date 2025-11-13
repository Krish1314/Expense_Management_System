import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../App.css';

export default function Reports(){
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedChart, setSelectedChart] = useState('expenseBreakdown');
  const [expenseData, setExpenseData] = useState({});
  const canvasRef = useRef(null);

  // Fetch live data from API
  const fetchExpenseData = async (period) => {
    try {
      // Simulate API call with dynamic data
      const baseData = {
        'This Month': {
          categories: [
            { name: 'Travel', amount: Math.floor(Math.random() * 2000) + 3000, color: '#1173d4' },
            { name: 'Meals', amount: Math.floor(Math.random() * 1500) + 2000, color: '#1db897' },
            { name: 'Office Supplies', amount: Math.floor(Math.random() * 1000) + 1000, color: '#ff9900' },
            { name: 'Training', amount: Math.floor(Math.random() * 1200) + 1500, color: '#d0021b' },
            { name: 'Other', amount: Math.floor(Math.random() * 800) + 800, color: '#6b7280' }
          ]
        },
        'Last Month': {
          categories: [
            { name: 'Travel', amount: Math.floor(Math.random() * 2000) + 4000, color: '#1173d4' },
            { name: 'Meals', amount: Math.floor(Math.random() * 1500) + 1500, color: '#1db897' },
            { name: 'Office Supplies', amount: Math.floor(Math.random() * 1000) + 2000, color: '#ff9900' },
            { name: 'Training', amount: Math.floor(Math.random() * 1200) + 1200, color: '#d0021b' },
            { name: 'Other', amount: Math.floor(Math.random() * 800) + 1500, color: '#6b7280' }
          ]
        },
        'This Year': {
          categories: [
            { name: 'Travel', amount: Math.floor(Math.random() * 20000) + 35000, color: '#1173d4' },
            { name: 'Meals', amount: Math.floor(Math.random() * 15000) + 15000, color: '#1db897' },
            { name: 'Office Supplies', amount: Math.floor(Math.random() * 10000) + 12000, color: '#ff9900' },
            { name: 'Training', amount: Math.floor(Math.random() * 12000) + 10000, color: '#d0021b' },
            { name: 'Other', amount: Math.floor(Math.random() * 8000) + 8000, color: '#6b7280' }
          ]
        }
      };

      const data = baseData[period];
      const total = data.categories.reduce((sum, cat) => sum + cat.amount, 0);
      
      // Calculate percentages
      data.categories = data.categories.map(cat => ({
        ...cat,
        percentage: Math.round((cat.amount / total) * 100)
      }));
      
      data.total = total;
      
      setExpenseData(prev => ({ ...prev, [period]: data }));
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };

  const monthlyTrends = {
    'This Month': [1200, 1500, 1800, 2100, 1900, 2200, 2000],
    'Last Month': [1100, 1400, 1700, 2000, 1800, 2100, 1900],
    'This Year': [8000, 9500, 11000, 12000, 10500, 13000, 11500]
  };

  const drawPieChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const data = expenseData[selectedPeriod];
    if (!data || !data.categories) return;
    
    let currentAngle = -Math.PI / 2;
    
    data.categories.forEach((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });
  };

  // Load data on component mount and when period changes
  useEffect(() => {
    fetchExpenseData(selectedPeriod);
  }, [selectedPeriod]);

  // Redraw chart when data changes
  useEffect(() => {
    if (expenseData[selectedPeriod]) {
      drawPieChart();
    }
  }, [expenseData, selectedPeriod]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExpenseData(selectedPeriod);
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const handleDownloadReport = () => {
    const data = expenseData[selectedPeriod];
    if (!data) {
      alert('No data available for download');
      return;
    }

    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${selectedPeriod} Financial Report`, 20, 30);
    
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
    doc.text(`Total Expenses: $${data.total.toLocaleString()}`, 20, 75);
    doc.text(`Top Category: ${data.categories[0]?.name || 'N/A'}`, 20, 85);
    doc.text(`Categories Count: ${data.categories.length}`, 20, 95);
    doc.text(`Average per Category: $${Math.round(data.total / data.categories.length).toLocaleString()}`, 20, 105);
    
    // Prepare table data
    const tableData = data.categories.map(category => [
      category.name,
      `$${category.amount.toLocaleString()}`,
      `${category.percentage}%`
    ]);
    
    // Add table
    doc.autoTable({
      head: [['Category', 'Amount', 'Percentage']],
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
    doc.save(`${selectedPeriod.toLowerCase().replace(' ', '-')}-financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    alert('✅ PDF report downloaded successfully!');
  };

  const handleDownloadExcel = () => {
    const data = expenseData[selectedPeriod];
    if (!data) {
      alert('No data available for download');
      return;
    }

    // Create CSV content
    let csvContent = `Category,Amount,Percentage\n`;
    data.categories.forEach(category => {
      csvContent += `${category.name},$${category.amount.toLocaleString()},${category.percentage}%\n`;
    });
    
    // Add summary statistics to CSV
    csvContent += '\n\nSummary Statistics\n';
    csvContent += `Total Expenses,$${data.total.toLocaleString()}\n`;
    csvContent += `Top Category,${data.categories[0]?.name || 'N/A'}\n`;
    csvContent += `Categories Count,${data.categories.length}\n`;
    csvContent += `Average per Category,$${Math.round(data.total / data.categories.length).toLocaleString()}\n`;
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPeriod.toLowerCase().replace(' ', '-')}-financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('✅ Excel/CSV report downloaded successfully!');
  };

  return (
    <div>
      <h1>Financial Reports</h1>
      <p style={{ color: "#617589", fontSize: "14px" }}>
        Generate and analyze financial reports with interactive charts and data visualization.
      </p>

      {/* Report Controls */}
      <div className="profile-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Report Period</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={handleDownloadReport}>
                  Download PDF
                </button>
                <button className="btn btn-success" onClick={handleDownloadExcel}>
                  Download Excel
                </button>
              </div>
            </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {['This Month', 'Last Month', 'This Year'].map((period) => (
            <button
              key={period}
              className={`pill ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Pie Chart */}
        <div className="card" style={{ flex: 1 }}>
          <h3>Expense Breakdown</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <canvas
              ref={canvasRef}
              width={250}
              height={250}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div style={{ marginTop: '15px' }}>
            {expenseData[selectedPeriod] && expenseData[selectedPeriod].categories ? (
              expenseData[selectedPeriod].categories.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    {item.name}: ${item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                Loading chart data...
              </div>
            )}
          </div>
        </div>

        {/* Line Chart Placeholder */}
        <div className="card" style={{ flex: 1 }}>
          <h3>Monthly Trends</h3>
          <div style={{ height: '300px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '10px' }}>📈</div>
              <div style={{ color: '#6b7280', fontSize: '16px' }}>Monthly Expense Trends</div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>
                Total: ${expenseData[selectedPeriod] ? expenseData[selectedPeriod].total.toLocaleString() : 'Loading...'}
              </div>
            </div>
            
            {/* Simple bar representation */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', alignItems: 'end', gap: '4px', height: '60px' }}>
              {monthlyTrends[selectedPeriod].map((value, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${(value / Math.max(...monthlyTrends[selectedPeriod])) * 100}%`,
                    backgroundColor: '#1173d4',
                    borderRadius: '2px 2px 0 0',
                    minHeight: '4px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="value" style={{ color: '#1173d4' }}>
            ${expenseData[selectedPeriod] ? expenseData[selectedPeriod].total.toLocaleString() : 'Loading...'}
          </p>
          <p>for {selectedPeriod.toLowerCase()}</p>
        </div>
        <div className="card">
          <h3>Top Category</h3>
          <p className="value" style={{ color: '#1db897' }}>
            {expenseData[selectedPeriod] && expenseData[selectedPeriod].categories ? expenseData[selectedPeriod].categories[0].name : 'Loading...'}
          </p>
          <p>${expenseData[selectedPeriod] && expenseData[selectedPeriod].categories ? expenseData[selectedPeriod].categories[0].amount.toLocaleString() : '0'}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p className="value">{expenseData[selectedPeriod] && expenseData[selectedPeriod].categories ? expenseData[selectedPeriod].categories.length : 0}</p>
          <p>expense categories</p>
        </div>
        <div className="card">
          <h3>Average</h3>
          <p className="value" style={{ color: '#ff9900' }}>
            ${expenseData[selectedPeriod] && expenseData[selectedPeriod].categories ? Math.round(expenseData[selectedPeriod].total / expenseData[selectedPeriod].categories.length).toLocaleString() : '0'}
          </p>
          <p>per category</p>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="profile-section">
        <h2>Chart Types</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`pill ${selectedChart === 'expenseBreakdown' ? 'active' : ''}`}
            onClick={() => setSelectedChart('expenseBreakdown')}
          >
            Expense Breakdown
          </button>
          <button
            className={`pill ${selectedChart === 'monthlyTrends' ? 'active' : ''}`}
            onClick={() => setSelectedChart('monthlyTrends')}
          >
            Monthly Trends
          </button>
          <button
            className={`pill ${selectedChart === 'departmentComparison' ? 'active' : ''}`}
            onClick={() => setSelectedChart('departmentComparison')}
          >
            Department Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
