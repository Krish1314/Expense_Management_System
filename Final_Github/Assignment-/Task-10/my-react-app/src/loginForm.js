import React, { useState } from "react";

function LoginFormWithImage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add validation here
    if (username && password) {
      onLogin(); // successful login
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="login-form card shadow-lg p-4">
      <h3 className="text-center mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 rounded-pill">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginFormWithImage;
