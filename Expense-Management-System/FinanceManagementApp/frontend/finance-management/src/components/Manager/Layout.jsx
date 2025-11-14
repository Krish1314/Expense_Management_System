import React from "react";
import Sidebar from "./sidebar";
import "../../App.css";
import { Outlet } from "react-router-dom";

export default function ManagerLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main">
        <Outlet /> {/* This will render the page for the current selected menu */}
      </div>
    </div>
  );
}
