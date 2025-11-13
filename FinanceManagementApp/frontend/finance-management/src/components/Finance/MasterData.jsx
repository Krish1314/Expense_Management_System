import React, { useState, useEffect } from "react";
import "../../App.css";

export default function MasterData() {
  const [activeTab, setActiveTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const endpoint = activeTab === "departments" ? "departments" : "categories";
      const response = await fetch(`${base}/api/finance/master/${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        if (activeTab === "departments") {
          setDepartments(data);
        } else {
          setCategories(data);
        }
      } else {
        // Use mock data for development
        if (activeTab === "departments") {
          setDepartments([
            { id: 1, name: "Engineering", employeeCount: 50, budget: 500000 },
            { id: 2, name: "Marketing", employeeCount: 30, budget: 300000 },
            { id: 3, name: "Sales", employeeCount: 25, budget: 250000 }
          ]);
        } else {
          setCategories([
            { id: 1, name: "Travel", monthlyLimit: 50000 },
            { id: 2, name: "Meals", monthlyLimit: 10000 },
            { id: 3, name: "Office Supplies", monthlyLimit: 25000 }
          ]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const { API_BASE } = await import("../../config");
      const base = API_BASE;
      const endpoint = activeTab === "departments" ? "departments" : "categories";
      const response = await fetch(`${base}/api/finance/master/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem })
      });

      if (response.ok) {
        setNewItem("");
        fetchData();
      }
    } catch (error) {
      console.error(`Error creating ${activeTab.slice(0, -1)}:`, error);
    }
  };

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: "10px 20px",
        border: "none",
        background: activeTab === tab ? "#17b897" : "transparent",
        color: activeTab === tab ? "#fff" : "#333",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.3s ease"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Master Data</h1>
        <p style={{ color: "#617589", fontSize: "14px", margin: 0 }}>
          Manage departments and expense categories
        </p>
      </div>

      <div style={{ 
        background: "#f8f9fa",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "20px",
        display: "flex",
        gap: "12px"
      }}>
        <TabButton tab="departments" label="Departments" />
        <TabButton tab="categories" label="Expense Categories" />
      </div>

      <div style={{ 
        background: "#fff", 
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <form onSubmit={handleSubmit} style={{ 
          display: "flex",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add new ${activeTab === "departments" ? "department" : "category"}`}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px"
            }}
          />
          <button
            type="submit"
            style={{
              background: "#17b897",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Add
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  {activeTab === "departments" ? (
                    <>
                      <th>Employee Count</th>
                      <th>Budget</th>
                    </>
                  ) : (
                    <th>Monthly Limit</th>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "departments" ? (
                  departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.employeeCount}</td>
                      <td>₹ {dept.budget.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => {/* Implement edit logic */}}
                          style={{
                            background: "transparent",
                            border: "1px solid #17b897",
                            color: "#17b897",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            marginRight: "8px"
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>₹ {category.monthlyLimit.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => {/* Implement edit logic */}}
                          style={{
                            background: "transparent",
                            border: "1px solid #17b897",
                            color: "#17b897",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            marginRight: "8px"
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}