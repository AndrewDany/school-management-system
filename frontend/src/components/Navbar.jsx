import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/students", label: "Students" },
  { to: "/classes", label: "Classes" },
  { to: "/attendance", label: "Attendance" },
  { to: "/timetable", label: "Timetable" },
  { to: "/subjects", label: "Subjects" },
  { to: "/grades", label: "Grades" },
  { to: "/report-card", label: "Report Card" },
  { to: "/fees", label: "Fees" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-navy text-white px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-bold text-base sm:text-lg" onClick={() => setMenuOpen(false)}>
          School Management System
        </Link>

        {user && (
          <>
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-teal-300">{l.label}</Link>
              ))}
              <span className="opacity-75">{user.fullName} ({user.role})</span>
              <button onClick={handleLogout} className="bg-teal px-3 py-1.5 rounded hover:opacity-90">
                Logout
              </button>
            </div>

            {/* Mobile hamburger button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {user && menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-sm pb-2">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-teal-300" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <span className="opacity-75 pt-2 border-t border-white/20">{user.fullName} ({user.role})</span>
          <button
            onClick={handleLogout}
            className="bg-teal px-3 py-1.5 rounded hover:opacity-90 text-left w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
