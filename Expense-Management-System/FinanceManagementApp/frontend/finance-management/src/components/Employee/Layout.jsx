import React from "react";
import Sidebar from "../Employee/";
import "../App.css";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
