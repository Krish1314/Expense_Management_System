import React from "react";

function Navbar({ isLoggedIn, onLogin, onLogout }) {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>MySite</h2>
      <div>
        {isLoggedIn ? (
          <button style={styles.button} onClick={onLogout}>Logout</button>
        ) : (
          <button style={styles.button} onClick={onLogin}>Login</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white"
  },
  logo: {
    margin: 0
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#61dafb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Navbar;
