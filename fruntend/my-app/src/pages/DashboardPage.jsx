import React, { useContext } from "react";
import { StayContext } from "../context/StayContext";
import AdminDashboard from "../components/admin/AdminDashboard";
import OwnerDashboard from "../components/owner/OwnerDashboard";
import UserPage from "./UserPage";

export default function DashboardPage() {
  const { user } = useContext(StayContext);

  if (!user) return <p>Please login to view the dashboard</p>;

  switch (user.role) {
    case "owner":
      return <OwnerDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "user":
      return <UserPage />;
    default:
      return <p>Invalid role</p>;
  }
}
