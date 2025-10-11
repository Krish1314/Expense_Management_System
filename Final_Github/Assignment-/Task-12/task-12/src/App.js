import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import img1 from "./Image/Image_1.webp";
import img2 from "./Image/Image_2.jpg";


function App() {
  const employees = [
    {
      id: 1,
      name: "Krish Patel",
      position: "Frontend Developer",
      email: "krish@example.com",
      image: img1
    },
    {
      id: 2,
      name: "Alex Johnson",
      position: "Backend Developer",
      email: "alex@example.com",
      image: img2
    }
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Employee Details</h2>
      <div className="row">
        {employees.map((emp) => (
          <div className="col-md-4" key={emp.id}>
            <div className="card mb-4">
              <img src={emp.image} className="card-img-top" alt={emp.name} />
              <div className="card-body">
                <h5 className="card-title">{emp.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{emp.position}</h6>
                <p className="card-text">{emp.email}</p>
                <a href="#" className="btn btn-primary">
                  View Profile
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
