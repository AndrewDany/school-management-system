import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.fullName, form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-navy mb-6">Create account</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          className="w-full border rounded px-3 py-2 mb-6"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="student">Student</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-teal font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
