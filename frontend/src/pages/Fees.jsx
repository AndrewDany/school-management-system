import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function Fees() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [classes, setClasses] = useState([]);
  const [structures, setStructures] = useState([]);
  const [structureForm, setStructureForm] = useState({
    classSectionId: "",
    academicYear: "2026/2027",
    term: "Term 1",
    amount: "",
    description: "",
  });

  const [students, setStudents] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [term, setTerm] = useState("Term 1");
  const [balance, setBalance] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "cash", reference: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/classes").then((res) => setClasses(res.data));
    loadStructures();
  }, []);

  async function loadStructures() {
    const res = await client.get("/fees/structures");
    setStructures(res.data);
  }

  async function handleCreateStructure(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/fees/structures", structureForm);
      setStructureForm({ ...structureForm, amount: "", description: "" });
      loadStructures();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save fee structure");
    }
  }

  useEffect(() => {
    if (!classSectionId) {
      setStudents([]);
      return;
    }
    client.get(`/students?classSectionId=${classSectionId}`).then((res) => setStudents(res.data));
  }, [classSectionId]);

  async function loadBalance() {
    if (!studentId || !academicYear || !term) return;
    const res = await client.get(`/fees/balance/${studentId}?academicYear=${academicYear}&term=${term}`);
    setBalance(res.data);
  }

  async function handleRecordPayment(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/fees/payments", {
        studentId,
        academicYear,
        term,
        amount: paymentForm.amount,
        method: paymentForm.method,
        reference: paymentForm.reference,
      });
      setPaymentForm({ amount: "", method: "cash", reference: "" });
      loadBalance();
    } catch (err) {
      setError(err.response?.data?.message || "Could not record payment");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold text-navy">Fees & Billing</h1>

        {isAdmin && (
          <section>
            <h2 className="text-lg font-semibold text-navy mb-3">Fee structure (per class/term)</h2>
            <form onSubmit={handleCreateStructure} className="bg-white p-4 rounded shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <select
                className="border rounded px-3 py-2"
                value={structureForm.classSectionId}
                onChange={(e) => setStructureForm({ ...structureForm, classSectionId: e.target.value })}
                required
              >
                <option value="">Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
                ))}
              </select>
              <input
                className="border rounded px-3 py-2"
                placeholder="Academic year"
                value={structureForm.academicYear}
                onChange={(e) => setStructureForm({ ...structureForm, academicYear: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Term"
                value={structureForm.term}
                onChange={(e) => setStructureForm({ ...structureForm, term: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                className="border rounded px-3 py-2"
                placeholder="Amount (GH₵)"
                value={structureForm.amount}
                onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })}
                required
              />
              <button className="bg-teal text-white rounded px-3 py-2 hover:opacity-90">Save</button>
              <input
                className="border rounded px-3 py-2 col-span-1 sm:col-span-2 md:col-span-5"
                placeholder="Description (optional, e.g. Tuition + feeding)"
                value={structureForm.description}
                onChange={(e) => setStructureForm({ ...structureForm, description: e.target.value })}
              />
            </form>

            <div className="bg-white rounded shadow-sm divide-y mt-3">
              {structures.map((s) => (
                <div key={s.id} className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                  <span>{s.classSection?.gradeLevel} - {s.classSection?.section} · {s.term} {s.academicYear}</span>
                  <span className="font-medium">GH₵ {parseFloat(s.amount).toFixed(2)}</span>
                </div>
              ))}
              {structures.length === 0 && <p className="p-3 text-slate-500 text-sm">No fee structures set yet.</p>}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-navy mb-3">Student balance & payments</h2>
          <div className="bg-white p-4 rounded shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end mb-3">
            <select className="border rounded px-3 py-2" value={classSectionId} onChange={(e) => { setClassSectionId(e.target.value); setStudentId(""); setBalance(null); }}>
              <option value="">Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.gradeLevel} - {c.section}</option>
              ))}
            </select>
            <select className="border rounded px-3 py-2" value={studentId} onChange={(e) => { setStudentId(e.target.value); setBalance(null); }}>
              <option value="">Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
              ))}
            </select>
            <input className="border rounded px-3 py-2" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
            <input className="border rounded px-3 py-2" value={term} onChange={(e) => setTerm(e.target.value)} />
            <button onClick={loadBalance} disabled={!studentId} className="col-span-1 sm:col-span-2 md:col-span-4 bg-navy text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50">
              Check balance
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          {balance && (
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-4 text-sm">
                <span>Expected: <strong>GH₵ {balance.expected.toFixed(2)}</strong></span>
                <span>Paid: <strong>GH₵ {balance.paid.toFixed(2)}</strong></span>
                <span className={balance.balance > 0 ? "text-red-600" : "text-green-600"}>
                  Balance: <strong>GH₵ {balance.balance.toFixed(2)}</strong>
                </span>
              </div>

              {isAdmin && (
                <form onSubmit={handleRecordPayment} className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    className="border rounded px-3 py-2 w-full sm:w-32"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                  <select
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    placeholder="Reference (optional)"
                    className="border rounded px-3 py-2 flex-1"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  />
                  <button className="w-full sm:w-auto bg-teal text-white rounded px-4 py-2 hover:opacity-90">Record payment</button>
                </form>
              )}

              <div className="divide-y">
                {balance.payments.map((p) => (
                  <div key={p.id} className="py-2 text-sm flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>{p.paymentDate} · {p.method.replace("_", " ")}{p.reference ? ` · ${p.reference}` : ""}</span>
                    <span className="font-medium">GH₵ {parseFloat(p.amount).toFixed(2)}</span>
                  </div>
                ))}
                {balance.payments.length === 0 && <p className="py-2 text-sm text-slate-500">No payments recorded yet.</p>}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}