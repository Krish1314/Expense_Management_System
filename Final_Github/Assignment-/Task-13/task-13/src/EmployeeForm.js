import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEmployee } from "./EmployeeSlice";

function EmployeeForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEmployee({ id: Date.now(), name, role }));
    setName("");
    setRole("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Employee name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default EmployeeForm;
