import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEmployee } from "./EmployeeSlice";

function EmployeeList() {
  const employees = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Employee List</h2>
      {employees.map((emp) => (
        <div key={emp.id}>
          {emp.name} - {emp.role}
          <button onClick={() => dispatch(deleteEmployee(emp.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default EmployeeList;
