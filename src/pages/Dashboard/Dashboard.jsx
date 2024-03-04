// AdminDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import CategoryComponent from '../../components/CategoryComponent/CategoryComponent';
import UsersComponent from '../../components/UsersComponent/UsersComponent';
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminDashboard;
