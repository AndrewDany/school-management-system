import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function StudentFeesScreen() {
  const { user } = useAuth();
  const studentId = user?.studentProfile?.id;
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [term, setTerm] = useState("Term 1");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadBalance() {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await client.get(
        `/fees/balance/${studentId}?academicYear=${academicYear}&term=${term}`
      );
      setBalance(res.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TextInput style={styles.input} value={academicYear} onChangeText={setAcademicYear} placeholder="Academic year" />
        <TextInput style={styles.input} value={term} onChangeText={setTerm} placeholder="Term" />
      </View>
      <TouchableOpacity style={styles.button} onPress={loadBalance}>
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Check balance"}</Text>
      </TouchableOpacity>

      {balance && (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryLine}>Expected: GH₵ {balance.expected.toFixed(2)}</Text>
            <Text style={styles.summaryLine}>Paid: GH₵ {balance.paid.toFixed(2)}</Text>
            <Text
              style={[
                styles.summaryLine,
                styles.balanceLine,
                { color: balance.balance > 0 ? "#dc2626" : "#16a34a" },
              ]}
            >
              Balance: GH₵ {balance.balance.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.historyTitle}>Payment history</Text>
          <FlatList
            data={balance.payments}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>No payments recorded yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.date}>
                  {item.paymentDate} · {item.method.replace("_", " ")}
                </Text>
                <Text style={styles.amount}>GH₵ {parseFloat(item.amount).toFixed(2)}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  filterRow: { flexDirection: "row" },
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
  summary: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryLine: { fontSize: 14, color: "#334155", marginBottom: 4 },
  balanceLine: { fontWeight: "bold", fontSize: 16 },
  historyTitle: { fontWeight: "600", color: "#193e59", marginTop: 20, marginBottom: 8 },
  row: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  date: { color: "#334155", fontSize: 13 },
  amount: { fontWeight: "600", color: "#193e59" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 10 },
});
