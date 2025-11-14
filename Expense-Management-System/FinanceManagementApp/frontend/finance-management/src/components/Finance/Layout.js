import React from 'react';
import FinanceSidebar from './sidebar';
import '../../App.css';
import { Outlet } from 'react-router-dom';

export default function FinanceLayout() {
  return (
    <div className="app-container">
      <FinanceSidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
