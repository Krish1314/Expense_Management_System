import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2025 My Website. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#f1f1f1",
    marginTop: "20px"
  }
};

export default Footer;
