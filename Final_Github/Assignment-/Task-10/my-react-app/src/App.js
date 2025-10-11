import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import Welcome from "./welcome";
import LoginFormWithImage from "./loginForm";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <main style={{ minHeight: "70vh", padding: "20px", textAlign: "center" }}>
        <h1>Welcome to My Website</h1>
        <p>
          This webpage demonstrates a basic React layout with a navigation bar, login/logout buttons, a login form, and a footer section.
        </p>
        {!isLoggedIn ? (
          <LoginFormWithImage onLogin={handleLogin} />
        ) : (
          <Welcome />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
