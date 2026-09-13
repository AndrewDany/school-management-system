import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
];

export default function Timetable() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "08:45",
    subjectId: "",
    teacherId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/classes").then((res) => setClasses(res.data));
    client.get("/subjects").then((res) => setSubjects(res.data));
    // Teachers are ClassSection.classTeacher owners; simplest source for now
    // is the set of teachers already assigned to a class. For a full picker,
    // add a dedicated GET /api/users?role=teacher endpoint later.
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      const uniqueTeachers = [];
      const seen = new Set();
      classes.forEach((c) => {
        if (c.classTeacher && !seen.has(c.classTeacher.id)) {
          seen.add(c.classTeacher.id);
          uniqueTeachers.push(c.classTeacher);
        }
      });
      setTeachers(uniqueTeachers);
    }
  }, [classes]);

  async function loadEntries() {
    if (!classSectionId) return;
    const res = await client.get(`/timetable?classSectionId=${classSectionId}`);
    setEntries(res.data);
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classSectionId]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, teacherId: form.teacherId || null, classSectionId };
      await client.post("/timetable", payload);
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add timetable entry");
    }
  }

  async function handleDelete(id) {
    await client.delete(`/timetable/${id}`);
    loadEntries();
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Timetable</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            className="border rounded px-3 py-2"
            value={classSectionId}
            onChange={(e) => setClassSectionId(e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
            ))}
          </select>
        </div>

        {classSectionId && (
          <>
            <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow-sm mb-6 grid grid-cols-5 gap-3">
              <select
                className="border rounded px-3 py-2"
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
              <input
                type="time"
                className="border rounded px-3 py-2"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
              <select
                className="border rounded px-3 py-2"
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                required
              >
                <option value="">Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2"
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              >
                <option value="">Teacher (optional)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
              <button className="col-span-5 bg-teal text-white rounded px-3 py-2 hover:opacity-90">
                Add period
              </button>
            </form>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <div className="grid grid-cols-5 gap-3">
              {DAYS.map((d) => (
                <div key={d.value} className="bg-white rounded shadow-sm">
                  <div className="bg-navy text-white text-sm font-medium px-3 py-2 rounded-t">{d.label}</div>
                  <div className="divide-y">
                    {entries
                      .filter((e) => e.dayOfWeek === d.value)
                      .map((e) => (
                        <div key={e.id} className="p-2 text-sm relative group">
                          <p className="font-medium">{e.subject?.name}</p>
                          <p className="text-slate-500">{e.startTime.slice(0, 5)}–{e.endTime.slice(0, 5)}</p>
                          {e.teacher && <p className="text-slate-400 text-xs">{e.teacher.fullName}</p>}
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="absolute top-1 right-1 text-xs text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    {entries.filter((e) => e.dayOfWeek === d.value).length === 0 && (
                      <p className="p-2 text-xs text-slate-400">No periods</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
