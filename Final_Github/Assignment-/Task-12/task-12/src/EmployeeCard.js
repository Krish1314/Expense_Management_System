import React from "react";
import { Card, Button } from "react-bootstrap";

function EmployeeCard({ employee }) {
  return (
    <Card style={{ width: "18rem", margin: "10px" }}>
      <Card.Img variant="top" src={employee.image} alt={employee.name} />
      <Card.Body>
        <Card.Title>{employee.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{employee.position}</Card.Subtitle>
        <Card.Text>Email: {employee.email}</Card.Text>
        <Button variant="primary">View Profile</Button>
      </Card.Body>
    </Card>
  );
}

export default EmployeeCard;
