import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import PostJob from "../pages/PostJob";
import Jobs from "../pages/Jobs";
import AdminLogin from "../pages/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound"; 
import JobDetail from "../pages/JobDetail";
import EditJob from "../pages/EditJob";
import PostedJobs from "../pages/PostedJobs"
import UserWalletPage from "../pages/UserWalletPage";
import AdminWithdrawals from "../pages/AdminWithdrawals";


export const router = createBrowserRouter([
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
      { path: "post-job", element: <PostJob /> },
      { path: "jobs", element: <Jobs /> },
      { path: "*", element: <NotFound /> }, 
       { path: "adminjob/jobdetail/:id", element: <JobDetail /> },
      { path: "adminjob/edit/:id", element: <EditJob /> },
      { path: "user-wallet/:userId", element: <UserWalletPage /> },
      { path: "withdrawals", element: <AdminWithdrawals /> },
      { path: "/posted-jobs/:userId", element:<PostedJobs /> } 


    ],
  },
  {
    path: "*", 
    element: <NotFound />,
  },
]);
