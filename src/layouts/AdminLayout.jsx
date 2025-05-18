import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => (
  <div className="flex bg-gray-100">
    {/* Fixed Sidebar */}
    <div className="fixed top-0 left-0 h-screen w-64 z-10">
      <Sidebar />
    </div>

    {/* Content shifts right to accommodate fixed sidebar */}
    <div className="ml-64 flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="p-6 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
