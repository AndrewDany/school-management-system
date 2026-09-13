import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function StudentReportCardScreen() {
  const { user } = useAuth();
  const studentId = user?.studentProfile?.id;
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [term, setTerm] = useState("Term 1");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadReport() {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await client.get(
        `/grades/report-card/${studentId}?academicYear=${academicYear}&term=${term}`
      );
      setReport(res.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.input}
          value={academicYear}
          onChangeText={setAcademicYear}
          placeholder="Academic year"
        />
        <TextInput style={styles.input} value={term} onChangeText={setTerm} placeholder="Term" />
      </View>
      <TouchableOpacity style={styles.button} onPress={loadReport}>
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Load report card"}</Text>
      </TouchableOpacity>

      {report && (
        <>
          <FlatList
            style={{ marginTop: 16 }}
            data={report.grades}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>No grades recorded for this term.</Text>}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.subject}>{item.subject?.name}</Text>
                <Text style={styles.score}>{item.score}</Text>
              </View>
            )}
          />
          {report.average !== null && (
            <Text style={styles.average}>Average: {report.average.toFixed(1)}</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  filterRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#1e9e93",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  subject: { color: "#334155" },
  score: { fontWeight: "600", color: "#193e59" },
  average: { fontWeight: "bold", fontSize: 16, color: "#193e59", marginTop: 12, textAlign: "right" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 20 },
});
