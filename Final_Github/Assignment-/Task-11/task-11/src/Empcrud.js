import React, { useState } from "react";

function EmployeeCRUD() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Krish Patel", role: "Developer" },
    { id: 2, name: "Aryan ", role: "Designer" },
  ]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editId ? { ...emp, name, role } : emp
        )
      );
      setEditId(null);
    } else {
      const newEmployee = {
        id: employees.length + 1,
        name,
        role,
      };
      setEmployees([...employees, newEmployee]);
    }
    setName("");
    setRole("");
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setName(emp.name);
    setRole(emp.role);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee CRUD Operations</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </form>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeCRUD;
