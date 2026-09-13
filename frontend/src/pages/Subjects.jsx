import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [error, setError] = useState("");

  async function load() {
    const res = await client.get("/subjects");
    setSubjects(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/subjects", form);
      setForm({ name: "", code: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create subject");
    }
  }

  async function handleDelete(id) {
    await client.delete(`/subjects/${id}`);
    load();
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Subjects</h1>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow-sm mb-6 flex gap-3">
          <input
            placeholder="Subject name (e.g. Mathematics)"
            className="border rounded px-3 py-2 flex-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Code (e.g. MATH)"
            className="border rounded px-3 py-2 w-32"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <button className="bg-teal text-white rounded px-4 py-2 hover:opacity-90">Add</button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded shadow-sm divide-y">
          {subjects.map((s) => (
            <div key={s.id} className="p-4 flex justify-between items-center">
              <span>{s.name} {s.code && <span className="text-slate-400 text-sm">({s.code})</span>}</span>
              <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
          {subjects.length === 0 && <p className="p-4 text-slate-500">No subjects yet.</p>}
        </div>
      </div>
    </div>
  );
}
