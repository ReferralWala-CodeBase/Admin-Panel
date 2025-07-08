import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const activeClass = "bg-blue-600 text-white rounded-md px-3 py-2 block";
  const normalClass = "text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2 block";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userId");
    navigate("/admin-login");
  };

  return (
    <aside className="h-full w-full bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Users
          </NavLink>

          <NavLink to="/jobs" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Jobs
          </NavLink>
            <NavLink to="/withdrawals" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Withdrawal Requests
          </NavLink>
          <NavLink to="/applicantstatus" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Applicant Status
          </NavLink>
          <NavLink to="/contact"  className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Contact us Msgs
          </NavLink>
          <NavLink to="/send-email" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Send Email
          </NavLink>
          <NavLink to="/send-notifications"  className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Send Notifications
          </NavLink>
           <NavLink to="/settings" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
            Settings
          </NavLink>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white rounded-md px-3 py-2 mt-4"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
