import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from "../assests/login.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      alert("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password: "***" });
      const response = await fetch(`${API_BASE}/api/account/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Prefer JSON, but also handle problem+json or plain text gracefully
      const contentType = response.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json") || contentType.includes("application/problem+json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response (status " + response.status + "):", text);
        if (!response.ok) {
          alert(`Server error ${response.status}: ${text?.slice(0, 300) || 'Unknown error'}`);
          return;
        }
        // If 200 but not JSON, bail out
        alert("Unexpected response from server.");
        return;
      }
      // 'data' is set above
      console.log("Response data:", data);

      if (!response.ok) {
        console.error("Login failed:", data);
        alert(data.message || data.error || "Login failed. Please check your credentials.");
        return;
      }

      // Store user data in localStorage for session management
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token || 'dummy-token');

      console.log("Login successful, redirecting based on role:", data.role);

      // Role-based redirect
      switch ((data.role || "").toLowerCase()) {
        case "employee":
          navigate("/employee/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "finance":
          navigate("/finance/dashboard");
          break;
        default:
          console.warn("Unknown role:", data.role);
          alert("Unknown user role. Please contact administrator.");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert(`Cannot connect to server. Please check if the backend is running on ${API_BASE}`);
      } else {
        alert("Login error: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <svg
              className="login-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 6.293a1 1 0 00-1.414 1.414L8.586 9H6a1 1 0 100 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3z"
              ></path>
            </svg>
            <span>FinanceFlow</span>
          </div>
          <h2>Streamline Your Finances</h2>
          <p>
            Efficiently manage expenses, reports, and budgets in one secure
            platform.
          </p>
          <img src={login} alt="Finance illustration" />
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="login-box">
          <h1>Welcome To FinanceFlow</h1>
          <p>Login to your account</p>

          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="text"
              placeholder="Enter your username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            <div className="forgot-password-container">
              <a href="#" className="forgot-password-link">Forgot Password?</a>
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="note">
            New user registration is by Admin invitation only.
          </p>
        </div>
      </div>
    </div>
  );
}
