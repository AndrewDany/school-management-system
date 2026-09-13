import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function ReportCard() {
  const [classes, setClasses] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [term, setTerm] = useState("Term 1");
  const [report, setReport] = useState(null);

  useEffect(() => {
    client.get("/classes").then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    if (!classSectionId) {
      setStudents([]);
      return;
    }
    client.get(`/students?classSectionId=${classSectionId}`).then((res) => setStudents(res.data));
  }, [classSectionId]);

  async function handleLoad() {
    if (!studentId || !academicYear || !term) return;
    const res = await client.get(`/grades/report-card/${studentId}?academicYear=${academicYear}&term=${term}`);
    setReport(res.data);
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Report Card</h1>

        <div className="bg-white p-4 rounded shadow-sm mb-6 grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select className="border rounded px-3 py-2 w-full" value={classSectionId} onChange={(e) => { setClassSectionId(e.target.value); setStudentId(""); }}>
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select className="border rounded px-3 py-2 w-full" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
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
          <button onClick={handleLoad} disabled={!studentId} className="col-span-4 bg-teal text-white rounded px-4 py-2 hover:opacity-90 disabled:opacity-50">
            Load report card
          </button>
        </div>

        {report && (
          <div className="bg-white rounded shadow-sm p-6">
            <h2 className="text-xl font-bold text-navy">{report.student?.fullName}</h2>
            <p className="text-slate-500 mb-4">#{report.student?.admissionNumber} · {report.term} · {report.academicYear}</p>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Subject</th>
                  <th className="py-2 text-right">Score</th>
                  <th className="py-2 pl-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {report.grades.map((g) => (
                  <tr key={g.id}>
                    <td className="py-2">{g.subject?.name}</td>
                    <td className="py-2 text-right">{g.score}</td>
                    <td className="py-2 pl-4 text-slate-500">{g.remarks || "-"}</td>
                  </tr>
                ))}
                {report.grades.length === 0 && (
                  <tr><td colSpan="3" className="py-4 text-slate-500">No grades recorded for this term yet.</td></tr>
                )}
              </tbody>
            </table>

            {report.average !== null && (
              <p className="mt-4 font-semibold text-navy">
                Average: {report.average.toFixed(1)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
