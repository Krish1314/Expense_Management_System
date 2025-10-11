import React from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";

function App() {
  return (
    <div>
      <h1>Redux CRUD Assignment</h1>
      <EmployeeForm />
      <EmployeeList />
    </div>
  );
}

export default App;
