import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ gradeLevel: "", section: "", academicYear: "" });
  const [error, setError] = useState("");

  async function load() {
    const res = await client.get("/classes");
    setClasses(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/classes", form);
      setForm({ gradeLevel: "", section: "", academicYear: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create class");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Classes</h1>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow-sm mb-6 grid grid-cols-4 gap-3">
          <input
            placeholder="Grade level (e.g. Grade 6)"
            className="border rounded px-3 py-2"
            value={form.gradeLevel}
            onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
            required
          />
          <input
            placeholder="Section (e.g. A)"
            className="border rounded px-3 py-2"
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            required
          />
          <input
            placeholder="Academic year (e.g. 2026/2027)"
            className="border rounded px-3 py-2"
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            required
          />
          <button className="bg-teal text-white rounded px-3 py-2 hover:opacity-90">Add class</button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded shadow-sm divide-y">
          {classes.map((c) => (
            <div key={c.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{c.gradeLevel} - {c.section}</p>
                <p className="text-sm text-slate-500">{c.academicYear} · {c.students?.length || 0} students</p>
              </div>
              <span className="text-sm text-slate-500">{c.classTeacher?.fullName || "No teacher assigned"}</span>
            </div>
          ))}
          {classes.length === 0 && <p className="p-4 text-slate-500">No classes yet.</p>}
        </div>
      </div>
    </div>
  );
}
