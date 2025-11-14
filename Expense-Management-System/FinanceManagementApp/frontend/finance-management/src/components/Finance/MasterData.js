import React, { useState } from 'react';

export default function MasterData(){
  const [activeTab, setActiveTab] = useState('Expense Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample data for different tabs
  const expenseCategories = [
    { id: 1, name: 'Travel', description: 'Expenses related to business travel', status: 'Active' },
    { id: 2, name: 'Laptop Repair', description: 'Repair and maintenance of company laptops', status: 'Active' },
    { id: 3, name: 'Certification', description: 'Professional certification fees', status: 'Active' },
    { id: 4, name: 'Office Supplies', description: 'General office supplies', status: 'Inactive' }
  ];

  const regions = [
    { id: 1, name: 'India', description: 'India region operations', status: 'Active' },
    { id: 2, name: 'UK', description: 'United Kingdom region operations', status: 'Active' },
    { id: 3, name: 'Region 3', description: 'Additional region for expansion', status: 'Active' },
    { id: 4, name: 'US', description: 'United States region operations', status: 'Inactive' }
  ];

  const currencies = [
    { id: 1, name: 'INR', description: 'Indian Rupee', symbol: '₹', status: 'Active' },
    { id: 2, name: 'USD', description: 'US Dollar', symbol: '$', status: 'Active' },
    { id: 3, name: 'EUR', description: 'Euro', symbol: '€', status: 'Active' },
    { id: 4, name: 'GBP', description: 'British Pound', symbol: '£', status: 'Inactive' }
  ];

  const getCurrentData = () => {
    switch(activeTab) {
      case 'Expense Categories': return expenseCategories;
      case 'Regions': return regions;
      case 'Currencies': return currencies;
      default: return expenseCategories;
    }
  };

  const getTableHeaders = () => {
    switch(activeTab) {
      case 'Expense Categories': return ['CATEGORY NAME', 'DESCRIPTION', 'STATUS', 'ACTIONS'];
      case 'Regions': return ['REGION NAME', 'DESCRIPTION', 'STATUS', 'ACTIONS'];
      case 'Currencies': return ['CURRENCY CODE', 'DESCRIPTION', 'SYMBOL', 'STATUS', 'ACTIONS'];
      default: return ['CATEGORY NAME', 'DESCRIPTION', 'STATUS', 'ACTIONS'];
    }
  };

  const handleAddNew = () => {
    alert(`Add new ${activeTab.slice(0, -1)} functionality will be implemented here!`);
  };

  const handleEdit = (id) => {
    alert(`Edit ${activeTab.slice(0, -1)} with ID ${id} functionality will be implemented here!`);
  };

  const filteredData = getCurrentData().filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{margin:0}}>Master Data Management</h1>
          <div style={{color:'#6b7280'}}>Manage expense categories, regions, and currencies.</div>
        </div>
        <div>
          <button className="btn btn-success" onClick={handleAddNew}>+ Add New</button>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <button 
          className={`tab ${activeTab === 'Expense Categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('Expense Categories')}
        >
          Expense Categories
        </button>
        <button 
          className={`tab ${activeTab === 'Regions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Regions')}
        >
          Regions
        </button>
        <button 
          className={`tab ${activeTab === 'Currencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('Currencies')}
        >
          Currencies
        </button>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:12}}>
        <input 
          placeholder={`Search for ${activeTab.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{flex:1, padding:10, borderRadius:8, border:'1px solid #e6eef2'}} 
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{padding:10, borderRadius:8}}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              {getTableHeaders().map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                {activeTab === 'Currencies' && <td>{item.symbol}</td>}
                <td style={{color: item.status === 'Active' ? '#10b981' : '#ef4444'}}>
                  {item.status}
                </td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleEdit(item.id)}
                    style={{padding: '4px 8px', fontSize: '12px'}}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
