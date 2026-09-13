import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";
import ReportCard from "./pages/ReportCard";
import Fees from "./pages/Fees";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Classes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Timetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Subjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Grades />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-card"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <ReportCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees"
        element={
          <ProtectedRoute allowedRoles={["admin", "parent", "student"]}>
            <Fees />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
