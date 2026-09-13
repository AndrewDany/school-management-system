import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import client from "../api/client";

const STATUS_OPTIONS = ["present", "absent", "late", "excused"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherAttendanceScreen({ route }) {
  const { classSection } = route.params;
  const date = todayISO();
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const studentsRes = await client.get(`/students?classSectionId=${classSection.id}`);
      setStudents(studentsRes.data);

      const attendanceRes = await client.get(
        `/attendance?classSectionId=${classSection.id}&date=${date}`
      );
      const map = {};
      attendanceRes.data.forEach((r) => {
        map[r.studentId] = r.status;
      });
      setStatusMap(map);
      setLoading(false);
    }
    load();
  }, [classSection.id]);

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
      await client.post("/attendance", { classSectionId: classSection.id, date, records });
      setMessage("Attendance saved for " + date);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save attendance");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#193e59" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateLabel}>Marking attendance for {date}</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No students in this class.</Text>}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{item.fullName}</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((opt) => {
                const active = (statusMap[item.id] || "present") === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.statusChip, active && styles.statusChipActive]}
                    onPress={() => setStatus(item.id, opt)}
                  >
                    <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save attendance"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  dateLabel: { color: "#64748b", marginBottom: 10 },
  studentRow: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  studentName: { fontWeight: "600", color: "#193e59", marginBottom: 8 },
  statusRow: { flexDirection: "row", gap: 6 },
  statusChip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  statusChipActive: { backgroundColor: "#193e59", borderColor: "#193e59" },
  statusChipText: { fontSize: 12, color: "#334155", textTransform: "capitalize" },
  statusChipTextActive: { color: "#fff" },
  saveButton: {
    backgroundColor: "#1e9e93",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  message: { textAlign: "center", color: "#64748b", marginBottom: 10 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
