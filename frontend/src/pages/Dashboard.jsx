import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-navy">Welcome, {user?.fullName}</h1>
        <p className="text-slate-600 mt-2">
          You're signed in as <span className="font-medium">{user?.role}</span>. Use the
          navigation above to manage students and classes.
        </p>
      </div>
    </div>
  );
}
