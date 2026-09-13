import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

const STATUS_OPTIONS = ["present", "absent", "late", "excused"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    client.get("/classes").then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    if (!classSectionId) {
      setStudents([]);
      return;
    }
    client.get(`/students?classSectionId=${classSectionId}`).then((res) => {
      setStudents(res.data);
    });
  }, [classSectionId]);

  useEffect(() => {
    if (!classSectionId || !date) return;
    client
      .get(`/attendance?classSectionId=${classSectionId}&date=${date}`)
      .then((res) => {
        const map = {};
        res.data.forEach((r) => {
          map[r.studentId] = r.status;
        });
        setStatusMap(map);
      });
  }, [classSectionId, date]);

  function setStatus(studentId, status) {
    setStatusMap((m) => ({ ...m, [studentId]: status }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: statusMap[s.id] || "present",
      }));
      await client.post("/attendance", { classSectionId, date, records });
      setMessage("Attendance saved.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Attendance</h1>

        <div className="bg-white p-4 rounded shadow-sm mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              className="border rounded px-3 py-2 w-full sm:w-auto"
              value={classSectionId}
              onChange={(e) => setClassSectionId(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full sm:w-auto"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!classSectionId || students.length === 0 || saving}
            className="w-full sm:w-auto bg-teal text-white rounded px-4 py-2 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save attendance"}
          </button>
        </div>

        {message && <p className="text-sm text-slate-600 mb-4">{message}</p>}

        {classSectionId && students.length === 0 && (
          <p className="text-slate-500">No students in this class yet.</p>
        )}

        <div className="bg-white rounded shadow-sm divide-y">
          {students.map((s) => (
            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-medium">{s.fullName} <span className="text-slate-400 font-normal">#{s.admissionNumber}</span></span>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatus(s.id, opt)}
                    className={`text-xs px-3 py-1.5 rounded capitalize border ${
                      (statusMap[s.id] || "present") === opt
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}