import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function ExpenseTable({ expenses }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comments, setComments] = useState("");

  const handleRequestInfo = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setComments("");
  };

  const handleSubmit = () => {
    console.log("Requested more info for:", selectedExpense.title);
    console.log("Manager comments:", comments);
    alert(`Request sent for "${selectedExpense.title}" with comments: ${comments}`);
    handleClose();
  };

  return (
    <div className="table-responsive mt-3">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Expense Title</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, idx) => (
            <tr key={idx}>
              <td>{e.employee}</td>
              <td>{e.title}</td>
              <td>{e.date}</td>
              <td>₹ {e.amount}</td>
              <td>
                <span
                  className={`badge bg-${
                    e.status === "Approved"
                      ? "success"
                      : e.status === "Pending"
                      ? "warning"
                      : "danger"
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td>
                <Button variant="success" size="sm" className="me-2">
                  Approve
                </Button>
                <Button variant="danger" size="sm" className="me-2">
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRequestInfo(e)}
                >
                  Request Info
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end">
        <Button variant="outline-primary" className="mt-3">
          Export to Excel
        </Button>
      </div>

      {/* Modal for Request Info */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request More Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Expense:</strong>{" "}
            {selectedExpense ? selectedExpense.title : ""}
          </p>
          <Form.Group controlId="managerComments">
            <Form.Label>Enter your comments:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="E.g. Please attach the original invoice..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExpenseTable;