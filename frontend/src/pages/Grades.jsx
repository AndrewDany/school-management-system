import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function Grades() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [term, setTerm] = useState("Term 1");
  const [students, setStudents] = useState([]);
  const [scoreMap, setScoreMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    client.get("/classes").then((res) => setClasses(res.data));
    client.get("/subjects").then((res) => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (!classSectionId) {
      setStudents([]);
      return;
    }
    client.get(`/students?classSectionId=${classSectionId}`).then((res) => setStudents(res.data));
  }, [classSectionId]);

  useEffect(() => {
    if (!classSectionId || !subjectId || !academicYear || !term) return;
    client
      .get(`/grades?classSectionId=${classSectionId}&subjectId=${subjectId}&academicYear=${academicYear}&term=${term}`)
      .then((res) => {
        const map = {};
        res.data.forEach((g) => {
          map[g.studentId] = g.score;
        });
        setScoreMap(map);
      });
  }, [classSectionId, subjectId, academicYear, term]);

  function setScore(studentId, value) {
    setScoreMap((m) => ({ ...m, [studentId]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const records = students
        .filter((s) => scoreMap[s.id] !== undefined && scoreMap[s.id] !== "")
        .map((s) => ({ studentId: s.id, score: Number(scoreMap[s.id]) }));
      await client.post("/grades", { classSectionId, subjectId, academicYear, term, records });
      setMessage("Grades saved.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save grades");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Grades</h1>

        <div className="bg-white p-4 rounded shadow-sm mb-6 grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select className="border rounded px-3 py-2 w-full" value={classSectionId} onChange={(e) => setClassSectionId(e.target.value)}>
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select className="border rounded px-3 py-2 w-full" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Academic year</label>
            <input className="border rounded px-3 py-2 w-full" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Term</label>
            <input className="border rounded px-3 py-2 w-full" value={term} onChange={(e) => setTerm(e.target.value)} />
          </div>
        </div>

        {classSectionId && subjectId && (
          <>
            <button
              onClick={handleSave}
              disabled={students.length === 0 || saving}
              className="bg-teal text-white rounded px-4 py-2 hover:opacity-90 disabled:opacity-50 mb-4"
            >
              {saving ? "Saving..." : "Save grades"}
            </button>
            {message && <p className="text-sm text-slate-600 mb-4">{message}</p>}

            <div className="bg-white rounded shadow-sm divide-y">
              {students.map((s) => (
                <div key={s.id} className="p-4 flex justify-between items-center">
                  <span className="font-medium">{s.fullName} <span className="text-slate-400 font-normal">#{s.admissionNumber}</span></span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score"
                    className="border rounded px-3 py-1.5 w-24 text-right"
                    value={scoreMap[s.id] ?? ""}
                    onChange={(e) => setScore(s.id, e.target.value)}
                  />
                </div>
              ))}
              {students.length === 0 && <p className="p-4 text-slate-500">No students in this class.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
